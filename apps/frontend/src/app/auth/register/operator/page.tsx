'use client';

/** Fiche d'inscription dédiée aux opérateurs touristiques — formulaire 4 étapes. */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import {
  Landmark, ArrowRight, ArrowLeft, Loader2, CheckCircle2,
  User, Mail, Lock, Building2, Phone, MapPin, FileText,
  Briefcase, Globe, BadgeCheck, Sparkles,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// ─── Types d'activité ─────────────────────────────────────────────────────────
const BUSINESS_TYPES = [
  { value: 'HOTEL',          label: 'Hôtel / Lodge',          icon: '🏨' },
  { value: 'RESTAURANT',     label: 'Restaurant',              icon: '🍽️' },
  { value: 'BAR_NIGHTCLUB',  label: 'Bar / Boîte de nuit',    icon: '🎶' },
  { value: 'CAVE_VIP',       label: 'Cave / VIP Lounge',      icon: '🥂' },
  { value: 'CASINO',         label: 'Casino / Jeux',           icon: '🎰' },
  { value: 'GAME_ROOM',      label: 'Salle de jeux',           icon: '🎱' },
  { value: 'EVENT_HALL',     label: 'Salle d\'événements',    icon: '🎪' },
  { value: 'TOURIST_SITE',   label: 'Site touristique',        icon: '🏛️' },
  { value: 'TRAVEL_AGENCY',  label: 'Agence de voyage',        icon: '✈️' },
  { value: 'SPA_WELLNESS',   label: 'Spa / Bien-être',         icon: '💆' },
  { value: 'LODGE_CAMP',     label: 'Lodge / Camp nature',     icon: '⛺' },
  { value: 'JET_SKI_ACTIVITY', label: 'Jet-ski / Activités',  icon: '🚤' },
  { value: 'OTHER',          label: 'Autre activité',          icon: '🌟' },
] as const;

const REGIONS = [
  'Brazzaville', 'Pointe-Noire', 'Dolisie (Niari)',
  'Owando (Cuvette)', 'Ouesso (Sangha)', 'Impfondo (Likouala)',
  'Sibiti (Lékoumou)', 'Kinkala (Pool)', 'Djambala (Plateaux)',
  'Madingou (Bouenza)', 'Mossendjo (Niari)', 'Ewo (Cuvette-Ouest)',
];

// ─── Schémas Zod par étape ────────────────────────────────────────────────────
const step1Schema = z.object({
  firstName:   z.string().min(2, 'Prénom trop court'),
  lastName:    z.string().min(2, 'Nom trop court'),
  email:       z.string().email('Email invalide'),
  password:    z.string().min(8, 'Minimum 8 caractères'),
  confirmPass: z.string(),
}).refine(d => d.password === d.confirmPass, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPass'],
});

const step2Schema = z.object({
  businessName: z.string().min(3, 'Nom d\'établissement requis (min. 3 car.)'),
  businessType: z.string().min(1, 'Choisissez un type d\'activité'),
  managerName:  z.string().min(3, 'Nom du gérant requis'),
  phone:        z.string().min(9, 'Téléphone invalide'),
  whatsapp:     z.string().optional(),
});

