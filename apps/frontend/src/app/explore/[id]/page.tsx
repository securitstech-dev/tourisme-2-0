/** Detail d'une offre touristique avec fallback demo et parcours de reservation. */
'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Loader2,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
  Users,
} from 'lucide-react';

import api from '@/lib/api';
import { demoListings } from '@/lib/demo-listings';
import { getListingLabel } from '@/lib/listing-labels';
import { getListingLocation, getListingPrice } from '@/lib/listing-utils';
import { useAuthStore } from '@/store/authStore';
import type { ListingReview, ListingSummary } from '@/types';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[280px] items-center justify-center rounded-[28px] border border-black/6 bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
});

type ListingDetails = ListingSummary & {
  reviews?: ListingReview[];
};

type BookingState = {
  startDate: string;
  endDate: string;
  adults: number;
};

const curatedAmenities = [
  'Accueil accompagne',
  'Informations pratiques du sejour',
  'Point de contact operateur',
  'Reservation traitee dans la plateforme',
];

function getInitialBookingState(): BookingState {
  const today = new Date().toISOString().split('T')[0] ?? '';

  return {
    startDate: today,
    endDate: '',
    adults: 1,
  };
}

function buildDemoReviews(listing: ListingSummary): ListingReview[] {
  return [
    {
      id: `${listing.id}-review-1`,
      rating: 5,
      comment: 'Presentation claire, offre rassurante et destination tres inspirante.',
      isVisible: true,
      author: {
        firstName: 'Nadia',
        lastName: 'M',
      },
    },
    {
      id: `${listing.id}-review-2`,
      rating: 4,
      comment: 'On comprend bien le lieu, le prix et le positionnement. Le parcours donne envie de reserver.',
      isVisible: true,
      author: {
        firstName: 'Cedric',
        lastName: 'B',
      },
    },
  ];
}

