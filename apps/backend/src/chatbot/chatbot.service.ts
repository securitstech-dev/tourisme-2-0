import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatbotService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async askKongo(message: string) {
    const knowledge = await this.prisma.chatbotKnowledge.findMany({
      where: { isActive: true },
    });

    try {
      const apiKey = this.configService.get<string>('GROQ_API_KEY') || this.configService.get<string>('ANTHROPIC_API_KEY');
      
      if (!apiKey || apiKey.length < 10 || apiKey.includes('placeholder')) {
        return this.mockResponse(message, knowledge);
      }

      const topListings = await this.prisma.listing.findMany({
        take: 10,
        include: { operator: true },
      });

      const knowledgeContext = knowledge.map(k => `### ${k.topic}\n${k.content}`).join('\n\n');
      const listingsContext = topListings.map(l => `- ${l.title} (${l.listingType}) à ${l.operator.city}: ${l.description.substring(0, 150)}...`).join('\n');

      const systemPrompt = `Tu es "Kongo", l'expert ultime du tourisme en République du Congo (Brazzaville).
        Ta mission est d'être l'ambassadeur digital du pays. 
        IDENTITÉ : Kongo, chaleureux, fier, professionnel.
        CONNAISSANCES : ${knowledgeContext}
        PARTENAIRES : ${listingsContext}
        RÈGLES : Ne jamais inventer. Si inconnu, réponds EXACTEMENT : "Je m'en excuse, mais je n'ai pas encore cette information précise en mémoire. Je vous invite à poser votre question directement à l'administrateur."`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
        }),
      });

      const data: any = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      return { response: text };
      
    } catch (error) {
      console.error('Chatbot Error:', error);
      return this.mockResponse(message, knowledge);
    }
  }

  private mockResponse(message: string, knowledge: any[]) {
    const msg = message.toLowerCase();
    
    // 1. Recherche par mot-clé dans la base de connaissances
    const match = knowledge.find(k => 
      msg.includes(k.topic.toLowerCase()) || k.content.toLowerCase().includes(msg)
    );

    if (match) {
      return { response: match.content };
    }

    // 2. Réponses de base
    if (msg.includes('mbote') || msg.includes('bonjour') || msg.includes('salut')) {
      return { response: "Mbote ! Je suis Kongo, votre guide expert. Comment puis-je vous aider à explorer les merveilles du Congo ?" };
    }

    if (msg.includes('qui es-tu') || msg.includes('ton nom')) {
      return { response: "Je suis Kongo, l'intelligence artificielle dédiée au tourisme en République du Congo. Je suis là pour vous guider !" };
    }

    // 3. Fallback final
    return { response: "Je m'en excuse, mais je n'ai pas encore cette information précise en mémoire (Mode Démo). Je vous invite à poser votre question directement à l'administrateur." };
  }

  // Méthodes pour l'administration de la connaissance
  async addKnowledge(data: { topic: string; content: string }) {
    return this.prisma.chatbotKnowledge.create({ data });
  }

  async getAllKnowledge() {
    return this.prisma.chatbotKnowledge.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteKnowledge(id: string) {
    return this.prisma.chatbotKnowledge.delete({ where: { id } });
  }

  // Modération automatique des avis
  async moderateReview(comment: string) {
    const fallback = { status: 'APPROVED', reason: 'Approbation automatique (système).' };
    
    try {
      const apiKey = this.configService.get<string>('GROQ_API_KEY') || this.configService.get<string>('ANTHROPIC_API_KEY');
      
      if (!apiKey || apiKey.length < 10 || apiKey.includes('placeholder')) {
        return fallback;
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Tu es un modérateur. Analyse si ce commentaire est respectueux et constructif. RÉPONDS UNIQUEMENT EN JSON : {"status": "APPROVED" | "REJECTED", "reason": "explication"}' },
            { role: 'user', content: comment }
          ],
          response_format: { type: 'json_object' }
        }),
        signal: AbortSignal.timeout(5000), // Timeout de 5 secondes
      });

      if (!response.ok) return fallback;

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) return fallback;
      
      return JSON.parse(content);
      
    } catch (error) {
      console.error('Moderation Error:', error);
      return fallback;
    }
  }
}
