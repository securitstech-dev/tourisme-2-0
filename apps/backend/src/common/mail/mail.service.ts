import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"Congo Tourisme" <${this.configService.get('MAIL_FROM')}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    const subject = 'Bienvenue sur Congo Tourisme !';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
        <h1 style="color: #1A6B4A;">Bienvenue, ${name} !</h1>
        <p>Nous sommes ravis de vous compter parmi nous sur <strong>Congo Tourisme</strong>, la plateforme officielle pour découvrir le cœur de l'Afrique.</p>
        <p>Commencez dès maintenant à explorer nos offres et préparez votre prochain voyage.</p>
        <div style="margin-top: 30px;">
          <a href="${this.configService.get('FRONTEND_URL')}/explore" style="background: #1A6B4A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explorer les offres</a>
        </div>
        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">Securits Tech - Pointe-Noire, République du Congo</p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  async sendBookingConfirmation(email: string, bookingId: string, listingTitle: string, amount: number) {
    const subject = 'Confirmation de votre réservation - Congo Tourisme';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
        <h2 style="color: #1A6B4A;">Votre réservation est confirmée !</h2>
        <p>Merci pour votre confiance. Voici le récapitulatif de votre réservation :</p>
        <div style="background: #f9faf8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Établissement :</strong> ${listingTitle}</p>
          <p><strong>Référence :</strong> ${bookingId}</p>
          <p><strong>Montant payé :</strong> ${amount.toLocaleString()} FCFA</p>
        </div>
        <p>L'opérateur a été notifié et prépare votre accueil.</p>
        <p style="margin-top: 30px;">Bon séjour au Congo !</p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  async sendSubscriptionInvoice(email: string, invoiceId: string, planName: string, amount: number) {
    const subject = 'Votre facture Congo Tourisme';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
        <h2 style="color: #1A6B4A;">Paiement Confirmé</h2>
        <p>Merci pour votre confiance. Votre abonnement a bien été renouvelé.</p>
        <div style="background: #f9faf8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Facture :</strong> ${invoiceId}</p>
          <p><strong>Plan :</strong> ${planName}</p>
          <p><strong>Montant :</strong> ${amount.toLocaleString()} FCFA</p>
        </div>
        <p>Vous pouvez télécharger votre facture détaillée depuis votre tableau de bord.</p>
        <p style="margin-top: 30px;">L'équipe Congo Tourisme</p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  async sendOperatorValidationEmail(email: string, businessName: string, trialEndDate: Date) {
    const subject = 'Félicitations ! Votre compte Congo Tourisme est validé';
    const trialDateStr = trialEndDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px; border-top: 4px solid #1A6B4A;">
        <h2 style="color: #1A6B4A;">Dossier Validé !</h2>
        <p>Bonjour l'équipe de <strong>${businessName}</strong>,</p>
        <p>Nous avons le plaisir de vous informer que votre dossier de conformité a été approuvé par nos services chez <strong>Securits Tech</strong>.</p>
        <div style="background: #E8F5EF; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #1A6B4A;">
          <h3 style="color: #1A6B4A; margin-top: 0;">🎁 Votre période d'essai commence !</h3>
          <p>Vous bénéficiez dès maintenant de <strong>14 jours d'accès complet gratuit</strong> pour découvrir la plateforme et publier vos offres.</p>
          <p><strong>Fin de l'essai :</strong> ${trialDateStr}</p>
        </div>
        <p>Vous pouvez dès à présent vous connecter à votre tableau de bord pour créer vos premières annonces.</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="${this.configService.get('FRONTEND_URL')}/dashboard/operator" style="background: #1A6B4A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Accéder au Dashboard</a>
        </div>
        <p style="margin-top: 30px; font-size: 14px; color: #5F5E5A;">Bienvenue dans l'aventure Congo Tourisme !</p>
        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 11px; color: #999; text-align: center;">Securits Tech - Pointe-Noire, République du Congo</p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  async sendOperatorRejectionEmail(email: string, businessName: string, reason: string) {
    const subject = 'Mise à jour concernant votre dossier Congo Tourisme';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px; border-top: 4px solid #DC2626;">
        <h2 style="color: #DC2626;">Dossier Incomplet ou Rejeté</h2>
        <p>Bonjour,</p>
        <p>Après examen de votre dossier pour l'établissement <strong>${businessName}</strong>, nous regrettons de vous informer que nous ne pouvons pas encore valider votre accès.</p>
        <div style="background: #FEF2F2; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #FEE2E2;">
          <p style="color: #991B1B; font-weight: bold; margin-top: 0;">Motif du rejet :</p>
          <p style="color: #B91C1C;">${reason}</p>
        </div>
        <p>Vous pouvez corriger vos documents et soumettre à nouveau votre dossier depuis votre espace personnel.</p>
        <p>Nos équipes restent à votre disposition pour vous accompagner dans cette démarche.</p>
        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 11px; color: #999; text-align: center;">Securits Tech - Pointe-Noire, République du Congo</p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }
}
