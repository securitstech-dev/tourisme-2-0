/** Parcours d'inscription legale des operateurs touristiques. */
'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  ShieldCheck,
  Upload,
} from 'lucide-react';

import api from '@/lib/api';

const businessTypes = [
  'HOTEL',
  'RESTAURANT',
  'CASINO',
  'EVENT_HALL',
  'TOURIST_SITE',
  'TRAVEL_AGENCY',
  'BAR_NIGHTCLUB',
  'GAME_ROOM',
  'JET_SKI_ACTIVITY',
  'CAVE_VIP',
  'SPA_WELLNESS',
  'LODGE_CAMP',
  'OTHER',
] as const;

const onboardingSchema = z.object({
  businessName: z.string().min(3, 'Le nom commercial est requis.'),
  businessType: z.enum(businessTypes, {
    error: 'Selectionnez le type d activite.',
  }),
  description: z.string().min(30, 'Ajoutez une description de 30 caracteres minimum.'),
  rccmNumber: z.string().min(5, 'Le numero RCCM est requis.'),
  taxId: z.string().min(5, 'Le numero NIU est requis.'),
  legalAddress: z.string().min(10, 'L adresse legale est requise.'),
  managerName: z.string().min(3, 'Le nom du gerant est requis.'),
  phone: z.string().min(9, 'Le telephone professionnel est requis.'),
  city: z.string().min(2, 'La ville est requise.'),
  region: z.string().min(2, 'La region est requise.'),
});

type BusinessType = (typeof businessTypes)[number];
type SubscriptionPlan = 'STARTER' | 'PROFESSIONAL' | 'PREMIUM';
type OnboardingValues = z.infer<typeof onboardingSchema>;

type RequiredDocument = {
  id:
    | 'RCCM'
    | 'COMMERCIAL_AUTH'
    | 'NIU'
    | 'PATENTE'
    | 'SAFETY_QUITUS'
    | 'MINISTRY_AUTH'
    | 'MANAGER_ID'
    | 'OTHER';
  label: string;
  detail: string;
  requiredFor: 'ALL' | 'LEISURE' | 'REGULATED';
};

const documentChecklist: RequiredDocument[] = [
  {
    id: 'RCCM',
    label: 'Registre de Commerce et Credit Mobilier',
    detail: 'RCCM lisible au nom de la structure.',
    requiredFor: 'ALL',
  },
  {
    id: 'COMMERCIAL_AUTH',
    label: 'Autorisation d exercer',
    detail: 'Autorisation administrative ou commerciale liee a l activite.',
    requiredFor: 'ALL',
  },
  {
    id: 'NIU',
    label: 'Numero d Identification Unique',
    detail: 'NIU ou justificatif fiscal equivalent.',
    requiredFor: 'ALL',
  },
  {
    id: 'PATENTE',
    label: 'Patente ou preuve de paiement des impots',
    detail: 'Patente, quitus fiscal ou preuve recente de paiement.',
    requiredFor: 'ALL',
  },
  {
    id: 'MANAGER_ID',
    label: 'Piece du gerant',
    detail: 'CNI, passeport ou document officiel du responsable.',
    requiredFor: 'ALL',
  },
  {
    id: 'SAFETY_QUITUS',
    label: 'Quitus des sapeurs-pompiers',
    detail: 'Obligatoire pour bars, caves, VIP, night clubs, salles et loisirs.',
    requiredFor: 'LEISURE',
  },
  {
    id: 'MINISTRY_AUTH',
    label: 'Agrement du ministere de tutelle',
    detail: 'Agrement ou autorisation sectorielle pour activites reglementees.',
    requiredFor: 'REGULATED',
  },
  {
    id: 'OTHER',
    label: 'Autres documents utiles',
    detail: 'Assurance, bail, certificat sanitaire, licence ou convention.',
    requiredFor: 'REGULATED',
  },
];

