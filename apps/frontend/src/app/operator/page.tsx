/** Page publique dediee aux operateurs touristiques. */
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const documents = [
  'RCCM',
  'Autorisation d exercer',
  'NIU',
  'Patente ou preuve de paiement des impots',
  'Piece du gerant',
  'Quitus sapeurs-pompiers selon activite',
  'Agrement du ministere de tutelle si necessaire',
];

const plans = [
  {
    name: 'Essentiel',
    monthly: '15 000 FCFA/mois',
    yearly: '150 000 FCFA/an',
    limit: '3 offres actives apres essai',
  },
  {
    name: 'Croissance',
    monthly: '45 000 FCFA/mois',
    yearly: '450 000 FCFA/an',
    limit: '12 offres actives apres essai',
    featured: true,
  },
  {
    name: 'Premium',
    monthly: '120 000 FCFA/mois',
    yearly: '1 200 000 FCFA/an',
    limit: 'Offres illimitees apres essai',
  },
];

export default function OperatorPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-black uppercase tracking-widest text-primary">
            <Sparkles className="h-4 w-4" />
            Espace partenaire
          </div>
          <h1 className="text-4xl font-black leading-tight text-foreground sm:text-6xl">
            Presentez vos activites aux touristes et aux locaux.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-subtext">
            Congo Tourisme permet aux hotels, restaurants, sites, bars, caves, VIP, salles,
            agences, loisirs et activites de publier leurs offres apres validation du dossier.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/register/operator" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-black text-white shadow-lg shadow-primary/20">
              Demarrer mon inscription
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/auth/login?portal=operator" className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white px-6 py-4 text-sm font-black text-primary">
              J ai deja un compte operateur
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-xl font-black">Regle d activation</h2>
              <p className="text-sm text-subtext">Validation superadmin obligatoire.</p>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              ['1', 'Depot du dossier administratif'],
              ['2', 'Controle et validation par Securits Tech'],
              ['3', '14 jours d essai gratuit avec acces complet'],
              ['4', 'Choix du pack mensuel ou annuel apres essai'],
            ].map(([number, text]) => (
              <div key={number} className="flex items-center gap-4 rounded-xl bg-accent/50 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">{number}</span>
                <p className="font-bold text-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-danger">Documents administratifs</p>
            <h2 className="text-3xl font-black sm:text-5xl">Un dossier clair avant publication.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => (
              <div key={document} className="flex gap-4 rounded-xl border border-border bg-background p-5">
                <FileText className="h-5 w-5 shrink-0 text-primary" />
                <p className="font-bold text-foreground">{document}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-primary">Packs SaaS</p>
            <h2 className="text-3xl font-black sm:text-5xl">Mensuel ou annuel avec reduction.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-subtext">
            Les limites ne s appliquent pas pendant l essai gratuit. Apres 14 jours,
            l operateur choisit le pack adapte a son budget.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className={`rounded-xl border p-7 shadow-sm ${plan.featured ? 'border-secondary bg-secondary/10' : 'border-border bg-white'}`}>
              <Building2 className="h-7 w-7 text-primary" />
              <h3 className="mt-6 text-2xl font-black">{plan.name}</h3>
              <p className="mt-3 text-sm font-bold text-subtext">{plan.limit}</p>
              <p className="mt-7 text-2xl font-black text-foreground">{plan.monthly}</p>
              <p className="mt-2 text-sm font-black text-primary">{plan.yearly}</p>
              <div className="mt-5 flex items-start gap-2 text-sm font-bold text-subtext">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Abonnement annuel moins cher que 12 mois separes.
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-foreground py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <BadgeCheck className="mb-4 h-9 w-9 text-secondary" />
            <h2 className="text-3xl font-black">Pret a devenir partenaire verifie ?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
              Commencez par votre compte operateur, puis completez le dossier legal dans votre espace.
            </p>
          </div>
          <Link href="/auth/register/operator" className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-4 text-sm font-black text-white">
            Creer mon compte operateur
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
