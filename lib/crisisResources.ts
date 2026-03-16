// Crisis resources localized by language and region
import { Language } from './i18n';

export interface CrisisResource {
  name: string;
  number?: string;
  description: string;
  url?: string;
}

export interface CrisisResourceSet {
  primary: CrisisResource[];
  international: CrisisResource[];
}

const crisisResources: Record<Language, CrisisResourceSet> = {
  en: {
    primary: [
      {
        name: 'Emergency Services',
        number: '911',
        description: 'Call for immediate emergency assistance',
      },
      {
        name: 'SAMU (Medical Emergency)',
        number: '15',
        description: 'Emergency medical and ambulance services',
      },
      {
        name: 'Police Emergency',
        number: '197',
        description: 'Contact police for emergency situations',
      },
      {
        name: 'Tunisia Mental Health Association',
        description: 'Mental health resources and support',
        url: 'https://www.unison.org.tn/',
      },
    ],
    international: [
      {
        name: 'International Association for Suicide Prevention',
        description: 'Worldwide crisis resources directory',
        url: 'https://www.iasp.info/resources/Crisis_Centres/',
      },
      {
        name: 'Befrienders',
        description: 'International emotional support network',
        url: 'https://www.befrienders.org/',
      },
    ],
  },
  fr: {
    primary: [
      {
        name: 'Services d\'Urgence',
        number: '911',
        description: 'Appelez pour une aide d\'urgence immédiate',
      },
      {
        name: 'SAMU (Urgences Médicales)',
        number: '15',
        description: 'Services d\'urgence médicale et ambulance',
      },
      {
        name: 'Police d\'Urgence',
        number: '197',
        description: 'Contactez la police pour les situations d\'urgence',
      },
      {
        name: 'Association Tunisienne de Santé Mentale',
        description: 'Ressources en matière de santé mentale et soutien',
        url: 'https://www.unison.org.tn/',
      },
    ],
    international: [
      {
        name: 'Association Internationale pour la Prévention du Suicide',
        description: 'Répertoire mondial des ressources en cas de crise',
        url: 'https://www.iasp.info/resources/Crisis_Centres/',
      },
      {
        name: 'Befrienders',
        description: 'Réseau international d\'soutien émotionnel',
        url: 'https://www.befrienders.org/',
      },
    ],
  },
  ar: {
    primary: [
      {
        name: 'خدمات الطوارئ',
        number: '911',
        description: 'اطلب مساعدة طوارئ فورية',
      },
      {
        name: 'الإسعاف (SAMU)',
        number: '15',
        description: 'خدمات الطوارئ الطبية والإسعاف',
      },
      {
        name: 'شرطة الطوارئ',
        number: '197',
        description: 'اتصل بالشرطة في الحالات الطارئة',
      },
      {
        name: 'جمعية الصحة النفسية التونسية',
        description: 'موارد الصحة العقلية والدعم',
        url: 'https://www.unison.org.tn/',
      },
    ],
    international: [
      {
        name: 'الجمعية الدولية لمنع الانتحار',
        description: 'دليل موارد الأزمات العالمية',
        url: 'https://www.iasp.info/resources/Crisis_Centres/',
      },
      {
        name: 'Befrienders',
        description: 'شبكة دعم عاطفي دولية',
        url: 'https://www.befrienders.org/',
      },
    ],
  },
};

export function getCrisisResources(language: Language): CrisisResourceSet {
  return crisisResources[language] || crisisResources.en;
}

// Localized crisis keywords for detection
export const crisisKeywords: Record<Language, string[]> = {
  en: [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'can\'t take it', 'want to die',
    'self harm', 'hurt myself', 'harm myself', 'overdose', 'take my life', 'no point',
    'hopeless', 'worthless', 'nothing matters', 'give up',
  ],
  fr: [
    'suicide', 'suicidaire', 'me tuer', 'fin de vie', 'pas capable', 'veux mourir',
    'automutilation', 'me faire du mal', 'surdose', 'prendre ma vie', 'pas de sens',
    'sans espoir', 'sans valeur', 'rien n\'a d\'importance', 'abandonner',
  ],
  ar: [
    'انتحار', 'انتحاري', 'قتل نفسي', 'نهاية حياتي', 'لا أستطيع', 'أريد أن أموت',
    'إيذاء النفس', 'إيذاء نفسي', 'جرعة زائدة', 'أخذ حياتي', 'لا معنى',
    'بلا أمل', 'بلا قيمة', 'لا يهم شيء', 'الاستسلام',
  ],
};

export function detectCrisisKeywords(message: string, language: Language): string[] {
  const keywords = crisisKeywords[language] || crisisKeywords.en;
  const lowerMessage = message.toLowerCase();
  return keywords.filter((keyword) => lowerMessage.includes(keyword));
}