const planCards: Array<{
  key: SubscriptionPlan;
  label: string;
  price: string;
  description: string;
  limits: string[];
}> = [
  {
    key: 'STARTER',
    label: 'Essentiel',
    price: '15 000 FCFA',
    description: 'Pour une petite activite qui veut etre visible.',
    limits: ['3 offres actives apres essai', '150 000 FCFA/an au lieu de 180 000', 'Support standard'],
  },
  {
    key: 'PROFESSIONAL',
    label: 'Croissance',
    price: '45 000 FCFA',
    description: 'Le plan recommande pour les operateurs reguliers.',
    limits: ['12 offres actives apres essai', '450 000 FCFA/an au lieu de 540 000', 'Mise en avant locale'],
  },
  {
    key: 'PREMIUM',
    label: 'Premium',
    price: '120 000 FCFA',
    description: 'Pour les groupes, lieux premium et partenaires strategiques.',
    limits: ['Offres illimitees apres essai', '1 200 000 FCFA/an au lieu de 1 440 000', 'Priorite marketing'],
  },
];

const leisureTypes: BusinessType[] = [
  'CASINO',
  'EVENT_HALL',
  'BAR_NIGHTCLUB',
  'GAME_ROOM',
  'JET_SKI_ACTIVITY',
  'CAVE_VIP',
  'SPA_WELLNESS',
  'OTHER',
];
const regulatedTypes: BusinessType[] = ['HOTEL', 'TRAVEL_AGENCY', 'TOURIST_SITE', 'CASINO', 'EVENT_HALL', 'BAR_NIGHTCLUB', 'CAVE_VIP'];
const acceptedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const maxFileSize = 10 * 1024 * 1024;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Une erreur est survenue. Verifiez votre connexion puis reessayez.';
}

