'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Plus,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { ListingType } from '@/types';
import { X } from 'lucide-react';

const listingSchema = z.object({
  title: z.string().min(5, 'Le titre doit faire au moins 5 caractères'),
  description: z.string().min(20, 'La description doit faire au moins 20 caractères'),
  listingType: z.nativeEnum(ListingType),
  location: z.string().min(3, 'L\'adresse est requise'),
  lat: z.number().optional(),
  lng: z.number().optional(),
  pricePerNight: z.number().optional(),
  pricePerPerson: z.number().optional(),
  priceFlatRate: z.number().optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.object({
    url: z.string(),
    cloudinaryId: z.string()
  })).optional(),
});


type ListingFormValues = z.infer<typeof listingSchema>;

export default function NewListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; cloudinaryId: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema) as any,
    defaultValues: {
      listingType: ListingType.HOTEL_ROOM,
      amenities: [],
      images: []
    }
  });

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
      await api.post('/listings', data);
      router.push('/dashboard/operator/listings');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Une erreur est survenue lors de la création de l\'annonce.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, label: 'Informations de base', icon: Info },
    { id: 2, label: 'Localisation & Prix', icon: MapPin },
    { id: 3, label: 'Photos & Validation', icon: ImageIcon },
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Link href="/dashboard/operator/listings" className="inline-flex items-center gap-2 text-subtext hover:text-primary font-bold transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Retour aux annonces
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Ajouter une nouvelle annonce</h1>
        <p className="text-subtext">Créez une offre attractive pour attirer plus d'usagers.</p>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between px-8">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              currentStep >= step.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-accent/30 text-subtext'
            }`}>
              {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
            </div>
            <span className={`hidden md:block font-bold text-sm ${currentStep >= step.id ? 'text-foreground' : 'text-subtext/60'}`}>
              {step.label}
            </span>
            {i < steps.length - 1 && <ChevronRight className="hidden md:block w-4 h-4 text-subtext/20 ml-4" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Dites-nous en plus sur votre offre</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-subtext ml-1">Titre de l'annonce</label>
              <input 
                {...register('title')}
                type="text" 
                placeholder="Ex: Chambre Deluxe avec vue sur mer - Pointe-Noire"
                className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 ml-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-subtext ml-1">Type d'offre</label>
              <select 
                {...register('listingType')}
                className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium cursor-pointer"
              >
                <option value={ListingType.HOTEL_ROOM}>Chambre d'Hôtel</option>
                <option value={ListingType.HOTEL_SUITE}>Suite d'Hôtel</option>
                <option value={ListingType.RESTAURANT_TABLE}>Table de Restaurant</option>
                <option value={ListingType.EXCURSION}>Excursion / Tour</option>
                <option value={ListingType.EVENT_HALL_RENTAL}>Location de Salle</option>
                <option value={ListingType.CASINO_PACKAGE}>Package Casino</option>
                <option value={ListingType.SPA_SERVICE}>Service Spa</option>
                <option value={ListingType.NIGHTCLUB_ENTRY}>Entrée Boîte de Nuit</option>
                <option value={ListingType.LEISURE_ACTIVITY}>Activité de Loisir Programmé</option>
                <option value={ListingType.KERMESSE}>Stand Kermesse / Foire</option>
                <option value={ListingType.SPECIAL_OFFER}>Offre Spéciale / Promotion</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-subtext ml-1">Description détaillée</label>
              <textarea 
                {...register('description')}
                rows={6}
                placeholder="Décrivez les points forts de votre offre..."
                className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium resize-none"
              ></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-1 ml-1">{errors.description.message}</p>}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Où se trouve votre offre et quel est son prix ?</h2>
            
            <div className="space-y-4 border-b border-gray-100 pb-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-subtext ml-1">Adresse complète / Ville</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
                  <input 
                    {...register('location')}
                    type="text" 
                    placeholder="Ex: Centre-ville, Pointe-Noire"
                    className="w-full pl-16 pr-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium"
                  />
                </div>
                {errors.location && <p className="text-red-500 text-xs mt-1 ml-1">{errors.location.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-subtext ml-1">Latitude (Optionnel)</label>
                  <input 
                    {...register('lat', { valueAsNumber: true })}
                    type="number" 
                    step="any"
                    placeholder="-4.769"
                    className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-subtext ml-1">Longitude (Optionnel)</label>
                  <input 
                    {...register('lng', { valueAsNumber: true })}
                    type="number" 
                    step="any"
                    placeholder="11.866"
                    className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Conditional Price Fields */}
            {(selectedType === ListingType.HOTEL_ROOM || selectedType === ListingType.HOTEL_SUITE) && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-subtext ml-1">Prix par nuit (FCFA)</label>
                <div className="relative">
                  <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
                  <input 
                    {...register('pricePerNight', { valueAsNumber: true })}
                    type="number" 
                    placeholder="0"
                    className="w-full pl-16 pr-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-primary text-xl"
                  />
                </div>
              </div>
            )}

            {(selectedType === ListingType.EXCURSION || selectedType === ListingType.RESTAURANT_TABLE || selectedType === ListingType.TOURIST_SITE_VISIT) && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-subtext ml-1">Prix par personne (FCFA)</label>
                <div className="relative">
                  <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
                  <input 
                    {...register('pricePerPerson', { valueAsNumber: true })}
                    type="number" 
                    placeholder="0"
                    className="w-full pl-16 pr-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-primary text-xl"
                  />
                </div>
              </div>
            )}

            {(selectedType === ListingType.EVENT_HALL_RENTAL || selectedType === ListingType.CASINO_PACKAGE || selectedType === ListingType.NIGHTCLUB_ENTRY) && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-subtext ml-1">Prix Forfaitaire / Entrée (FCFA)</label>
                <div className="relative">
                  <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
                  <input 
                    {...register('priceFlatRate', { valueAsNumber: true })}
                    type="number" 
                    placeholder="0"
                    className="w-full pl-16 pr-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-primary text-xl"
                  />
                </div>
              </div>
            )}
          </div>
        )}


        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Finalisez votre annonce</h2>
            <p className="text-subtext">Vérifiez vos informations avant de publier.</p>
            
            <div className="bg-accent/10 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between border-b border-white pb-2">
                <span className="text-subtext">Titre</span>
                <span className="font-bold">{watch('title')}</span>
              </div>
              <div className="flex justify-between border-b border-white pb-2">
                <span className="text-subtext">Type</span>
                <span className="font-bold">{watch('listingType')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-subtext">Prix</span>
                <span className="font-bold text-primary">
                  {watch('pricePerNight') || watch('pricePerPerson') || watch('priceFlatRate') || 0} FCFA
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                    <img src={img.url} className="w-full h-full object-cover" alt="Uploaded" />
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {uploadedImages.length < 10 && (
                  <label className="aspect-square border-4 border-dashed border-accent/40 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/40 transition-colors bg-accent/5">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="text-primary w-8 h-8 mb-2" />
                        <span className="text-xs font-bold text-subtext px-2">Ajouter une photo</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                )}
              </div>
              
              {uploadedImages.length === 0 && (
                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl text-orange-700 text-sm">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <p>Ajoutez au moins une photo pour rendre votre annonce attractive.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-8 bg-accent/5 border-t border-gray-100 flex items-center justify-between">
          <button 
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || isLoading}
            className="px-8 py-3 text-subtext font-bold hover:text-foreground transition-colors disabled:opacity-30"
          >
            Précédent
          </button>
          
          {currentStep < 3 ? (
            <button 
              type="button"
              onClick={handleNext}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
            >
              Continuer
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publier l\'annonce'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
