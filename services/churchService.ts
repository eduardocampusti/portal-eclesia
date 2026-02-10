import { createClient } from '@supabase/supabase-js';
import { Sermon, Event, Member, FinancialTransaction, Announcement, SocialAction, User, SiteSettings } from '../types';
import { supabase, supabaseUrl, supabaseAnonKey } from './supabaseClient';

// Helper de persistência local para fallback (Apenas Leitura)
const localStore = {
  get: <T>(key: string): T[] => {
    const data = localStorage.getItem(`eclesia_${key}`);
    return data ? JSON.parse(data) : [];
  },
  set: <T>(key: string, data: T[]) => {
    localStorage.setItem(`eclesia_${key}`, JSON.stringify(data));
  },
  saveOne: <T extends { id: string }>(key: string, item: T) => {
    const items = localStore.get<T>(key);
    const existing = items.findIndex(i => i.id === item.id);
    if (existing > -1) items[existing] = item;
    else items.push(item);
    localStore.set(key, items);
  },
  deleteOne: (key: string, id: string) => {
    const items = localStore.get<any>(key);
    localStore.set(key, items.filter(i => i.id !== id));
  }
};

export const churchService = {
  // Users
  getUsers: async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      const users = data || [];
      localStore.set('users', users);
      return users;
    } catch (err) {
      console.warn('Supabase fetch failed, using local fallback for Users', err);
      return localStore.get<User>('users');
    }
  },

  addUser: async (u: Omit<User, 'id'> & { password?: string }) => {
    const { password, ...userData } = u;

    if (password) {
      const authClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false }
      });

      const { error: signUpError } = await authClient.auth.signUp({
        email: u.email,
        password: password,
        options: {
          data: {
            full_name: u.name,
            role: u.roleId
          }
        }
      });

      if (signUpError) throw signUpError;
    }

    const { error } = await supabase.from('users').insert([userData]);
    if (error) throw error;
  },

  updateUser: async (id: string, u: Partial<User> & { password?: string }) => {
    const { error } = await supabase.from('users').update(u).eq('id', id);
    if (error) throw error;
  },

  deleteUser: async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
  },

  // Sermons
  getSermons: async (): Promise<Sermon[]> => {
    try {
      const { data, error } = await supabase.from('sermons').select('*').order('date', { ascending: false });
      if (error) throw error;
      const sermons = data || [];
      localStore.set('sermons', sermons);
      return sermons;
    } catch (err) {
      console.warn('Supabase fetch failed, using local fallback for Sermons', err);
      return localStore.get<Sermon>('sermons');
    }
  },

  addSermon: async (s: Omit<Sermon, 'id'>) => {
    const { error } = await supabase.from('sermons').insert([s]);
    if (error) throw error;
  },

  deleteSermon: async (id: string) => {
    const { error } = await supabase.from('sermons').delete().eq('id', id);
    if (error) throw error;
  },

  // Events
  getEvents: async (): Promise<Event[]> => {
    try {
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (error) throw error;
      const events = data || [];
      localStore.set('events', events);
      return events;
    } catch (err) {
      console.warn('Supabase fetch failed, using local fallback for Events', err);
      return localStore.get<Event>('events');
    }
  },

  addEvent: async (e: Omit<Event, 'id'>) => {
    const { error } = await supabase.from('events').insert([e]);
    if (error) throw error;
  },

  updateEvent: async (id: string, e: Partial<Event>) => {
    const { error } = await supabase.from('events').update(e).eq('id', id);
    if (error) throw error;
  },

  deleteEvent: async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  },

  // Settings
  getSettings: async (): Promise<SiteSettings | null> => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        localStorage.setItem('eclesia_settings', JSON.stringify(data));
        return data;
      }
      throw new Error('No settings found');
    } catch (err) {
      console.warn('Supabase fetch failed, using local fallback for Settings', err);
      const local = localStorage.getItem('eclesia_settings');
      return local ? JSON.parse(local) : null;
    }
  },

  updateSettings: async (s: SiteSettings) => {
    const { error } = await supabase.from('site_settings').upsert([{ ...s, id: 'default' }]);
    if (error) throw error;
  },

  // Members
  getMembers: async (): Promise<Member[]> => {
    try {
      const { data, error } = await supabase.from('members').select('*');
      if (error) throw error;
      const members = data || [];
      localStore.set('members', members);
      return members;
    } catch (err) {
      console.warn('Supabase fetch failed, using local fallback for Members', err);
      return localStore.get<Member>('members');
    }
  },

  addMember: async (m: Omit<Member, 'id'>) => {
    const { error } = await supabase.from('members').insert([m]);
    if (error) throw error;
  },

  deleteMember: async (id: string) => {
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) throw error;
  },

  // Finance
  getFinance: async (): Promise<FinancialTransaction[]> => {
    try {
      const { data, error } = await supabase.from('financial_transactions').select('*').order('date', { ascending: false });
      if (error) throw error;
      const finance = data || [];
      localStore.set('finance', finance);
      return finance;
    } catch (err) {
      console.warn('Supabase fetch failed, using local fallback for Finance', err);
      return localStore.get<FinancialTransaction>('finance');
    }
  },

  addFinance: async (f: Omit<FinancialTransaction, 'id'>) => {
    const { error } = await supabase.from('financial_transactions').insert([f]);
    if (error) throw error;
  },

  deleteFinance: async (id: string) => {
    const { error } = await supabase.from('financial_transactions').delete().eq('id', id);
    if (error) throw error;
  },

  // Social
  getSocialActions: async (): Promise<SocialAction[]> => {
    try {
      const { data, error } = await supabase.from('social_actions').select('*').order('date', { ascending: false });
      if (error) throw error;
      const social = data || [];
      localStore.set('social', social);
      return social;
    } catch (err) {
      console.warn('Supabase fetch failed, using local fallback for Social', err);
      return localStore.get<SocialAction>('social');
    }
  },

  addSocialAction: async (a: Omit<SocialAction, 'id'>) => {
    const { error } = await supabase.from('social_actions').insert([a]);
    if (error) throw error;
  },

  deleteSocialAction: async (id: string) => {
    const { error } = await supabase.from('social_actions').delete().eq('id', id);
    if (error) throw error;
  },

  // Announcements
  getAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const { data, error } = await supabase.from('announcements').select('*').order('date', { ascending: false });
      if (error) throw error;
      const announcements = data || [];
      localStore.set('announcements', announcements);
      return announcements;
    } catch (err) {
      console.warn('Supabase fetch failed, using local fallback for Announcements', err);
      return localStore.get<Announcement>('announcements');
    }
  },

  addAnnouncement: async (a: Omit<Announcement, 'id'>) => {
    const { error } = await supabase.from('announcements').insert([a]);
    if (error) throw error;
  },

  deleteAnnouncement: async (id: string) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) throw error;
  },

  // Storage
  uploadImage: async (file: File, bucket: string = 'images'): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);

      if (uploadError) {
        console.error('Supabase Storage Error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return publicUrl;
    } catch (err) {
      console.error('Upload process failed:', err);
      throw err;
    }
  }
};
