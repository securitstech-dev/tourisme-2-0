/** Ecran de connexion avec choix de portail. */
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { ArrowRight, Building2, Landmark, Loader2, Lock, Mail, Plane, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portal = searchParams.get('portal');
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', data);
      const { user, backend_tokens } = response.data;
      setAuth(user, backend_tokens.accessToken, backend_tokens.refreshToken);

      if (user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (user.role === 'OPERATOR') {
        router.push('/dashboard/operator');
      } else {
        router.push('/dashboard/tourist/profile');
      }
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        setError(typeof requestError.response?.data?.message === 'string' ? requestError.response.data.message : 'Identifiants incorrects');
      } else {
        setError('Connexion impossible pour le moment');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!portal) {
    return (
      <div className="w-full max-w-5xl rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-5 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Landmark className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">Congo Tourisme</span>
          </Link>
          <h1 className="text-3xl font-black text-foreground">A quel espace voulez-vous acceder ?</h1>
          <p className="mt-3 text-sm text-subtext">Chaque profil arrive directement dans son environnement.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Link href="/auth/login?portal=tourist" className="rounded-2xl border border-border bg-accent/30 p-6 transition hover:-translate-y-1 hover:shadow-xl">
            <Plane className="h-9 w-9 text-primary" />
            <h2 className="mt-5 text-2xl font-black">Usager</h2>
            <p className="mt-3 text-sm leading-7 text-subtext">Connexion pour reserver, suivre vos demandes et preparer vos sorties.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary">
              Continuer
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link href="/auth/login?portal=operator" className="rounded-2xl border border-primary/20 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
            <Building2 className="h-9 w-9 text-primary" />
            <h2 className="mt-5 text-2xl font-black">Operateur</h2>
            <p className="mt-3 text-sm leading-7 text-subtext">Connexion pour gerer vos offres, documents, reservations et abonnement.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary">
              Continuer
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
        <Link href="/auth/login?portal=admin" className="mx-auto mt-7 flex w-fit items-center gap-2 text-xs font-bold text-subtext/60 transition hover:text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          Acces superadmin
        </Link>
      </div>
    );
  }

  const portalTitle = portal === 'operator' ? 'Connexion operateur' : portal === 'admin' ? 'Acces superadmin' : 'Connexion usager';

  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
      <div className="border-b border-gray-50 p-8 text-center">
        <Link href="/" className="mb-6 inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Landmark className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">Congo Tourisme</span>
        </Link>
        <h1 className="mb-1 text-2xl font-bold text-foreground">{portalTitle}</h1>
        <p className="text-sm text-subtext">Accedez a votre espace securise.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-8">
        {error && <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-center text-sm text-red-600">{error}</div>}

        <label className="block space-y-1">
          <span className="ml-1 text-xs font-bold uppercase tracking-wider text-subtext">Email</span>
          <span className="relative block">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtext/40" />
            <input {...register('email')} type="email" placeholder="exemple@email.com" className="w-full rounded-2xl border-none bg-accent/20 py-3 pl-10 pr-4 font-medium focus:ring-2 focus:ring-primary/20" />
          </span>
          {errors.email && <span className="ml-1 block text-[10px] text-red-500">{errors.email.message}</span>}
        </label>

        <label className="block space-y-1">
          <span className="ml-1 text-xs font-bold uppercase tracking-wider text-subtext">Mot de passe</span>
          <span className="relative block">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtext/40" />
            <input {...register('password')} type="password" placeholder="********" className="w-full rounded-2xl border-none bg-accent/20 py-3 pl-10 pr-4 font-medium focus:ring-2 focus:ring-primary/20" />
          </span>
          {errors.password && <span className="ml-1 block text-[10px] text-red-500">{errors.password.message}</span>}
        </label>

        <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-white shadow-xl shadow-primary/20 transition hover:opacity-90 disabled:opacity-50">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Se connecter <ArrowRight className="h-5 w-5" /></>}
        </button>

        <p className="pt-2 text-center text-sm text-subtext">
          Pas encore de compte ?{' '}
          <Link href="/auth/register" className="font-bold text-primary hover:underline">S inscrire</Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-accent/30 p-4">
      <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-primary" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
