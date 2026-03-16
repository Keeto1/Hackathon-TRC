// Internationalization (i18n) support for Arabic, French, and English
// This is a simple implementation; you can migrate to i18next/next-i18next for production

export type Language = 'en' | 'fr' | 'ar';

const translations = {
  en: {
    // Navigation & Layout
    appName: 'Campus AI Buddy',
    newConversation: 'New Conversation',
    logout: 'Logout',
    settings: 'Settings',
    
    // Chat Interface
    messagePlaceholder: 'Type your message...',
    send: 'Send',
    loading: 'Thinking...',
    
    // Crisis Alert
    supportAvailable: 'Support Available',
    weCarAboutYou: 'We Care About You',
    crisisDistress: 'It sounds like you might be in distress. Please reach out for professional help.',
    concerningWords: 'We noticed some concerning words. Please know that help is available.',
    keywordsDetected: 'Keywords detected:',
    emergencyMessage: 'If you are having thoughts of suicide or self-harm, please contact emergency services or a crisis hotline immediately.',
    needHelp: 'If you need immediate help, please reach out to a mental health professional or crisis service.',
    resources: 'Resources:',
    acknowledge: 'I acknowledge and understand',
    
    // Mood Tracker
    logMood: 'Log Mood',
    selectMood: 'How are you feeling?',
    intensity: 'Intensity (1-10):',
    notes: 'Additional notes:',
    submit: 'Submit',
    cancel: 'Cancel',
    
    // Settings
    crisisResources: 'Crisis Resources',
    getHelpWhenNeeded: 'Get help when you need it',
    versionLabel: 'Version:',
    complementNotReplace: 'Remember: This app is designed to complement, not replace, professional mental health support. Please reach out to a healthcare provider if you need professional help.',
    backToChat: 'Back to Chat',
    language: 'Language',
    selectLanguage: 'Select your language',
  },
  fr: {
    // Navigation & Layout
    appName: 'Campus AI Buddy',
    newConversation: 'Nouvelle Conversation',
    logout: 'Déconnexion',
    settings: 'Paramètres',
    
    // Chat Interface
    messagePlaceholder: 'Tapez votre message...',
    send: 'Envoyer',
    loading: 'Réflexion...',
    
    // Crisis Alert
    supportAvailable: 'Soutien Disponible',
    weCarAboutYou: 'Nous Tenons à Vous',
    crisisDistress: 'Il semble que vous êtes en détresse. Veuillez contacter un professionnel de la santé mentale.',
    concerningWords: 'Nous avons remarqué des paroles préoccupantes. Sachez que de l\'aide est disponible.',
    keywordsDetected: 'Mots-clés détectés:',
    emergencyMessage: 'Si vous avez des pensées suicidaires ou d\'automutilation, contactez immédiatement les services d\'urgence ou une ligne d\'écoute.',
    needHelp: 'Si vous avez besoin d\'aide immédiate, veuillez contacter un professionnel de la santé mentale ou un service de crise.',
    resources: 'Ressources:',
    acknowledge: 'Je reconnais et j\'ai compris',
    
    // Mood Tracker
    logMood: 'Enregistrer l\'Humeur',
    selectMood: 'Comment vous sentez-vous?',
    intensity: 'Intensité (1-10):',
    notes: 'Notes supplémentaires:',
    submit: 'Soumettre',
    cancel: 'Annuler',
    
    // Settings
    crisisResources: 'Ressources de Crise',
    getHelpWhenNeeded: 'Obtenez de l\'aide quand vous en avez besoin',
    versionLabel: 'Version:',
    complementNotReplace: 'Rappelez-vous: Cette application est conçue pour compléter, pas remplacer, le soutien professionnel en matière de santé mentale. Veuillez contacter un prestataire de soins de santé si vous avez besoin d\'aide professionnelle.',
    backToChat: 'Retour au Chat',
    language: 'Langue',
    selectLanguage: 'Sélectionnez votre langue',
  },
  ar: {
    // Navigation & Layout
    appName: 'Campus AI Buddy',
    newConversation: 'محادثة جديدة',
    logout: 'تسجيل الخروج',
    settings: 'الإعدادات',
    
    // Chat Interface
    messagePlaceholder: 'اكتب رسالتك...',
    send: 'إرسال',
    loading: 'يفكر...',
    
    // Crisis Alert
    supportAvailable: 'الدعم متاح',
    weCarAboutYou: 'نحن نهتم بك',
    crisisDistress: 'يبدو أنك قد تكون في ضائقة. يرجى التواصل مع متخصص الصحة العقلية.',
    concerningWords: 'لاحظنا بعض الكلمات المثيرة للقلق. يرجى معرفة أن المساعدة متاحة.',
    keywordsDetected: 'الكلمات الرئيسية المكتشفة:',
    emergencyMessage: 'إذا كانت لديك أفكار انتحارية أو إضرار بالنفس، يرجى الاتصال بخدمات الطوارئ أو خط الأزمة فوراً.',
    needHelp: 'إذا كنت بحاجة إلى مساعدة فورية، يرجى التواصل مع متخصص الصحة العقلية أو خدمة أزمة.',
    resources: 'الموارد:',
    acknowledge: 'أفهم وأقبل',
    
    // Mood Tracker
    logMood: 'تسجيل الحالة المزاجية',
    selectMood: 'كيف تشعر؟',
    intensity: 'الشدة (1-10):',
    notes: 'ملاحظات إضافية:',
    submit: 'إرسال',
    cancel: 'إلغاء',
    
    // Settings
    crisisResources: 'موارد الأزمة',
    getHelpWhenNeeded: 'احصل على المساعدة عندما تحتاجها',
    versionLabel: 'الإصدار:',
    complementNotReplace: 'تذكر: تم تصميم هذا التطبيق ليكمل وليس يحل محل دعم الصحة العقلية المهني. يرجى التواصل مع مقدم الرعاية الصحية إذا كنت بحاجة إلى مساعدة مهنية.',
    backToChat: 'العودة إلى الدردشة',
    language: 'اللغة',
    selectLanguage: 'اختر لغتك',
  },
};

export function t(language: Language, key: keyof typeof translations.en): string {
  return (translations[language] as any)[key] || (translations.en as any)[key];
}

export function getLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem('campus_ai_buddy_language');
  if (stored === 'fr' || stored === 'ar') return stored;
  
  // Try browser language
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'fr') return 'fr';
  if (browserLang === 'ar') return 'ar';
  
  return 'en';
}

export function setLanguage(language: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('campus_ai_buddy_language', language);
  }
}
