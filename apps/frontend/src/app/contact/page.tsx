/** Page de contact et d'accompagnement commercial. */
'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send, ShieldCheck } from 'lucide-react';

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: ContactFormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormState>(initialState);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('Le formulaire est pret. Il sera branche sur le backend ou sur l emailing ensuite.');
    setFormData(initialState);
  };

  return (
    <div className="bg-background pb-20">
      <section className="border-b border-black/6 bg-white/75">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <ShieldCheck className="h-4 w-4" />
              Contact Securits Tech
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Une page contact plus nette, plus serieuse et plus simple a brancher.</h1>
            <p className="text-lg leading-8 text-subtext">
              Cette interface aide autant les touristes que les operateurs. Elle peut ensuite etre reliee a un endpoint NestJS, a Nodemailer ou a un CRM sans revoir toute la presentation.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-6">
          <div className="rounded-[30px] border border-black/6 bg-white p-6 shadow-sm shadow-black/5">
            <div className="mb-4 inline-flex rounded-2xl bg-accent p-3 text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">Telephone</h2>
            <p className="mt-3 text-sm leading-7 text-subtext">+242 05 302 8383</p>
            <p className="text-sm leading-7 text-subtext">+242 06 881 71 04</p>
          </div>

          <div className="rounded-[30px] border border-black/6 bg-white p-6 shadow-sm shadow-black/5">
            <div className="mb-4 inline-flex rounded-2xl bg-accent p-3 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">Email</h2>
            <p className="mt-3 text-sm leading-7 text-subtext">securitstech@gmail.com</p>
            <p className="text-sm leading-7 text-subtext">support@congotourisme.cg</p>
          </div>

          <div className="rounded-[30px] border border-black/6 bg-[#16231d] p-6 text-white shadow-sm shadow-black/5">
            <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3 text-secondary">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">Adresse</h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              Pointe-Noire, Republique du Congo.
              <br />
              Securits Tech accompagne la mise en place de la plateforme Congo Tourisme.
            </p>
          </div>
        </div>

        <div className="rounded-[34px] border border-black/6 bg-white p-7 shadow-xl shadow-black/5 lg:p-10">
          <h2 className="text-2xl font-bold">Envoyer un message</h2>
          <p className="mt-3 text-sm leading-7 text-subtext">
            Le formulaire est deja pret pour le branchement backend. La structure reste sobre et professionnelle pour l usage B2B comme B2C.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-subtext">
                Nom complet
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                  className="rounded-2xl border border-black/6 bg-background px-4 py-3 text-foreground outline-none"
                  placeholder="Votre nom"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-subtext">
                Email
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  className="rounded-2xl border border-black/6 bg-background px-4 py-3 text-foreground outline-none"
                  placeholder="vous@exemple.com"
                  required
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-subtext">
              Sujet
              <input
                type="text"
                value={formData.subject}
                onChange={(event) => setFormData((current) => ({ ...current, subject: event.target.value }))}
                className="rounded-2xl border border-black/6 bg-background px-4 py-3 text-foreground outline-none"
                placeholder="Objet de votre message"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-subtext">
              Message
              <textarea
                value={formData.message}
                onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                rows={6}
                className="rounded-2xl border border-black/6 bg-background px-4 py-3 text-foreground outline-none"
                placeholder="Decris ta demande avec le plus de contexte utile."
                required
              />
            </label>

            {status ? <p className="text-sm leading-7 text-subtext">{status}</p> : null}

            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-white md:w-auto">
              <Send className="h-4 w-4" />
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
