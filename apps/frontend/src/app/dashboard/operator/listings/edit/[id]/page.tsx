'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Upload, 
  Info, 
  MapPin, 
  Tag, 
  Image as ImageIcon,
  CheckCircle2,
  ChevronRight,
  Loader2,
  X,
  Save
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { ListingType } from '@/types';

const listingSchema = z.object({
  title: z.string().min(5, 'Le titre doit faire au moins 5 caractères'),
  description: z.string().min(20, 'La description doit faire au moins 20 caractères'),
  listingType: z.nativeEnum(ListingType),
  location: z.string().min(3, 'L\'adresse est requise'),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  pricePerNight: z.number().optional().nullable(),
  pricePerPerson: z.number().optional().nullable(),
  priceFlatRate: z.number().optional().nullable(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.object({
    url: z.string(),
    cloudinaryId: z.string()
  })).optional(),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; cloudinaryId: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema) as any,
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        const data = response.data;
        reset({
          title: data.title,
          description: data.description,
          listingType: data.listingType,
          location: data.location || '',
          lat: data.lat,
          lng: data.lng,
          pricePerNight: data.pricePerNight,
          pricePerPerson: data.pricePerPerson,
          priceFlatRate: data.priceFlatRate,
          amenities: data.amenities || [],
        });
        setUploadedImages(data.images || []);
        setValue('images', data.images || []);
      } catch (error) {
        console.error('Fetch error:', error);
        alert("Impossible de charger l'annonce.");
        router.push('/dashboard/operator/listings');
      } finally {
        setIsFetching(false);
      }
    };
    fetchListing();
  }, [id, reset, router, setValue]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newImages = [...uploadedImages, response.data];
      setUploadedImages(newImages);
      setValue('images', newImages);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Erreur lors de l\'upload de l\'image.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setValue('images', newImages);
  };

  const selectedType = watch('listingType');

  const onSubmit = async (data: ListingFormValues) => {
    setIsLoading(true);
    try {
      await api.patch(`/listings/${id}`, data);
      router.push('/dashboard/operator/listings');
    } catch (error) {
      console.error('Update error:', error);
      alert('Une erreur est survenue lors de la mise à jour.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-subtext font-black uppercase tracking-widest text-xs">Chargement de votre annonce...</p>
      </div>
    );
  }

  const steps = [
    { id: 1, label: 'Informations de base', icon: Info },
    { id: 2, label: 'Localisation & Prix', icon: MapPin },
    { id: 3, label: 'Photos & Validation', icon: ImageIcon },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Link href="/dashboard/operator/listings" className="inline-flex items-center gap-2 text-subtext hover:text-primary font-bold transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Retour aux annonces
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground mb-2">Modifier l'annonce</h1>
          <p className="text-subtext font-medium">Mettez à jour les informations de votre établissement.</p>
        </div>
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="bg-primary text-white px-8 py-4 rounded-[20px] font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Enregistrer
        </button>
      </div>

      <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between px-8">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              currentStep >= step.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-accent/30 text-subtext'
            }`}>
              {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
            </div>
            <span className={`hidden md:block font-black text-xs uppercase tracking-widest ${currentStep >= step.id ? 'text-foreground' : 'text-subtext/60'}`}>
              {step.label}
            </span>
            {i < steps.length - 1 && <ChevronRight className="hidden md:block w-4 h-4 text-subtext/20 ml-4" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden border-t-8 border-t-primary">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="p-10 space-y-8">
            <h2 className="text-2xl font-black text-foreground">Détails de l'offre</h2>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em] ml-1">Titre de l'annonce</label>
              <input 
                {...register('title')}
                type="text" 
                className="w-full px-8 py-5 bg-accent/10 border-none rounded-[20px] focus:ring-2 focus:ring-primary/20 font-bold placeholder:text-subtext/40"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em] ml-1">Type d'offre</label>
              <select 
                {...register('listingType')}
                className="w-full px-8 py-5 bg-accent/10 border-none rounded-[20px] focus:ring-2 focus:ring-primary/20 font-bold cursor-pointer"
              >
                <option value={ListingType.HOTEL_ROOM}>Chambre d'Hôtel</option>
                <option value={ListingType.HOTEL_SUITE}>Suite d'Hôtel</option>
                <option value={ListingType.RESTAURANT_TABLE}>Table de Restaurant</option>
                <option value={ListingType.EXCURSION}>Excursion / Tour</option>
                <option value={ListingType.EVENT_HALL_RENTAL}>Location de Salle</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em] ml-1">Description détaillée</label>
              <textarea 
                {...register('description')}
                rows={8}
                className="w-full px-8 py-5 bg-accent/10 border-none rounded-[20px] focus:ring-2 focus:ring-primary/20 font-bold resize-none leading-relaxed"
              ></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.description.message}</p>}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="p-10 space-y-8">
            <h2 className="text-2xl font-black text-foreground">Localisation & Prix</h2>
            
            <div className="space-y-6 border-b border-gray-50 pb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em] ml-1">Adresse complète / Ville</label>
                <div className="relative">
                  <MapPin className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <input 
                    {...register('location')}
                    type="text" 
                    className="w-full pl-16 pr-8 py-5 bg-accent/10 border-none rounded-[20px] focus:ring-2 focus:ring-primary/20 font-bold"
                  />
                </div>
                {errors.location && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.location.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em] ml-1">Latitude</label>
                  <input 
                    {...register('lat', { valueAsNumber: true })}
                    type="number" 
                    step="any"
                    className="w-full px-8 py-5 bg-accent/10 border-none rounded-[20px] focus:ring-2 focus:ring-primary/20 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em] ml-1">Longitude</label>
                  <input 
                    {...register('lng', { valueAsNumber: true })}
                    type="number" 
                    step="any"
                    className="w-full px-8 py-5 bg-accent/10 border-none rounded-[20px] focus:ring-2 focus:ring-primary/20 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Price Fields based on type */}
            <div className="bg-accent/5 p-8 rounded-[32px] space-y-6">
                {(selectedType === ListingType.HOTEL_ROOM || selectedType === ListingType.HOTEL_SUITE) && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em] ml-1">Prix par nuit (FCFA)</label>
                    <div className="relative">
                      <Tag className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      <input 
                        {...register('pricePerNight', { valueAsNumber: true })}
                        type="number" 
                        className="w-full pl-16 pr-8 py-5 bg-white border-none rounded-[20px] focus:ring-2 focus:ring-primary/20 font-black text-2xl text-primary"
                      />
                    </div>
                  </div>
                )}
                
                {(selectedType === ListingType.RESTAURANT_TABLE || selectedType === ListingType.EXCURSION) && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-subtext uppercase tracking-[0.2em] ml-1">Prix par personne (FCFA)</label>
                    <div className="relative">
                      <Tag className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      <input 
                        {...register('pricePerPerson', { valueAsNumber: true })}
                        type="number" 
                        className="w-full pl-16 pr-8 py-5 bg-white border-none rounded-[20px] focus:ring-2 focus:ring-primary/20 font-black text-2xl text-primary"
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="p-10 space-y-10">
            <h2 className="text-2xl font-black text-foreground">Photos de l'établissement</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-[24px] overflow-hidden group shadow-lg">
                    <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Uploaded" />
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-3 right-3 w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                
                {uploadedImages.length < 10 && (
                  <label className="aspect-square border-4 border-dashed border-accent/40 rounded-[24px] flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/40 hover:bg-accent/5 transition-all bg-accent/10">
                    {isUploading ? (
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="text-primary w-10 h-10 mb-3" />
                        <span className="text-[10px] font-black text-subtext uppercase tracking-widest px-4">Ajouter une photo</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                )}
            </div>
          </div>
        )}

        <div className="p-10 bg-accent/5 border-t border-gray-100 flex items-center justify-between">
          <button 
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || isLoading}
            className="px-10 py-4 text-subtext font-black uppercase tracking-widest text-[10px] hover:text-foreground transition-colors disabled:opacity-30"
          >
            Précédent
          </button>
          
          <button 
            type="button"
            onClick={() => {
                if (currentStep < 3) setCurrentStep(currentStep + 1);
                else handleSubmit(onSubmit)();
            }}
            className="bg-primary text-white px-12 py-5 rounded-[20px] font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-all flex items-center gap-3"
          >
            {currentStep < 3 ? (
              <>
                Suivant
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              <>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
