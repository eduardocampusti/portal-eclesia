
export enum RoleType {
  ADMIN = 'admin',
  PASTOR_SENIOR = 'pastor_senior',
  MISSIONARIA = 'missionaria',
  SECRETARIA = 'secretaria',
  CONTADORA = 'contadora',
  EDITOR_SITE = 'editor_site',
  PRESBITERO = 'presbitero',
  DIACONO = 'diacono'
}

export interface Role {
  id: RoleType;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: RoleType;
  avatar?: string;
  lastLogin?: string;
}

export interface Sermon {
  id: string;
  title: string;
  pastor: string;
  date: string;
  youtubeUrl?: string;
  description: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: 'CULT' | 'MEETING' | 'OUTREACH' | 'CONFERENCE';
}

export interface SocialAction {
  id: string;
  title: string;
  date: string;
  targetAudience: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  description: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE' | 'VISITOR';
  joinDate: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'NORMAL' | 'HIGH';
  target: 'PUBLIC' | 'INTERNAL';
}

export interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
  active: boolean;
}
export interface SiteSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  mission_title: string;
  mission_description: string;
  about_title: string;
  about_description: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  banners?: Banner[];

  // Finance / Contribution Section
  finance_title?: string;
  finance_description?: string;
  finance_pix_key?: string;
  finance_pix_type?: string;
  finance_pix_holder?: string;
  finance_bank1_name?: string;
  finance_bank1_agency?: string;
  finance_bank1_account?: string;
  finance_bank2_name?: string;
  finance_bank2_agency?: string;
  finance_bank2_account?: string;
  finance_pix_qr_url?: string;
}
