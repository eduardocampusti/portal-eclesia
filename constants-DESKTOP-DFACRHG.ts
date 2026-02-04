
import { RoleType } from './types';

export const ROLE_PERMISSIONS: Record<RoleType, string[]> = {
  [RoleType.ADMIN]: ['dashboard', 'users', 'sermons', 'events', 'social-actions', 'members', 'finance', 'announcements', 'reports'],
  [RoleType.PASTOR_SENIOR]: ['dashboard', 'sermons', 'events', 'announcements'],
  [RoleType.MISSIONARIA]: ['dashboard', 'events', 'social-actions'],
  [RoleType.SECRETARIA]: ['dashboard', 'members', 'events', 'announcements'],
  [RoleType.CONTADORA]: ['dashboard', 'finance', 'reports']
};

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin' },
  { id: 'users', label: 'Usuários/Perfis', icon: 'ShieldCheck', path: '/admin/users' },
  { id: 'sermons', label: 'Sermões', icon: 'Mic2', path: '/admin/sermons' },
  { id: 'events', label: 'Agenda Geral', icon: 'Calendar', path: '/admin/events' },
  { id: 'social-actions', label: 'Ações Sociais', icon: 'HeartHandshake', path: '/admin/social-actions' },
  { id: 'members', label: 'Membros', icon: 'Users', path: '/admin/members' },
  { id: 'announcements', label: 'Comunicados', icon: 'Megaphone', path: '/admin/announcements' },
  { id: 'finance', label: 'Financeiro', icon: 'DollarSign', path: '/admin/finance' },
  { id: 'reports', label: 'Relatórios', icon: 'BarChart3', path: '/admin/reports' }
];