export default function OperatorOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('PROFESSIONAL');
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const [uploadingDocs, setUploadingDocs] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      businessType: 'HOTEL',
    },
  });

  const currentBusinessType = watch('businessType');

  const requiredDocs = useMemo(() => {
    return documentChecklist.filter((document) => {
      if (document.requiredFor === 'ALL') {
        return true;
      }

      if (document.requiredFor === 'LEISURE') {
        return leisureTypes.includes(currentBusinessType);
      }

      return regulatedTypes.includes(currentBusinessType);
    });
  }, [currentBusinessType]);

  const uploadedRequiredCount = requiredDocs.filter((document) => uploadedDocs[document.id]).length;
  const isDocumentStepComplete = uploadedRequiredCount === requiredDocs.length;

  const handleFileSelection = async (document: RequiredDocument, file: File) => {
    setErrorMessage(null);

    if (!acceptedMimeTypes.includes(file.type)) {
      setErrorMessage('Format refuse. Utilisez PDF, JPG, PNG ou WEBP.');
      return;
    }

    if (file.size > maxFileSize) {
      setErrorMessage('Le fichier depasse 10 Mo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', document.id);

    setUploadingDocs((current) => ({ ...current, [document.id]: true }));

    try {
      await api.post('/operators/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadedDocs((current) => ({
        ...current,
        [document.id]: file.name,
      }));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setUploadingDocs((current) => ({ ...current, [document.id]: false }));
    }
  };

  const onSubmit = async (values: OnboardingValues) => {
    setErrorMessage(null);

    if (!isDocumentStepComplete) {
      setErrorMessage('Ajoutez toutes les pieces obligatoires avant la soumission.');
      setStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      const { legalAddress, ...profile } = values;

      await api.patch('/operators/profile', {
        ...profile,
        address: legalAddress,
        legalAddress,
        subscriptionPlan: selectedPlan,
      });

      setMessage('Dossier soumis. Apres validation du superadmin, vous aurez 14 jours d essai gratuit avec acces complet. A la fin de l essai, vous choisirez un abonnement mensuel ou annuel.');
      setStep(4);
    } catch (error) {
      setMessage('Mode demo actif : le dossier est pret a etre presente. Connectez le backend pour envoyer les pieces reellement.');
      setErrorMessage(getErrorMessage(error));
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 4) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-lg">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black text-foreground sm:text-5xl">Dossier operateur pret</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-subtext">{message}</p>
        {errorMessage && (
          <p className="mx-auto mt-5 max-w-2xl rounded-xl border border-secondary/30 bg-secondary/10 p-4 text-sm font-bold text-foreground">
            Information technique : {errorMessage}
          </p>
        )}
        <button
          type="button"
          onClick={() => router.push('/dashboard/operator')}
          className="mt-9 rounded-xl bg-primary px-8 py-4 text-sm font-black text-white shadow-lg shadow-primary/20"
        >
          Aller au tableau de bord
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8">
      <header className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-danger">Verification Securits Tech</p>
              <h1 className="mt-2 text-2xl font-black text-foreground sm:text-4xl">
                Inscription operateur
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-subtext">
                Completez le dossier administratif. Les acces commerciaux restent bloques jusqu a la validation du superadmin et le paiement du plan choisi.
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-accent p-4 text-sm font-bold text-primary">
            {uploadedRequiredCount}/{requiredDocs.length} pieces obligatoires
          </div>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {['Identite legale', 'Documents', 'Plan SaaS'].map((label, index) => {
          const current = index + 1;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setStep(current)}
              className={`rounded-xl border p-4 text-left text-sm font-black transition ${
                step === current ? 'border-primary bg-primary text-white' : 'border-border bg-white text-subtext'
              }`}
            >
              Etape {current}
              <span className="mt-1 block text-xs opacity-80">{label}</span>
            </button>
          );
        })}
      </div>

      {errorMessage && step !== 4 && (
        <div className="flex gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm font-bold text-danger">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-black">
                <Building2 className="h-6 w-6 text-primary" />
                Identite de l etablissement
              </h2>
              <div className="space-y-5">
                <FieldError message={errors.businessName?.message} label="Nom commercial">
                  <input {...register('businessName')} className="form-input" placeholder="Ex : Mayombe Luxury Resort" />
                </FieldError>
                <FieldError message={errors.businessType?.message} label="Type d activite">
                  <select {...register('businessType')} className="form-input">
                    <option value="HOTEL">Hotel / hebergement</option>
                    <option value="RESTAURANT">Restaurant</option>
                    <option value="CASINO">Casino / jeux</option>
                    <option value="EVENT_HALL">Salle de fete</option>
                    <option value="TOURIST_SITE">Site touristique</option>
                    <option value="TRAVEL_AGENCY">Agence de voyage</option>
                    <option value="BAR_NIGHTCLUB">Bar / cave / VIP / night club</option>
                    <option value="GAME_ROOM">Salle de jeux de societe</option>
                    <option value="JET_SKI_ACTIVITY">Jet ski / activites nautiques</option>
                    <option value="CAVE_VIP">Cave / lounge VIP</option>
                    <option value="SPA_WELLNESS">Bien-etre / spa</option>
                    <option value="LODGE_CAMP">Lodge / campement</option>
                    <option value="OTHER">Autre loisir ou activite</option>
                  </select>
                </FieldError>
                <FieldError message={errors.description?.message} label="Presentation">
                  <textarea {...register('description')} className="form-input min-h-28 resize-none" placeholder="Decrivez votre activite, votre capacite et votre valeur pour les visiteurs." />
                </FieldError>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-black">
                <MapPin className="h-6 w-6 text-primary" />
                Informations administratives
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <FieldError message={errors.rccmNumber?.message} label="RCCM">
                  <input {...register('rccmNumber')} className="form-input" placeholder="CG-PNR-..." />
                </FieldError>
                <FieldError message={errors.taxId?.message} label="NIU">
                  <input {...register('taxId')} className="form-input" placeholder="M..." />
                </FieldError>
                <FieldError message={errors.managerName?.message} label="Gerant">
                  <input {...register('managerName')} className="form-input" />
                </FieldError>
                <FieldError message={errors.phone?.message} label="Telephone">
                  <input {...register('phone')} className="form-input" placeholder="+242 ..." />
                </FieldError>
                <FieldError message={errors.city?.message} label="Ville">
                  <input {...register('city')} className="form-input" />
                </FieldError>
                <FieldError message={errors.region?.message} label="Region">
                  <input {...register('region')} className="form-input" />
                </FieldError>
                <div className="sm:col-span-2">
                  <FieldError message={errors.legalAddress?.message} label="Adresse legale">
                    <textarea {...register('legalAddress')} className="form-input min-h-24 resize-none" />
                  </FieldError>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-8 w-full rounded-xl bg-primary px-6 py-4 text-sm font-black text-white"
              >
                Continuer vers les documents
              </button>
            </section>
          </div>
        )}

        {step === 2 && (
          <section className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="flex items-center gap-3 text-2xl font-black">
                  <FileText className="h-7 w-7 text-primary" />
                  Dossier administratif
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-subtext">
                  Formats acceptes : PDF, JPG, PNG, WEBP. Taille maximale : 10 Mo par piece.
                </p>
              </div>
              <div className="rounded-xl bg-secondary/15 px-4 py-3 text-sm font-black text-foreground">
                {uploadedRequiredCount}/{requiredDocs.length} ajoutes
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {requiredDocs.map((document) => (
                <div
                  key={document.id}
                  className={`rounded-xl border p-5 ${
                    uploadedDocs[document.id] ? 'border-primary/30 bg-primary/5' : 'border-border bg-background'
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black text-foreground">{document.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-subtext">{document.detail}</p>
                    </div>
                    {uploadedDocs[document.id] && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />}
                  </div>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-white px-4 py-4 text-sm font-black text-primary transition hover:bg-accent">
                    <Upload className="h-4 w-4" />
                    {uploadingDocs[document.id] ? 'Envoi en cours...' : uploadedDocs[document.id] ?? 'Ajouter le fichier'}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          handleFileSelection(document, file);
                        }
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-border px-6 py-4 text-sm font-black">
                Retour
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!isDocumentStepComplete}
                className="flex-1 rounded-xl bg-primary px-6 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                Choisir le plan d abonnement
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-6">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-3 text-2xl font-black">
                <CreditCard className="h-7 w-7 text-primary" />
                Plan SaaS et activation
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-subtext">
                Vous beneficiez de 14 jours d essai gratuit apres validation. Les limites de publication s appliquent seulement apres l essai, selon le plan mensuel ou annuel choisi.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {planCards.map((plan) => (
                <button
                  key={plan.key}
                  type="button"
                  onClick={() => setSelectedPlan(plan.key)}
                  className={`rounded-xl border p-6 text-left transition ${
                    selectedPlan === plan.key ? 'border-primary bg-primary text-white shadow-lg' : 'border-border bg-white'
                  }`}
                >
                  <BadgeCheck className="h-7 w-7" />
                  <h3 className="mt-5 text-2xl font-black">{plan.label}</h3>
                  <p className="mt-2 text-sm opacity-80">{plan.description}</p>
                  <p className="mt-6 text-3xl font-black">{plan.price}</p>
                  <ul className="mt-6 space-y-3 text-sm font-bold">
                    {plan.limits.map((limit) => (
                      <li key={limit} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {limit}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-secondary/30 bg-secondary/10 p-5 text-sm leading-7 text-foreground">
              Apres l essai : paiement mensuel ou annuel via MTN Mobile Money, Airtel Money, Stripe ou validation manuelle superadmin. L abonnement annuel inclut une reduction.
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(2)} className="rounded-xl border border-border px-6 py-4 text-sm font-black">
                Retour
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-black text-white disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Soumettre au superadmin
              </button>
            </div>
          </section>
        )}
      </form>
    </div>
  );
}

function FieldError({
  label,
  message,
  children,
}: {
  label: string;
  message?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-subtext">{label}</span>
      {children}
      {message && <span className="block text-xs font-bold text-danger">{message}</span>}
    </label>
  );
}
