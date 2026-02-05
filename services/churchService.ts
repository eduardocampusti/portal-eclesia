
import { Sermon, Event, Member, FinancialTransaction, Announcement, SocialAction, User, SiteSettings } from '../types';
import { supabase } from './supabaseClient';

// Helper de persistência local para fallback
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
      return data || [];
    } catch (err) {
      console.warn('Supabase fetch failed, using local fallback for Users');
      return localStore.get<User>('users');
    }
  },
  addUser: async (u: Omit<User, 'id'> & { password?: string }) => {
    const { password, ...userData } = u;
    const newUser = { ...u, id: Math.random().toString(36).substr(2, 9) };
    try {
      const { error } = await supabase.from('users').insert([userData]);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase insert failed, saving User locally');
      localStore.saveOne<User>('users', newUser as any);
    }
  },
  updateUser: async (id: string, u: Partial<User> & { password?: string }) => {
    try {
      const { error } = await supabase.from('users').update(u).eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase update failed, updating User locally');
      const items = localStore.get<any>('users');
      const index = items.findIndex(i => i.id === id);
      if (index > -1) {
        items[index] = { ...items[index], ...u };
        localStore.set('users', items);
      }
    }
  },
  deleteUser: async (id: string) => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      localStore.deleteOne('users', id);
    }
  },

  // Sermons
  getSermons: async (): Promise<Sermon[]> => {
    try {
      const { data, error } = await supabase.from('sermons').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      return localStore.get<Sermon>('sermons');
    }
  },
  addSermon: async (s: Omit<Sermon, 'id'>) => {
    const newS = { ...s, id: Math.random().toString(36).substr(2, 9) };
    try {
      const { error } = await supabase.from('sermons').insert([s]);
      if (error) throw error;
    } catch (err) {
      localStore.saveOne<Sermon>('sermons', newS as Sermon);
    }
  },

  // Events
  getEvents: async (): Promise<Event[]> => {
    try {
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err) {
      return localStore.get<Event>('events');
    }
  },
  addEvent: async (e: Omit<Event, 'id'>) => {
    const newE = { ...e, id: Math.random().toString(36).substr(2, 9) };
    try {
      const { error } = await supabase.from('events').insert([e]);
      if (error) throw error;
    } catch (err) {
      localStore.saveOne<Event>('events', newE as Event);
    }
  },

  // Settings
  getSettings: async (): Promise<SiteSettings | null> => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) throw new Error('No data');
      return data;
    } catch (err) {
      const local = localStorage.getItem('eclesia_settings');
      return local ? JSON.parse(local) : null;
    }
  },
  updateSettings: async (s: SiteSettings) => {
    try {
      const { error } = await supabase.from('site_settings').upsert([{ ...s, id: 'default' }]);
      if (error) throw error;
    } catch (err) {
      try {
        localStorage.setItem('eclesia_settings', JSON.stringify({ ...s, id: 'default' }));
      } catch (storageErr) {
        if (storageErr instanceof DOMException &&
          (storageErr.name === 'QuotaExceededError' || storageErr.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
          console.error("Local Storage Quota Exceeded");
          throw new Error("QUOTA_EXCEEDED");
        }
        throw storageErr;
      }
    }
  },

  // Emergency Cleanup Method
  simplifySettings: () => {
    try {
      const current = localStore.get<any>('eclesia_settings');
      // If it exists but is just a string/object, we might need to parse. 
      // But localStore.get might return array. Let's direct access.
      const raw = localStorage.getItem('eclesia_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        // Remove banner images from local storage to free space
        if (parsed.banners && Array.isArray(parsed.banners)) {
          parsed.banners = parsed.banners.map((b: any) => ({
            ...b,
            imageUrl: b.imageUrl && b.imageUrl.length > 1000 ? '' : b.imageUrl
          }));
        }
        localStorage.setItem('eclesia_settings', JSON.stringify(parsed));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  // Outros métodos seguem o mesmo padrão de try/catch com fallback local...
  getMembers: async (): Promise<Member[]> => {
    try {
      const { data, error } = await supabase.from('members').select('*');
      if (error) throw error;
      return data || [];
    } catch (err) { return localStore.get<Member>('members'); }
  },
  addMember: async (m: Omit<Member, 'id'>) => {
    const item = { ...m, id: Math.random().toString(36).substr(2, 9) };
    try { await supabase.from('members').insert([m]); } catch (e) { localStore.saveOne('members', item); }
  },

  getFinance: async (): Promise<FinancialTransaction[]> => {
    try {
      const { data, error } = await supabase.from('financial_transactions').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) { return localStore.get<FinancialTransaction>('finance'); }
  },
  getSocialActions: async (): Promise<SocialAction[]> => {
    try {
      const { data, error } = await supabase.from('social_actions').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) { return localStore.get<SocialAction>('social'); }
  },
  getAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const { data, error } = await supabase.from('announcements').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) { return localStore.get<Announcement>('announcements'); }
  },
  uploadImage: async (file: File, bucket: string = 'images'): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return publicUrl;
    } catch (err) {
      console.warn('Supabase storage failed, converting to Base64 (Local Fallback)');
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }
};
