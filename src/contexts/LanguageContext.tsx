import React, { createContext, useContext, ReactNode } from 'react';

const translations = {
  // Landing
  title: 'Amigo Secreto',
  subtitle: 'Organize seu amigo secreto de forma simples e divertida. Crie eventos, adicione participantes e sorteie nomes com apenas um clique!',
  getStarted: 'Começar Agora',
  login: 'Entrar',
  signup: 'Criar Conta',
  
  // Auth
  email: 'E-mail',
  password: 'Senha',
  confirmPassword: 'Confirmar Senha',
  noAccount: 'Não tem conta?',
  hasAccount: 'Já tem conta?',
  createAccountDesc: 'Crie sua conta para começar',
  welcomeBack: 'Bem-vindo de volta!',
  
  // Dashboard
  myEvents: 'Meus Eventos',
  createEvent: 'Criar Evento',
  eventName: 'Nome do Evento',
  noEvents: 'Nenhum evento criado ainda. Crie seu primeiro evento!',
  participants: 'participantes',
  drawn: 'sorteados',
  
  // Event
  addParticipant: 'Adicionar Participante',
  addParticipants: 'Adicionar Participantes',
  participantName: 'Nome',
  participantEmail: 'E-mail (opcional)',
  bulkAdd: 'Adicionar Vários',
  generateLink: 'Gerar Link',
  copyLink: 'Copiar Link',
  linkCopied: 'Link copiado!',
  resetDraw: 'Reiniciar Sorteio',
  exportCSV: 'Exportar CSV',
  deleteEvent: 'Excluir Evento',
  deleteEventConfirm: 'Excluir evento?',
  deleteEventDesc: 'Esta ação não pode ser desfeita. O evento e todos os participantes serão excluídos permanentemente.',
  status: 'Status',
  actions: 'Ações',
  notDrawn: 'Pendente',
  drawnStatus: 'Sorteado',
  noParticipants: 'Nenhum participante ainda',
  eventNotFound: 'Evento não encontrado',
  
  // Draw page
  secretSanta: 'Amigo Secreto',
  yourSecretFriend: 'Seu amigo secreto é:',
  allDrawn: 'Todos os nomes já foram sorteados!',
  drawError: 'Erro ao sortear. Tente novamente.',
  keepSecret: '🤫 Guarde segredo! Não conte para ninguém.',
  drawName: 'Sortear Nome',
  drawing: 'Sorteando...',
  
  // Common
  save: 'Salvar',
  cancel: 'Cancelar',
  delete: 'Excluir',
  loading: 'Carregando...',
  error: 'Erro',
  success: 'Sucesso',
  back: 'Voltar',
  dashboard: 'Painel',
  logout: 'Sair',
  setupDatabase: 'Configurar Banco',
  databaseReady: 'Banco Configurado!',
};

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const t = (key: TranslationKey): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
