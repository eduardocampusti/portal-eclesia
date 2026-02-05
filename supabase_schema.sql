-- EXECUTAR NO SQL EDITOR DO SUPABASE
-- ATENÇÃO: Este script irá DELETAR as tabelas existentes e recriá-las com os nomes corretos.

-- Habilitar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Limpar tabelas existentes para garantir nomes de colunas corretos
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS social_actions;
DROP TABLE IF EXISTS financial_transactions;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS sermons;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS site_settings;

-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  "roleId" TEXT NOT NULL,
  avatar TEXT,
  "lastLogin" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sermões
CREATE TABLE sermons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  pastor TEXT NOT NULL,
  date DATE NOT NULL,
  "youtubeUrl" TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eventos
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('CULT', 'MEETING', 'OUTREACH', 'CONFERENCE')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Membros
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT CHECK (status IN ('ACTIVE', 'INACTIVE', 'VISITOR')),
  "joinDate" DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transações Financeiras
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('INCOME', 'EXPENSE')),
  category TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ações Sociais
CREATE TABLE social_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  "targetAudience" TEXT,
  status TEXT CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Avisos/Comunicados
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  priority TEXT CHECK (priority IN ('NORMAL', 'HIGH')),
  target TEXT CHECK (target IN ('PUBLIC', 'INTERNAL')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurações do Site
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  mission_title TEXT,
  mission_description TEXT,
  about_title TEXT,
  about_description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  finance_title TEXT,
  finance_description TEXT,
  finance_pix_key TEXT,
  finance_pix_type TEXT,
  finance_pix_holder TEXT,
  finance_bank1_name TEXT,
  finance_bank1_agency TEXT,
  finance_bank1_account TEXT,
  finance_bank2_name TEXT,
  finance_bank2_agency TEXT,
  finance_bank2_account TEXT,
  finance_pix_qr_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banners
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS banners JSONB DEFAULT '[]';

-- POLÍTICAS DE SEGURANÇA (RLS)
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública para sermons" ON sermons FOR SELECT TO public USING (true);
CREATE POLICY "Escrita para autenticados em sermons" ON sermons FOR ALL TO authenticated USING (true);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública para events" ON events FOR SELECT TO public USING (true);
CREATE POLICY "Escrita para autenticados em events" ON events FOR ALL TO authenticated USING (true);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública para announcements" ON announcements FOR SELECT TO public USING (true);
CREATE POLICY "Escrita para autenticados em announcements" ON announcements FOR ALL TO authenticated USING (true);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública para site_settings" ON site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Escrita para autenticados em site_settings" ON site_settings FOR ALL TO authenticated USING (true);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso apenas autenticados em users" ON users FOR ALL TO authenticated USING (true);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso apenas autenticados em members" ON members FOR ALL TO authenticated USING (true);

ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso apenas autenticados em finance" ON financial_transactions FOR ALL TO authenticated USING (true);

ALTER TABLE social_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso apenas autenticados em social" ON social_actions FOR ALL TO authenticated USING (true);