const step3Schema = z.object({
  region:      z.string().min(1, 'Choisissez une région'),
  city:        z.string().min(2, 'Ville requise'),
  address:     z.string().min(5, 'Adresse requise'),
  description: z.string().min(30, 'Description trop courte (min. 30 car.)').max(500),
  rccmNumber:  z.string().optional(),
  taxId:       z.string().optional(),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;

// ─── Composant champ générique ────────────────────────────────────────────────
function Field({
  label, icon: Icon, error, children,
}: {
  label: string;
  icon?: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-1'>
      <label className='ml-1 text-xs font-bold uppercase tracking-wider text-[#5F5E5A]'>{label}</label>
      <div className='relative'>
        {Icon && <Icon className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F5E5A]/40' />}
        {children}
      </div>
      {error && <p className='ml-1 mt-1 text-[10px] text-red-500'>{error}</p>}
    </div>
  );
}

const inputCls = (hasIcon = true) =>
  `w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-[#E8F5EF]/40 border border-[#1A6B4A]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A6B4A]/20 font-medium text-[#1A1A1A] placeholder:text-[#5F5E5A]/30 transition`;

// ─── Barre de progression ─────────────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'Compte' },
    { n: 2, label: 'Établissement' },
    { n: 3, label: 'Localisation' },
    { n: 4, label: 'Confirmation' },
  ];
  return (
    <div className='flex items-center justify-between px-8 py-5 border-b border-gray-100'>
      {steps.map((s, i) => (
        <div key={s.n} className='flex items-center gap-2'>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black transition-all ${
            s.n < current ? 'bg-[#1A6B4A] text-white' :
            s.n === current ? 'bg-[#1A6B4A] text-white ring-4 ring-[#1A6B4A]/20' :
            'bg-gray-100 text-[#5F5E5A]'
          }`}>
            {s.n < current ? <CheckCircle2 className='h-4 w-4' /> : s.n}
          </div>
          <span className={`hidden text-xs font-bold sm:block ${s.n === current ? 'text-[#1A6B4A]' : 'text-[#5F5E5A]'}`}>
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div className={`mx-1 h-0.5 w-6 sm:w-10 rounded-full transition-all ${s.n < current ? 'bg-[#1A6B4A]' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function OperatorRegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore(s => s.setAuth);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('');

  // Données accumulées entre étapes
  const [formData, setFormData] = useState<Partial<Step1 & Step2 & Step3>>({});

  // Formulaires par étape
  const form1 = useForm<Step1>({ resolver: zodResolver(step1Schema) as any, defaultValues: formData });
  const form2 = useForm<Step2>({ resolver: zodResolver(step2Schema) as any, defaultValues: formData });
  const form3 = useForm<Step3>({ resolver: zodResolver(step3Schema) as any, defaultValues: formData });

  const next1 = form1.handleSubmit(data => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  });

  const next2 = form2.handleSubmit(data => {
    setFormData(prev => ({ ...prev, ...data, businessType: selectedType || data.businessType }));
    setStep(3);
  });

  const next3 = form3.handleSubmit(data => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(4);
  });

  const submit = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const { confirmPass, ...restData } = formData;
      const payload = {
        ...restData,
        role: 'OPERATOR',
        businessType: selectedType || formData.businessType,
      };
      const { data } = await api.post('/auth/register', payload);
      setAuth(data.user, data.backend_tokens.accessToken, data.backend_tokens.refreshToken);
      router.push('/dashboard/operator');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Une erreur est survenue');
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#E8F5EF] via-[#FAFAF8] to-[#E8F5EF]/50 flex items-center justify-center p-4'>
      <div className='w-full max-w-xl'>

        {/* Logo */}
        <div className='mb-6 flex flex-col items-center text-center'>
          <Link href='/' className='mb-3 inline-flex items-center gap-2'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-[#1A6B4A] shadow-lg shadow-[#1A6B4A]/30'>
              <Landmark className='h-6 w-6 text-white' />
            </div>
            <span className='text-xl font-black text-[#1A6B4A]'>Congo Tourisme</span>
          </Link>
          <div className='inline-flex items-center gap-2 rounded-full bg-[#C8860A]/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#C8860A]'>
            <Sparkles className='h-3 w-3' />
            Inscription Opérateur
          </div>
        </div>

        {/* Card principale */}
        <div className='overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl'>
          <StepBar current={step} />

          {/* ── ÉTAPE 1 — Informations de compte ── */}
          {step === 1 && (
            <form onSubmit={next1} className='space-y-5 p-8'>
              <div>
                <h2 className='text-2xl font-black text-[#1A1A1A]'>Vos informations personnelles</h2>
                <p className='mt-1 text-sm text-[#5F5E5A]'>Ces données servent à créer votre compte sécurisé.</p>
              </div>

              {apiError && (
                <div className='rounded-xl border border-red-100 bg-red-50 p-3 text-center text-sm text-red-600'>{apiError}</div>
              )}

              <div className='grid grid-cols-2 gap-4'>
                <Field label='Prénom' icon={User} error={form1.formState.errors.firstName?.message}>
                  <input {...form1.register('firstName')} placeholder='Jean' className={inputCls()} />
                </Field>
                <Field label='Nom' icon={User} error={form1.formState.errors.lastName?.message}>
                  <input {...form1.register('lastName')} placeholder='Moukoko' className={inputCls()} />
                </Field>
              </div>

              <Field label='Adresse email' icon={Mail} error={form1.formState.errors.email?.message}>
                <input {...form1.register('email')} type='email' placeholder='contact@monentreprise.cg' className={inputCls()} />
              </Field>

              <Field label='Mot de passe' icon={Lock} error={form1.formState.errors.password?.message}>
                <input {...form1.register('password')} type='password' placeholder='Minimum 8 caractères' className={inputCls()} />
              </Field>

              <Field label='Confirmer le mot de passe' icon={Lock} error={form1.formState.errors.confirmPass?.message}>
                <input {...form1.register('confirmPass')} type='password' placeholder='Retapez votre mot de passe' className={inputCls()} />
              </Field>

              <button type='submit' className='flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1A6B4A] py-4 font-black text-white shadow-lg shadow-[#1A6B4A]/25 transition hover:bg-[#1A6B4A]/90'>
                Continuer <ArrowRight className='h-4 w-4' />
              </button>

              <p className='text-center text-sm text-[#5F5E5A]'>
                Déjà un compte ?{' '}
                <Link href='/auth/login?portal=operator' className='font-bold text-[#1A6B4A] hover:underline'>Se connecter</Link>
              </p>
            </form>
          )}

          {/* ── ÉTAPE 2 — Informations établissement ── */}
          {step === 2 && (
            <form onSubmit={next2} className='space-y-5 p-8'>
              <div>
                <h2 className='text-2xl font-black text-[#1A1A1A]'>Votre établissement</h2>
                <p className='mt-1 text-sm text-[#5F5E5A]'>Décrivez votre activité touristique.</p>
              </div>

              <Field label="Nom de l'établissement" icon={Building2} error={form2.formState.errors.businessName?.message}>
                <input {...form2.register('businessName')} placeholder='Ex: Hôtel Mboko Palace' className={inputCls()} />
              </Field>

              {/* Sélection du type d'activité */}
              <div className='space-y-2'>
                <label className='ml-1 text-xs font-bold uppercase tracking-wider text-[#5F5E5A]'>Type d&apos;activité *</label>
                <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
                  {BUSINESS_TYPES.map(t => (
                    <button
                      key={t.value}
                      type='button'
                      onClick={() => { setSelectedType(t.value); form2.setValue('businessType', t.value); }}
                      className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center text-xs font-bold transition-all ${
                        selectedType === t.value
                          ? 'border-[#1A6B4A] bg-[#E8F5EF] text-[#1A6B4A] ring-2 ring-[#1A6B4A]/20'
                          : 'border-gray-100 bg-gray-50 text-[#5F5E5A] hover:border-[#1A6B4A]/30'
                      }`}
                    >
                      <span className='text-lg'>{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
                {form2.formState.errors.businessType && (
                  <p className='ml-1 text-[10px] text-red-500'>{form2.formState.errors.businessType.message}</p>
                )}
              </div>

              <Field label='Nom du gérant' icon={Briefcase} error={form2.formState.errors.managerName?.message}>
                <input {...form2.register('managerName')} placeholder='Jean-Pierre Moukoko' className={inputCls()} />
              </Field>

              <div className='grid grid-cols-2 gap-4'>
                <Field label='Téléphone' icon={Phone} error={form2.formState.errors.phone?.message}>
                  <input {...form2.register('phone')} placeholder='+242 06 XXX XXXX' className={inputCls()} />
                </Field>
                <Field label='WhatsApp (optionnel)' icon={Phone} error={form2.formState.errors.whatsapp?.message}>
                  <input {...form2.register('whatsapp')} placeholder='+242 06 XXX XXXX' className={inputCls()} />
                </Field>
              </div>

              <div className='flex gap-3'>
                <button type='button' onClick={() => setStep(1)} className='flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-4 font-bold text-[#5F5E5A] transition hover:bg-gray-50'>
                  <ArrowLeft className='h-4 w-4' /> Retour
                </button>
                <button type='submit' className='flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1A6B4A] py-4 font-black text-white shadow-lg shadow-[#1A6B4A]/25 transition hover:bg-[#1A6B4A]/90'>
                  Continuer <ArrowRight className='h-4 w-4' />
                </button>
              </div>
            </form>
          )}

          {/* ── ÉTAPE 3 — Localisation & Légal ── */}
          {step === 3 && (
            <form onSubmit={next3} className='space-y-5 p-8'>
              <div>
                <h2 className='text-2xl font-black text-[#1A1A1A]'>Localisation & dossier légal</h2>
                <p className='mt-1 text-sm text-[#5F5E5A]'>Informations de localisation et identifiants légaux.</p>
              </div>

              <Field label='Région / Département' icon={MapPin} error={form3.formState.errors.region?.message}>
                <select {...form3.register('region')} className={inputCls() + ' appearance-none'}>
                  <option value=''>Choisir une région...</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>

              <div className='grid grid-cols-2 gap-4'>
                <Field label='Ville' icon={MapPin} error={form3.formState.errors.city?.message}>
                  <input {...form3.register('city')} placeholder='Ex: Pointe-Noire' className={inputCls()} />
                </Field>
                <Field label='Adresse' icon={MapPin} error={form3.formState.errors.address?.message}>
                  <input {...form3.register('address')} placeholder='Rue, quartier...' className={inputCls()} />
                </Field>
              </div>

              <Field label='Description de votre établissement' error={form3.formState.errors.description?.message}>
                <textarea
                  {...form3.register('description')}
                  rows={4}
                  placeholder='Décrivez vos services, votre ambiance, ce qui vous rend unique... (min. 30 caractères)'
                  className='w-full rounded-xl border border-[#1A6B4A]/10 bg-[#E8F5EF]/40 p-4 font-medium text-[#1A1A1A] placeholder:text-[#5F5E5A]/30 focus:outline-none focus:ring-2 focus:ring-[#1A6B4A]/20 transition resize-none'
                />
              </Field>

              <div className='rounded-xl border border-[#C8860A]/20 bg-[#C8860A]/5 p-4'>
                <p className='mb-3 text-xs font-black uppercase tracking-wider text-[#C8860A]'>Identifiants légaux (optionnels)</p>
                <div className='grid grid-cols-2 gap-4'>
                  <Field label='N° RCCM' icon={FileText} error={form3.formState.errors.rccmNumber?.message}>
                    <input {...form3.register('rccmNumber')} placeholder='CG/PNR/XXX' className={inputCls()} />
                  </Field>
                  <Field label='NIU (N° Fiscal)' icon={Globe} error={form3.formState.errors.taxId?.message}>
                    <input {...form3.register('taxId')} placeholder='M XXXXX' className={inputCls()} />
                  </Field>
                </div>
                <p className='mt-2 text-[10px] text-[#5F5E5A]'>Vous pouvez compléter ces informations plus tard dans votre espace.</p>
              </div>

              <div className='flex gap-3'>
                <button type='button' onClick={() => setStep(2)} className='flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-4 font-bold text-[#5F5E5A] transition hover:bg-gray-50'>
                  <ArrowLeft className='h-4 w-4' /> Retour
                </button>
                <button type='submit' className='flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1A6B4A] py-4 font-black text-white shadow-lg shadow-[#1A6B4A]/25 transition hover:bg-[#1A6B4A]/90'>
                  Continuer <ArrowRight className='h-4 w-4' />
                </button>
              </div>
            </form>
          )}

          {/* ── ÉTAPE 4 — Récapitulatif & Confirmation ── */}
          {step === 4 && (
            <div className='space-y-5 p-8'>
              <div>
                <h2 className='text-2xl font-black text-[#1A1A1A]'>Récapitulatif & confirmation</h2>
                <p className='mt-1 text-sm text-[#5F5E5A]'>Vérifiez vos informations avant de créer votre compte.</p>
              </div>

              {/* Résumé */}
              <div className='space-y-3'>
                <SummaryBlock title='Compte' items={[
                  { label: 'Nom', value: `${formData.firstName} ${formData.lastName}` },
                  { label: 'Email', value: formData.email || '' },
                ]} />
                <SummaryBlock title='Établissement' items={[
                  { label: 'Nom', value: formData.businessName || '' },
                  { label: 'Type', value: BUSINESS_TYPES.find(t => t.value === selectedType)?.label || selectedType },
                  { label: 'Gérant', value: formData.managerName || '' },
                  { label: 'Téléphone', value: formData.phone || '' },
                ]} />
                <SummaryBlock title='Localisation' items={[
                  { label: 'Région', value: formData.region || '' },
                  { label: 'Ville', value: formData.city || '' },
                  { label: 'Adresse', value: formData.address || '' },
                ]} />
              </div>

              {/* Engagements */}
              <div className='rounded-xl border border-[#1A6B4A]/20 bg-[#E8F5EF] p-4'>
                <div className='mb-3 flex items-center gap-2'>
                  <BadgeCheck className='h-5 w-5 text-[#1A6B4A]' />
                  <p className='text-sm font-black text-[#1A6B4A]'>Ce qui se passe ensuite</p>
                </div>
                {[
                  'Votre compte est créé immédiatement.',
                  '14 jours d\'essai gratuit avec accès complet.',
                  'Securits Tech vérifie et valide votre dossier.',
                  'Vous choisissez votre pack après la période d\'essai.',
                ].map((t, i) => (
                  <div key={i} className='mb-2 flex items-start gap-2 text-sm text-[#1A1A1A]'>
                    <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-[#1A6B4A]' />
                    {t}
                  </div>
                ))}
              </div>

              {apiError && (
                <div className='rounded-xl border border-red-100 bg-red-50 p-3 text-center text-sm text-red-600'>{apiError}</div>
              )}

              <div className='flex gap-3'>
                <button type='button' onClick={() => setStep(3)} className='flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-4 font-bold text-[#5F5E5A] transition hover:bg-gray-50'>
                  <ArrowLeft className='h-4 w-4' /> Modifier
                </button>
                <button
                  onClick={submit}
                  disabled={isLoading}
                  className='flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1A6B4A] py-4 font-black text-white shadow-lg shadow-[#1A6B4A]/25 transition hover:bg-[#1A6B4A]/90 disabled:opacity-50'
                >
                  {isLoading
                    ? <Loader2 className='h-5 w-5 animate-spin' />
                    : <><BadgeCheck className='h-5 w-5' /> Créer mon compte Opérateur</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>

        <p className='mt-4 text-center text-xs text-[#5F5E5A]'>
          En vous inscrivant, vous acceptez nos{' '}
          <Link href='/terms' className='font-bold text-[#1A6B4A] hover:underline'>Conditions d&apos;utilisation</Link>
          {' '}et notre{' '}
          <Link href='/privacy' className='font-bold text-[#1A6B4A] hover:underline'>Politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}

// ─── Composant résumé ─────────────────────────────────────────────────────────
function SummaryBlock({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <div className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
      <p className='mb-3 text-xs font-black uppercase tracking-wider text-[#5F5E5A]'>{title}</p>
      <div className='space-y-1'>
        {items.map(item => (
          <div key={item.label} className='flex justify-between text-sm'>
            <span className='text-[#5F5E5A]'>{item.label}</span>
            <span className='font-bold text-[#1A1A1A]'>{item.value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