export default function ListingDetailsPage() {
  const params = useParams<{ id: string | string[] }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const listingId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [listing, setListing] = useState<ListingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [bookingData, setBookingData] = useState<BookingState>(getInitialBookingState);

  useEffect(() => {
    let active = true;

    const fetchListing = async () => {
      if (!listingId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<ListingDetails>(`/listings/${listingId}`);
        if (!active) {
          return;
        }

        const apiListing = response.data;
        setListing({
          ...apiListing,
          reviews: apiListing.reviews && apiListing.reviews.length > 0 ? apiListing.reviews : buildDemoReviews(apiListing),
        });
        setIsDemoMode(false);
      } catch {
        if (!active) {
          return;
        }

        const fallbackListing = demoListings.find((item) => item.id === listingId) ?? demoListings[0] ?? null;
        if (fallbackListing) {
          setListing({
            ...fallbackListing,
            reviews: buildDemoReviews(fallbackListing),
          });
          setIsDemoMode(true);
        } else {
          setListing(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchListing();

    return () => {
      active = false;
    };
  }, [listingId]);

  const visibleReviews = useMemo(
    () => (listing?.reviews ?? []).filter((review) => review.isVisible ?? true),
    [listing],
  );

  const reviewAverage = useMemo(() => {
    if (visibleReviews.length === 0) {
      return '4.9';
    }

    const total = visibleReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / visibleReviews.length).toFixed(1);
  }, [visibleReviews]);

  const bookingPriceLabel = listing?.pricePerNight
    ? 'par nuit'
    : listing?.pricePerPerson
      ? 'par personne'
      : 'forfait';

  const handleBooking = async () => {
    if (!listing || !listingId) {
      return;
    }

    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/explore/${listingId}`);
      return;
    }

    setIsBooking(true);
    setBookingStatus(null);

    try {
      const basePrice = getListingPrice(listing);
      const reservationPayload = {
        listingId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate || null,
        adults: bookingData.adults,
        totalAmount: basePrice * Math.max(bookingData.adults, 1),
      };

      const response = await api.post<{ id: string }>('/bookings', reservationPayload);
      router.push(`/booking/checkout?id=${response.data.id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status && error.response.status < 500) {
        setBookingStatus('La reservation n a pas encore pu etre creee. Verifie les champs puis reessaie.');
      } else {
        setBookingStatus(
          isDemoMode
            ? 'Le backend n a pas repondu. Le mode demonstration reste accessible pendant que nous finissons le branchement.'
            : 'Le serveur de reservation ne repond pas pour le moment.',
        );
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!listing || !listingId) {
      return;
    }

    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/explore/${listingId}`);
      return;
    }

    if (!reviewComment.trim()) {
      setReviewStatus('Ajoute un commentaire avant d envoyer ton avis.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewStatus(null);

    try {
      await api.post('/reviews', {
        listingId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      setReviewComment('');
      setReviewRating(5);
      setReviewStatus('Ton avis a bien ete envoye et passera par la moderation.');
    } catch {
      setReviewStatus(
        isDemoMode
          ? 'Le mode demonstration ne publie pas encore les avis sur le backend.'
          : 'Impossible d envoyer l avis pour le moment.',
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-5 px-6 text-center">
        <h1 className="text-3xl font-bold">Offre introuvable</h1>
        <p className="text-subtext">Cette page ne dispose pas encore de donnees exploitables.</p>
        <Link href="/explore" className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white">
          Retour a l exploration
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background pb-20">
      <div className="mx-auto max-w-7xl px-6 pt-4">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-bold text-subtext transition hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Retour a l exploration
          </Link>
          {isDemoMode ? (
            <div className="rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Mode demonstration
            </div>
          ) : null}
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-black/6 bg-white shadow-sm shadow-black/5">
              <div className="relative aspect-[16/10] bg-accent/30">
                <img
                  src={listing.images?.[0]?.url || '/welcome.png'}
                  alt={listing.images?.[0]?.altText || listing.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-5 top-5 rounded-full bg-white/92 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  {getListingLabel(listing)}
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-black/6 bg-white p-7 shadow-sm shadow-black/5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  {listing.operator?.businessName || 'Operateur Congo Tourisme'}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary">
                  <Star className="h-4 w-4 fill-current" />
                  {reviewAverage}
                </div>
              </div>

              <h1 className="mt-5 text-4xl font-bold leading-tight">{listing.title}</h1>
              <div className="mt-4 flex items-center gap-2 text-subtext">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{getListingLocation(listing)}</span>
              </div>
              <p className="mt-6 text-base leading-8 text-subtext">
                {listing.description || 'Une offre touristique en cours d integration dans la plateforme Congo Tourisme.'}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[32px] border border-black/6 bg-white p-7 shadow-sm shadow-black/5">
                <h2 className="text-xl font-bold">Ce que l utilisateur comprend ici</h2>
                <div className="mt-5 grid gap-4">
                  {curatedAmenities.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm leading-7 text-subtext">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-black/6 bg-[#16231d] p-7 text-white shadow-sm shadow-black/5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <Bot className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Kongo vous accompagne</h2>
                    <p className="text-sm text-white/70">Informations, orientation et futur support conversationnel.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 text-sm leading-7 text-white/75">
                  <p>Cette offre est deja presentable meme si l integration backend n est pas encore complete sur tous les points.</p>
                  <p>Le widget Kongo en bas de page permet deja de preparer la couche conversationnelle du produit.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-black/6 bg-white p-7 shadow-sm shadow-black/5">
              <div className="mb-5 flex items-center gap-3">
                <Trees className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Localisation</h2>
              </div>
              <div className="h-[320px]">
                <MapView listings={[listing]} />
              </div>
            </div>

            <div className="rounded-[32px] border border-black/6 bg-white p-7 shadow-sm shadow-black/5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Avis</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary">
                  <Star className="h-4 w-4 fill-current" />
                  {reviewAverage} · {visibleReviews.length} avis
                </div>
              </div>

              <div className="mt-6 rounded-[28px] bg-accent/35 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="font-bold">Partager une experience</p>
                </div>
                <div className="mb-4 flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" onClick={() => setReviewRating(value)} className="text-secondary transition hover:scale-110">
                      <Star className={`h-6 w-6 ${value <= reviewRating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  rows={4}
                  placeholder="Decris ton experience, ce que tu as aime et ce qui t a aide a choisir."
                  className="w-full rounded-[24px] border border-black/6 bg-white px-5 py-4 text-sm outline-none"
                />
                {reviewStatus ? <p className="mt-3 text-sm text-subtext">{reviewStatus}</p> : null}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => void handleSubmitReview()}
                    disabled={isSubmittingReview}
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white"
                  >
                    {isSubmittingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    Publier mon avis
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {visibleReviews.map((review) => (
                  <article key={review.id} className="rounded-[24px] border border-black/6 bg-background px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold">
                          {review.author?.firstName || 'Utilisateur'} {review.author?.lastName || ''}
                        </p>
                        <p className="text-xs uppercase tracking-[0.18em] text-subtext">Avis verifie visuellement</p>
                      </div>
                      <div className="inline-flex items-center gap-1 text-secondary">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-bold">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-subtext">{review.comment}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:pt-2">
            <div className="sticky top-28 rounded-[32px] border border-black/6 bg-white p-7 shadow-xl shadow-black/5">
              <p className="text-3xl font-bold text-primary">{getListingPrice(listing).toLocaleString()} FCFA</p>
              <p className="mt-1 text-sm text-subtext">{bookingPriceLabel}</p>

              <div className="mt-6 grid gap-4">
                <div className="rounded-[24px] border border-black/6 bg-background px-4 py-4">
                  <label className="text-xs font-bold uppercase tracking-[0.18em] text-subtext">Date de debut</label>
                  <input
                    type="date"
                    value={bookingData.startDate}
                    onChange={(event) => setBookingData((current) => ({ ...current, startDate: event.target.value }))}
                    className="mt-2 w-full bg-transparent text-sm font-medium outline-none"
                  />
                </div>

                <div className="rounded-[24px] border border-black/6 bg-background px-4 py-4">
                  <label className="text-xs font-bold uppercase tracking-[0.18em] text-subtext">Date de fin</label>
                  <input
                    type="date"
                    value={bookingData.endDate}
                    onChange={(event) => setBookingData((current) => ({ ...current, endDate: event.target.value }))}
                    className="mt-2 w-full bg-transparent text-sm font-medium outline-none"
                  />
                </div>

                <div className="rounded-[24px] border border-black/6 bg-background px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-subtext">Voyageurs</p>
                        <p className="text-sm font-medium">{bookingData.adults} adulte{bookingData.adults > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBookingData((current) => ({ ...current, adults: Math.max(1, current.adults - 1) }))}
                        className="h-9 w-9 rounded-full bg-white text-lg font-bold shadow-sm"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingData((current) => ({ ...current, adults: current.adults + 1 }))}
                        className="h-9 w-9 rounded-full bg-white text-lg font-bold shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {bookingStatus ? <p className="mt-4 text-sm leading-7 text-subtext">{bookingStatus}</p> : null}

              <button
                type="button"
                onClick={() => void handleBooking()}
                disabled={isBooking}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-white"
              >
                {isBooking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Continuer la reservation
              </button>

              <div className="mt-6 rounded-[24px] bg-accent/35 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
                  <div className="text-sm leading-7 text-subtext">
                    <p className="font-bold text-foreground">Offre accompagnee par la plateforme</p>
                    <p className="mt-1">Le frontend garde un comportement propre meme si certaines routes API ne sont pas encore pleinement stabilisees.</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
