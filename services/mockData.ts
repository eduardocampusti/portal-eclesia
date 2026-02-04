
import { RoleType, Sermon, Event, Member, FinancialTransaction, Announcement, User, SocialAction, Role } from '../types';

export const INITIAL_ROLES: Role[] = [
  { id: RoleType.ADMIN, name: 'Administrador', permissions: ['dashboard', 'users', 'sermons', 'events', 'members', 'finance', 'announcements', 'reports', 'social-actions'] },
  { id: RoleType.PASTOR_SENIOR, name: 'Pastor Sênior', permissions: ['dashboard', 'sermons', 'events', 'announcements'] },
  { id: RoleType.MISSIONARIA, name: 'Missionária', permissions: ['dashboard', 'events', 'social-actions'] },
  { id: RoleType.SECRETARIA, name: 'Secretária', permissions: ['dashboard', 'members', 'events', 'announcements'] },
  { id: RoleType.CONTADORA, name: 'Contadora', permissions: ['dashboard', 'finance', 'reports'] }
];

export const INITIAL_USERS: User[] = [
  { id: '1', name: 'Presb. Ricardo (Admin)', email: 'admin@ipb.org.br', roleId: RoleType.ADMIN, lastLogin: '2024-05-22' },
  { id: '2', name: 'Rev. Dr. Oliveira', email: 'pastor@ipb.org.br', roleId: RoleType.PASTOR_SENIOR, lastLogin: '2024-05-21' },
  { id: '3', name: 'Miss. Sarah K.', email: 'missao@ipb.org.br', roleId: RoleType.MISSIONARIA, lastLogin: '2024-05-22' },
  { id: '4', name: 'Dona Maria Luz', email: 'secretaria@ipb.org.br', roleId: RoleType.SECRETARIA, lastLogin: '2024-05-20' },
  { id: '5', name: 'Tesoureiro Santos', email: 'contabilidade@ipb.org.br', roleId: RoleType.CONTADORA, lastLogin: '2024-05-19' }
];

export const INITIAL_SERMONS: Sermon[] = [
  { id: '1', title: 'O Caminho da Santidade', pastor: 'Rev. Oliveira', date: '2024-05-19', description: 'Exposição bíblica em Romanos 12.' },
  { id: '2', title: 'Igreja e Sociedade', pastor: 'Pr. Lucas', date: '2024-05-12', description: 'Nosso papel como sal e luz.' }
];

export const INITIAL_EVENTS: Event[] = [
  { id: '1', title: 'Culto de Adoração', date: '2024-05-26T19:00:00', location: 'Templo Central', description: 'Celebração com Ceia do Senhor.', category: 'CULT' },
  { id: '2', title: 'Reunião do Conselho', date: '2024-06-02T20:00:00', location: 'Sala 01', description: 'Pauta administrativa mensal.', category: 'MEETING' }
];

export const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Carlos Magno', email: 'carlos@mail.com', phone: '(11) 98888-7777', address: 'Rua da Fé, 100', status: 'ACTIVE', joinDate: '2018-05-10' },
  { id: '2', name: 'Juliana Silva', email: 'ju@mail.com', phone: '(11) 97777-6666', address: 'Av. Esperança, 500', status: 'VISITOR', joinDate: '2024-01-05' }
];

export const INITIAL_SOCIAL_ACTIONS: SocialAction[] = [
  { id: '1', title: 'Projeto Dorcas', date: '2024-06-10', targetAudience: 'Costureiras Locais', status: 'IN_PROGRESS', description: 'Confecção de agasalhos para doação.' }
];

export const INITIAL_FINANCE: FinancialTransaction[] = [
  { id: '1', type: 'INCOME', category: 'Dízimos', amount: 4500.50, date: '2024-05-20', description: 'Dízimos do 3º domingo' },
  { id: '2', type: 'EXPENSE', category: 'Energia', amount: 840.00, date: '2024-05-15', description: 'Conta de luz - Templo' }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'Limpeza do Templo', content: 'Mutirão de limpeza no sábado às 08h.', date: '2024-05-25', priority: 'NORMAL', target: 'INTERNAL' }
];
