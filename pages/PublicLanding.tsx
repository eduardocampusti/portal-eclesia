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
  Phone,
  Menu,
  X,
  Flame,
  Instagram,
  Twitter,
  Plus,
  Compass
} from 'lucide-react';
import { churchService } from '../services/churchService';
import { Sermon, Event, SiteSettings } from '../types';
import { CHURCH_BANK_INFO } from '../constants';
import TodayAtChurch from '../components/TodayAtChurch';

const PublicLanding: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const DEFAULT_SETTINGS: SiteSettings = {
    id: 'default',
    hero_title: 'Igreja Presbiteriana de Brotas de Macaúbas',
    hero_subtitle: 'Uma comunidade de fé reformada, servindo ao Senhor com alegria.',
    hero_image_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1200',
    mission_title: 'Sobre Nós',
    mission_description: 'Nossa missão é glorificar a Deus através da proclamação do Evangelho.',
    about_title: 'Nossa História',
    about_description: 'Filiada à Igreja Presbiteriana do Brasil, mantendo os padrões de fé e prática das Escrituras Sagradas.',
    contact_email: 'contato@ipbbrotas.org',
    contact_phone: '(77) 99912-3412',
    contact_address: 'Rua Waldemar Falcão, s/n, Brotas de Macaúbas - BA',
    finance_title: 'Contribua com a Obra do Senhor',
    finance_description: 'Seus dízimos e ofertas sustentam o ministério pastoral e a manutenção do templo.',
    finance_pix_key: CHURCH_BANK_INFO.pix.key,
    finance_pix_type: CHURCH_BANK_INFO.pix.type,
    finance_pix_holder: CHURCH_BANK_INFO.pix.holder,
    finance_bank1_name: (CHURCH_BANK_INFO.accounts as any)[0]?.bank || '',
    finance_bank1_agency: (CHURCH_BANK_INFO.accounts as any)[0]?.agency || '',
    finance_bank1_account: (CHURCH_BANK_INFO.accounts as any)[0]?.account || '',
    finance_bank2_name: (CHURCH_BANK_INFO.accounts as any)[1]?.bank || '',
    finance_bank2_agency: (CHURCH_BANK_INFO.accounts as any)[1]?.agency || '',
    finance_bank2_account: (CHURCH_BANK_INFO.accounts as any)[1]?.account || '',
    finance_pix_qr_url: '',
    banners: []
  };

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
          setSettings({ ...DEFAULT_SETTINGS, ...set });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="landing">
      {/* Header Premium */}
      <header className="header">
        <div className="container headerInner">
          <div className="logoArea">
            <img src="/logo.jpg" alt="Logo IPB" />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-[#1F4D35] leading-tight uppercase tracking-tight">Igreja Presbiteriana</span>
              <span className="text-[10px] font-bold text-[#D29E65] uppercase tracking-widest leading-none">de Brotas de Macaúbas</span>
            </div>
          </div>

          <nav className="navMenu">
            <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')}>Nossa Fé</a>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')}>Agenda</a>
            <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')}>Localização</a>
            <a href="#ofertas" onClick={(e) => scrollToSection(e, 'ofertas')}>Ofertas</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="btn btnSoft hidden md:inline-flex">
              Entrar
            </Link>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btn btnPrimary hidden md:inline-flex">
              Horários dos Cultos
            </a>
            <button className="lg:hidden p-2 text-[#1F4D35]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[80px] bg-white z-[110] p-8 flex flex-col gap-6 shadow-2xl animate-fade-in">
            <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className="text-2xl font-bold text-[#1F4D35]">Nossa Fé</a>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="text-2xl font-bold text-[#1F4D35]">Agenda Semanal</a>
            <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')} className="text-2xl font-bold text-[#1F4D35]">Onde Estamos</a>
            <a href="#ofertas" onClick={(e) => scrollToSection(e, 'ofertas')} className="text-2xl font-bold text-[#1F4D35]">Contribuições</a>
            <div className="mt-4 pt-6 border-t border-slate-100 flex flex-col gap-4">
              <Link to="/login" className="btn btnSoft w-full">Entrar na Área Restrita</Link>
              <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btn btnPrimary w-full">Horários dos Cultos</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Premium */}
      <section className="section hero">
        <div className="container">
          <div className="heroContent">
            <div className="heroText">
              <div className="kicker">
                <Flame size={14} />
                <span>Uma Igreja Reformada e Bíblica</span>
              </div>
              <h1>{settings.hero_title}</h1>
              <p className="mt-8 mb-10 text-lg">
                Seja bem-vindo à nossa casa. <span className="text-[#D29E65] font-bold">Simplicidade no Culto, Santidade na Vida e Fidelidade às Escrituras.</span>
              </p>
              <div className="heroActions flex gap-4">
                <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btn btnPrimary">
                  Ver Programação
                </a>
                <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')} className="btn btnSecondary">
                  Como Chegar <ChevronRight size={18} />
                </a>
              </div>
            </div>
            <div className="heroMedia">
              <img src={settings.hero_image_url} alt="Nossa Igreja" />
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Encontros */}
      <section id="agenda" className="section bg-white">
        <div className="container">
          <div className="mb-12">
            <span className="kicker">Comunhão</span>
            <h2>Próximos Encontros</h2>
            <p>Acompanhe nossas atividades e participe conosco em adoração.</p>
          </div>
          <TodayAtChurch banners={settings.banners} mode="grid" />
        </div>
      </section>

      {/* Sobre Nós */}
      <section id="sobre" className="section">
        <div className="container">
          <div className="mb-12 text-center max-w-2xl mx-auto flex flex-col items-center">
            <span className="kicker !mb-4">Identidade</span>
            <h2>Nossas Raízes</h2>
            <p>Mantendo a tradição presbiteriana com foco na centralidade de Cristo e na autoridade das Escrituras.</p>
          </div>

          <div className="grid grid3">
            <div className="card">
              <div className="cardIcon"><Cross size={28} /></div>
              <h3 className="cardTitle">Nossa Fé</h3>
              <p className="text-sm">Baseamos nossa fé nas Escrituras Sagradas, crendo que a Bíblia é a única regra infalível de fé e prática.</p>
            </div>
            <div className="card">
              <div className="cardIcon"><Compass size={28} /></div>
              <h3 className="cardTitle">Nossa Missão</h3>
              <p className="text-sm">Proclamar o Evangelho de Jesus Cristo, fazendo discípulos e servindo a nossa cidade de Brotas.</p>
            </div>
            <div className="card">
              <div className="cardIcon"><User size={28} /></div>
              <h3 className="cardTitle">Como Participar</h3>
              <p className="text-sm">Seja em nossos cultos, estudos bíblicos ou pequenos grupos, há sempre um lugar para você.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visite-nos */}
      <section id="visite" className="section bg-white">
        <div className="container">
          <div className="mb-12">
            <span className="kicker">Conveniência</span>
            <h2>Onde nos encontrar</h2>
          </div>

          <div className="visitArea">
            <div className="flex flex-col gap-6">
              <div className="card">
                <span className="kicker !bg-slate-50">Localização</span>
                <h4 className="cardTitle text-lg">Templo Principal</h4>
                <p className="text-sm">{settings.contact_address}</p>
                <div className="flex items-center gap-2 text-sm font-bold text-[#D29E65]">
                  <MapPin size={16} /> Ver no mapa abaixo
                </div>
              </div>

              <div className="card">
                <span className="kicker !bg-slate-50">Horários Centrais</span>
                <div className="mt-2 space-y-3">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="font-semibold text-slate-700">Domingo Manhã (EBD)</span>
                    <span className="text-[#1F4D35] font-bold">09h00</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="font-semibold text-slate-700">Domingo Noite (Culto)</span>
                    <span className="text-[#1F4D35] font-bold">19h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Quarta-feira (Oração)</span>
                    <span className="text-[#1F4D35] font-bold">19h30</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mapCard">
              <div className="mapPreview">
                <div className="mapPin animate-bounce"></div>
              </div>
              <div className="mapFooter">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.contact_address || 'Igreja Presbiteriana de Brotas de Macaúbas')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btnPrimary"
                >
                  Abrir no Google Maps <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contribua */}
      <section id="ofertas" className="section bg-[#1F4D35] text-white">
        <div className="container">
          <div className="donationCard">
            <div className="donationInfo">
              <div className="kicker !bg-white/10 !text-[#D29E65]">Dízimos e Ofertas</div>
              <h2 className="!text-white mb-6">Apoie a Obra do Senhor</h2>
              <p className="text-white/70 text-lg mb-8">
                Sua generosidade sustenta o ministério pastoral, a manutenção do nosso templo e nossas ações sociais em Brotas de Macaúbas.
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="block text-[10px] font-black uppercase text-[#D29E65] mb-1">Dados Bancários</span>
                  <p className="font-bold text-white">{settings.finance_bank1_name} • Ag: {settings.finance_bank1_agency} • CC: {settings.finance_bank1_account}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="block text-[10px] font-black uppercase text-[#D29E65] mb-1">CNPJ Institucional</span>
                  <p className="font-mono text-sm text-white">14.321.456/0001-90</p>
                </div>
              </div>
            </div>

            <div className="qrWrap">
              <span className="kicker !mb-4 mx-auto">Escanear PIX</span>
              <img
                src={settings.finance_pix_qr_url || `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(settings.finance_pix_key || '')}`}
                alt="QR Code PIX"
              />
              <button
                onClick={() => {
                  if (settings.finance_pix_key) {
                    navigator.clipboard.writeText(settings.finance_pix_key);
                    alert('Chave PIX copiada com sucesso!');
                  }
                }}
                className="btn btnPrimary w-full"
              >
                Copiar Chave Completa
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sermões */}
      <section className="section">
        <div className="container">
          <div className="mb-12 flex justify-between items-end gap-6 flex-wrap">
            <div>
              <span className="kicker">Exposição Bíblica</span>
              <h2>Últimas Pregações</h2>
            </div>
            <a href="#" className="btn btnSoft">Ver todos os sermões</a>
          </div>

          <div className="grid grid3">
            {sermons.map(s => (
              <div key={s.id} className="card group">
                <div className="h-40 bg-slate-900 rounded-lg mb-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-green-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Youtube size={32} className="text-white" />
                  </div>
                </div>
                <span className="cardMeta">{new Date(s.date).toLocaleDateString('pt-BR')}</span>
                <h3 className="cardTitle font-bold !text-lg !font-sans !mb-1">{s.title}</h3>
                <p className="text-xs italic mb-2">Pastor: {s.pastor}</p>
                <p className="text-sm line-clamp-2">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footerGrid">
            <div className="footerBrand">
              <div className="flex flex-col mb-6">
                <span className="font-extrabold text-lg text-white leading-tight uppercase tracking-tight">Igreja Presbiteriana</span>
                <span className="text-xs font-bold text-[#D29E65] uppercase tracking-widest leading-none">de Brotas de Macaúbas</span>
              </div>
              <p className="max-w-xs mb-8">Filiada à Igreja Presbiteriana do Brasil (IPB). Uma comunidade bíblica e acolhedora em Brotas.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D29E65] transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D29E65] transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D29E65] transition-colors">
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            <div className="footerCol">
              <h4>Endereço</h4>
              <p>{settings.contact_address}</p>
            </div>

            <div className="footerCol">
              <h4>Cultos</h4>
              <p>Domingo: 09h00 & 19h00<br />Quarta: 19h30 (Oração)</p>
            </div>

            <div className="footerCol">
              <h4>Acesso</h4>
              <Link to="/login" className="text-white/40 hover:text-white transition-colors text-sm">
                Portal Administrativo
              </Link>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
            © {new Date().getFullYear()} Igreja Presbiteriana • Portal Eclésia
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;