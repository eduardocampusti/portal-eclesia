
import { RoleType } from './types';

export const ROLE_PERMISSIONS: Record<RoleType, string[]> = {
  [RoleType.ADMIN]: ['dashboard', 'users', 'sermons', 'events', 'social-actions', 'members', 'finance', 'announcements', 'reports', 'settings'],
  [RoleType.PASTOR_SENIOR]: ['dashboard', 'users', 'sermons', 'events', 'social-actions', 'members', 'finance', 'announcements', 'reports', 'settings'],
  [RoleType.CONTADORA]: ['dashboard', 'finance', 'reports', 'members'],
  [RoleType.EDITOR_SITE]: ['dashboard', 'settings'],
  [RoleType.MISSIONARIA]: ['dashboard', 'events', 'social-actions'],
  [RoleType.SECRETARIA]: ['dashboard', 'members', 'events', 'announcements'],
  [RoleType.PRESBITERO]: ['dashboard', 'sermons', 'events', 'announcements', 'members'],
  [RoleType.DIACONO]: ['dashboard', 'events', 'members', 'social-actions']
};

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin' },
  { id: 'users', label: 'Usuários/Perfis', icon: 'ShieldCheck', path: '/admin/users' },
  { id: 'sermons', label: 'Sermões', icon: 'Mic2', path: '/admin/sermons' },
  { id: 'events', label: 'Agenda Geral', icon: 'Calendar', path: '/admin/events' },
  { id: 'social-actions', label: 'Ações Sociais', icon: 'HeartHandshake', path: '/admin/social-actions' },
  { id: 'members', label: 'Membros', icon: 'Users', path: '/admin/members' },
  { id: 'announcements', label: 'Comunicados', icon: 'Megaphone', path: '/admin/announcements' },
  { id: 'settings', label: 'Editor do Site', icon: 'Globe', path: '/admin/settings' },
  { id: 'finance', label: 'Financeiro', icon: 'DollarSign', path: '/admin/finance' },
  { id: 'reports', label: 'Relatórios', icon: 'BarChart3', path: '/admin/reports' }
];

// Bank & Contribution Info
export const CHURCH_BANK_INFO = {
  pix: {
    key: "00.123.456/0001-01",
    type: "CNPJ",
    holder: "Igreja Presbiteriana do Brasil - Central"
  },
  accounts: []

};

export const WEEKLY_SCHEDULE = [
  { day: 0, title: 'Escola Bíblica Dominical', time: '9:00h', ministry: 'Salão Social' },
  { day: 0, title: 'Culto de Adoração', time: '19:00h', ministry: 'Templo' },
  { day: 3, title: 'Reunião de Oração', time: '19:30h', ministry: 'Sala de Estudos' }
];
