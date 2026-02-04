import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cross,
  Calendar,
  Mic2,
  MapPin,
  Clock,
  Heart,
  ExternalLink,
  ChevronRight,
  User,
  Youtube,
  Info,
  Mail,
  Phone
} from 'lucide-react';
import { churchService } from '../services/churchService';
import { Sermon, Event, SiteSettings } from '../types';
import { CHURCH_BANK_INFO } from '../constants';
import TodayAtChurch from '../components/TodayAtChurch';

const PublicLanding: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const DEFAULT_SETTINGS: SiteSettings = {
    id: 'default',
    hero_title: 'Uma Igreja Reformada, Confessante e Bíblica.',
    hero_subtitle: 'Nossa missão é glorificar a Deus através da proclamação do Evangelho de Jesus Cristo.',
    hero_image_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1200',
    mission_title: 'Cremos na Soberania de Deus',
    mission_description: 'Nossa missão é glorificar a Deus através da proclamação do Evangelho.',
    about_title: 'Nossa História',
    about_description: 'Filiada à Igreja Presbiteriana do Brasil, mantendo os padrões de fé.',
    contact_email: 'contato@ipbcentral.org.br',
    contact_phone: '(11) 3212-4455',
    contact_address: 'Av. Consolação, 450, São Paulo - SP',
    finance_title: 'Contribua com a Obra do Senhor',
    finance_description: 'Seus dízimos e ofertas sustentam o ministério pastoral, a manutenção do templo e nossas frentes missionárias locais e globais.',
    finance_pix_key: CHURCH_BANK_INFO.pix.key,
    finance_pix_type: CHURCH_BANK_INFO.pix.type,
    finance_pix_holder: CHURCH_BANK_INFO.pix.holder,
    finance_bank1_name: CHURCH_BANK_INFO.accounts[0]?.bank || '',
    finance_bank1_agency: CHURCH_BANK_INFO.accounts[0]?.agency || '',
    finance_bank1_account: CHURCH_BANK_INFO.accounts[0]?.account || '',
    finance_bank2_name: CHURCH_BANK_INFO.accounts[1]?.bank || '',
    finance_bank2_agency: CHURCH_BANK_INFO.accounts[1]?.agency || '',
    finance_bank2_account: CHURCH_BANK_INFO.accounts[1]?.account || ''
  };

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, e, set] = await Promise.all([
          churchService.getSermons(),
          churchService.getEvents(),
          churchService.getSettings()
        ]);
        setSermons(s.slice(0, 3));
        setEvents(e.slice(0, 3));

        if (set) {
          // Merge defaults with fetched settings, ensuring no empty strings break layout
          setSettings({
            ...DEFAULT_SETTINGS,
            ...set,
            hero_title: set.hero_title || DEFAULT_SETTINGS.hero_title,
            hero_subtitle: set.hero_subtitle || DEFAULT_SETTINGS.hero_subtitle,
            hero_image_url: set.hero_image_url || DEFAULT_SETTINGS.hero_image_url,
            mission_title: set.mission_title || DEFAULT_SETTINGS.mission_title,
            about_title: set.about_title || DEFAULT_SETTINGS.about_title,
            // Finance Defaults
            finance_title: set.finance_title || DEFAULT_SETTINGS.finance_title,
            finance_description: set.finance_description || DEFAULT_SETTINGS.finance_description,
            finance_pix_key: set.finance_pix_key || DEFAULT_SETTINGS.finance_pix_key,
            finance_pix_type: set.finance_pix_type || DEFAULT_SETTINGS.finance_pix_type,
            finance_pix_holder: set.finance_pix_holder || DEFAULT_SETTINGS.finance_pix_holder,
            finance_bank1_name: set.finance_bank1_name || DEFAULT_SETTINGS.finance_bank1_name,
            finance_bank1_agency: set.finance_bank1_agency || DEFAULT_SETTINGS.finance_bank1_agency,
            finance_bank1_account: set.finance_bank1_account || DEFAULT_SETTINGS.finance_bank1_account,
            finance_bank2_name: set.finance_bank2_name || DEFAULT_SETTINGS.finance_bank2_name,
            finance_bank2_agency: set.finance_bank2_agency || DEFAULT_SETTINGS.finance_bank2_agency,
            finance_bank2_account: set.finance_bank2_account || DEFAULT_SETTINGS.finance_bank2_account,
          });
        }
      } catch (error) {
        console.error('Error fetching landing data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full glass z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-20 items-center">
          <div className="flex items-center space-x-4">
            <img src="/logo.jpg" alt="Logo" className="h-16 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-black text-lg text-emerald-900 leading-tight uppercase tracking-tighter">Brotas de Macaúbas</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Igreja Presbiteriana</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" onClick={(e) => scrollToSection(e, 'inicio')} className="text-sm text-gray-600 hover:text-blue-800 font-bold transition-colors">Início</a>
            <a href="#sermoes" onClick={(e) => scrollToSection(e, 'sermoes')} className="text-sm text-gray-600 hover:text-blue-800 font-bold transition-colors">Sermões</a>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="text-sm text-gray-600 hover:text-blue-800 font-bold transition-colors">Agenda</a>
            <a href="#ofertas" onClick={(e) => scrollToSection(e, 'ofertas')} className="text-sm text-gray-600 hover:text-blue-800 font-bold transition-colors">Contribuições</a>
            <Link to="/login" className="bg-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20">
              Painel Administrativo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="inicio" className="relative pt-48 pb-32 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 -z-10 opacity-[0.03] rotate-12">
          <Cross size={800} />
        </div>
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
              <Info size={14} />
              <span>{settings.mission_title}</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-none">
              {settings.hero_title}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              {settings.hero_subtitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="bg-blue-800 text-white px-10 py-5 rounded-2xl font-black flex items-center space-x-3 hover:bg-blue-900 transition-all shadow-2xl shadow-blue-900/30">
                <span>Nossos Cultos</span>
                <ChevronRight size={20} />
              </a>
              <a href="#ofertas" onClick={(e) => scrollToSection(e, 'ofertas')} className="bg-white text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-2xl font-black flex items-center space-x-3 hover:border-blue-200 transition-all">
                <Heart size={20} className="text-rose-500" />
                <span>Ofertar</span>
              </a>
            </div>
          </div>
          <div className="relative animate-in zoom-in duration-1000">
            <div className="absolute -inset-4 bg-blue-800 rounded-[48px] rotate-3 opacity-10"></div>
            <img
              src={settings.hero_image_url}
              alt="Igreja"
              className="relative rounded-[40px] shadow-2xl object-cover h-[600px] w-full"
            />
          </div>
        </div>
      </section>

      {/* Hoje na Igreja */}
      <TodayAtChurch banners={settings.banners} />

      {/* Sermone */}
      <section id="sermoes" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 flex items-center gap-4">
                <Mic2 className="text-blue-700" size={40} /> Últimas Pregações
              </h2>
              <p className="text-slate-500 max-w-lg font-medium">
                Assista ou ouça as exposições bíblicas realizadas em nossa congregação. Conteúdo disponível para site e aplicativo.
              </p>
            </div>
            <button className="text-blue-700 font-black text-sm uppercase tracking-widest flex items-center gap-2 group">
              Ver Galeria Completa <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sermons.map(s => (
              <div key={s.id} className="group bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="h-56 bg-slate-900 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white">
                      <Youtube size={32} />
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black text-blue-700 uppercase tracking-widest">
                    <span>{new Date(s.date).toLocaleDateString('pt-BR')}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {s.pastor}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-800 transition-colors">{s.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 font-medium">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section (New Dynamic) */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-slate-900">{settings.about_title}</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium whitespace-pre-line">
              {settings.about_description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
              <h4 className="font-black text-blue-700 uppercase tracking-widest text-xs">Missão</h4>
              <p className="text-slate-600 font-bold text-sm leading-relaxed">{settings.mission_description}</p>
            </div>
            <div className="bg-blue-800 p-8 rounded-[32px] shadow-xl text-white space-y-4">
              <h4 className="font-black text-blue-200 uppercase tracking-widest text-xs">Visão</h4>
              <p className="font-bold text-sm leading-relaxed">Ser uma igreja que glorifica a Deus em tudo o que faz, sendo luz no mundo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Offering */}
      <section id="ofertas" className="py-32 bg-blue-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black">
              {settings.finance_title?.split('Obra').length > 1 ? (
                <>
                  {settings.finance_title?.split('Obra')[0]}Obra <span className="text-blue-300">{settings.finance_title?.split('Obra')[1]}</span>
                </>
              ) : (
                settings.finance_title
              )}
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed font-medium">
              {settings.finance_description}
            </p>
            <div className="bg-white/10 p-8 rounded-[32px] border border-white/10 space-y-4">
              <h4 className="font-bold text-xl flex items-center gap-2">
                <span className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h.01" /><path d="M7 17h.01" /><path d="M17 7h.01" /><path d="M17 17h.01" /></svg>
                </span>
                PIX (QR Code)
              </h4>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-white p-2 rounded-xl">
                  <img
                    src={settings.finance_pix_qr_url || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(settings.finance_pix_key || '')}`}
                    alt="QR Code PIX"
                    className="w-32 h-32"
                  />
                </div>
                <div className="flex-1 w-full space-y-2">
                  <p className="text-xs text-blue-200 uppercase font-bold tracking-widest">Chave {settings.finance_pix_type}</p>
                  <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/5">
                    <span className="font-mono text-lg truncate pr-4">{settings.finance_pix_key}</span>
                    <button
                      onClick={() => {
                        if (settings.finance_pix_key) {
                          navigator.clipboard.writeText(settings.finance_pix_key)
                            .then(() => alert('Chave PIX copiada!'))
                            .catch(() => prompt('Copie a chave manualmente:', settings.finance_pix_key));
                        }
                      }}
                      className="bg-white text-blue-900 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 active:scale-95 transition-all"
                    >
                      Copiar
                    </button>
                  </div>
                  <p className="text-[10px] text-blue-300 font-medium">{settings.finance_pix_holder}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[48px] p-12 text-slate-900 shadow-2xl">
            <h3 className="text-3xl font-black mb-8">Dados Bancários</h3>
            <div className="space-y-6">
              {/* Bank 1 */}
              {settings.finance_bank1_name && (
                <div className="border-b border-slate-100 pb-4 last:border-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{settings.finance_bank1_name}</p>
                  <div className="flex justify-between font-bold text-lg flex-wrap gap-2">
                    <span>Agência: {settings.finance_bank1_agency}</span>
                    <span>C/C: {settings.finance_bank1_account}</span>
                  </div>
                </div>
              )}

              {/* Bank 2 */}
              {settings.finance_bank2_name && (
                <div className="border-b border-slate-100 pb-4 last:border-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{settings.finance_bank2_name}</p>
                  <div className="flex justify-between font-bold text-lg flex-wrap gap-2">
                    <span>Agência: {settings.finance_bank2_agency}</span>
                    <span>C/C: {settings.finance_bank2_account}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-12 bg-blue-50 p-6 rounded-3xl flex items-start gap-4">
              <Info className="text-blue-700 flex-shrink-0" size={24} />
              <p className="text-sm text-blue-900 leading-relaxed font-medium italic">
                "Cada um contribua conforme determinou em seu coração, não com pesar nem por obrigação, pois Deus ama quem dá com alegria." - 2 Co 9:7
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-32 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-20">
          <div className="col-span-2 space-y-8">
            <div className="flex items-center space-x-4 text-white">
              <img src="/logo.jpg" alt="Logo" className="h-20 w-auto object-contain brightness-0 invert opacity-80" />
              <div className="flex flex-col">
                <span className="font-black text-2xl uppercase tracking-tighter">IPB Brotas</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em]">Portal Eclésia</span>
              </div>
            </div>
            <p className="max-w-md text-lg leading-relaxed">
              {settings.about_description.substring(0, 150)}...
            </p>
          </div>
          <div className="space-y-6">
            <h5 className="text-white font-black uppercase tracking-widest text-xs">Endereço & Contato</h5>
            <p className="text-sm leading-loose">
              {settings.contact_address}<br />
              {settings.contact_phone}<br />
              {settings.contact_email}
            </p>
          </div>
          <div className="space-y-6">
            <h5 className="text-white font-black uppercase tracking-widest text-xs">Administração</h5>
            <Link to="/login" className="text-sm font-bold text-blue-500 hover:text-blue-400 underline decoration-blue-500/30 underline-offset-8">Acesso Restrito ao Conselho</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-24 pt-8 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-center">
          © {new Date().getFullYear()} Portal Eclésia - V.2.1 - Prontos para o Mobile.
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;