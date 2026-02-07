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
      {/* Header Premium Simplificado (B) */}
      <header className="header">
        <div className="container headerInner">
          <Link to="/" className="logoArea">
            <img src="/logo.jpg" alt="Logo IPB" />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-[#27432F] leading-tight uppercase tracking-tight">IPB Brotas</span>
              <span className="text-[10px] font-bold text-[#D19E65] uppercase tracking-widest leading-none">Presbiteriana</span>
            </div>
          </Link>

          <nav className="navMenu">
            <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')}>Nossa Fé</a>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')}>Agenda</a>
            <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')}>Localização</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btn btnPrimary hidden md:inline-flex">
              Horários dos Cultos
            </a>
            <button className="lg:hidden p-2 text-[#27432F]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (B) */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[80px] bg-white z-[110] p-8 flex flex-col gap-6 shadow-2xl animate-fade-in">
            <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className="text-2xl font-bold text-[#27432F]">Nossa Fé</a>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="text-2xl font-bold text-[#27432F]">Agenda Semanal</a>
            <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')} className="text-2xl font-bold text-[#27432F]">Onde Estamos</a>
            <div className="mt-4 pt-6 border-t border-slate-100 flex flex-col gap-4">
              <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btn btnPrimary w-full">Horários dos Cultos</a>
              <Link to="/login" className="text-center text-sm text-slate-400 mt-4" onClick={() => setIsMenuOpen(false)}>Área Administrativa</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Imersivo Premium */}
      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1920"
          alt="Igreja"
          className="heroBackground"
        />
        <div className="heroOverlay"></div>
        <div className="container heroContent">
          <div className="heroText">
            <div className="heroKicker">
              <Flame size={14} />
              <span>Uma Igreja Reformada e Bíblica</span>
            </div>
            <h1>{settings.hero_title}</h1>
            <p>
              Simplicidade no Culto, Santidade na Vida e Fidelidade às Escrituras. Seja bem-vindo à nossa casa.
            </p>
            <div className="heroActions flex gap-4">
              <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btn btnPrimary">
                Ver Programação
              </a>
              <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')} className="btn btnSecondary bg-white/10 !text-white !border-white/20 hover:!bg-white/20">
                Como Chegar <ChevronRight size={18} />
              </a>
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

      {/* Visite-nos com Mapa Real */}
      <section id="visite" className="section bg-white">
        <div className="container">
          <div className="mb-12">
            <span className="heroKicker !bg-slate-100 !text-slate-600">Localização</span>
            <h2>Onde nos encontrar</h2>
            <p>Venha nos visitar e participar de nossos cultos e atividades.</p>
          </div>

          <div className="visitArea">
            <div className="flex flex-col gap-6">
              <div className="card">
                <span className="cardMeta">Templo Principal</span>
                <h4 className="cardTitle text-lg">Igreja Presbiteriana de Brotas</h4>
                <p className="text-sm">{settings.contact_address}</p>
                <div className="flex items-center gap-2 text-sm font-bold text-[#D19E65] mt-4">
                  <MapPin size={16} /> Brotas de Macaúbas - BA
                </div>
              </div>

              <div className="card">
                <span className="cardMeta">Horários de Culto</span>
                <div className="mt-2 space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="font-medium text-slate-700">Domingo (EBD)</span>
                    <span className="text-[#27432F] font-bold">09h00</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="font-medium text-slate-700">Domingo (Culto)</span>
                    <span className="text-[#27432F] font-bold">19h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700">Quarta (Oração)</span>
                    <span className="text-[#27432F] font-bold">19h30</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mapCard">
              <div className="mapContainer">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1m3!1d15444.600994514!2d-42.6346!3d-12.0007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDAwJzAyLjUiUyA0MsKwMzgnMDQuNiJX!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="mapFooter">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.contact_address || 'Igreja Presbiteriana de Brotas de Macaúbas')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btnSecondary !py-2 !text-sm"
                >
                  Abrir no Google Maps <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção PIX Premium */}
      <section id="ofertas" className="section">
        <div className="container">
          <div className="donationCard items-start">
            <div className="donationInfo">
              <span className="heroKicker !bg-orange-light !text-[#D19E65]">Dízimos e Ofertas</span>
              <h2 className="mb-6">Apoie a Obra do Senhor</h2>
              <p className="text-lg mb-8">
                Sua generosidade sustenta o ministério pastoral, a manutenção do nosso templo e nossas ações missionárias em nossa região. Deus ama quem dá com alegria.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <span className="block text-[10px] font-black uppercase text-[#D19E65] mb-2">Dados Bancários</span>
                  <p className="font-bold text-[#27432F] text-sm">
                    {settings.finance_bank1_name}<br />
                    Agência: {settings.finance_bank1_agency}<br />
                    Conta: {settings.finance_bank1_account}
                  </p>
                </div>
                <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <span className="block text-[10px] font-black uppercase text-[#D19E65] mb-2">CNPJ Institucional</span>
                  <p className="font-mono text-sm text-[#27432F]">14.321.456/0001-90</p>
                </div>
              </div>
            </div>

            <div className="pixCard">
              <span className="cardMeta !mb-4">QR Code PIX</span>
              <img
                src={settings.finance_pix_qr_url || `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(settings.finance_pix_key || '')}`}
                alt="QR Code PIX"
                className="qrCodeImg"
              />
              <div className="pixKeyBox mb-6">
                <span className="truncate mr-2">{settings.finance_pix_key}</span>
              </div>
              <button
                onClick={() => {
                  if (settings.finance_pix_key) {
                    navigator.clipboard.writeText(settings.finance_pix_key);
                    alert('Chave PIX copiada!');
                  }
                }}
                className="btn btnPrimary w-full"
              >
                Copiar Chave Completa
              </button>
              <p className="text-[10px] text-slate-400 mt-4 text-center">
                Igreja Presbiteriana do Brasil • Brotas de Macaúbas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sermões com Card Premium */}
      <section className="section bg-slate-50">
        <div className="container">
          <div className="mb-12 flex justify-between items-end gap-6 flex-wrap">
            <div>
              <span className="heroKicker !bg-green !text-white opacity-20">Exposição Bíblica</span>
              <h2>Últimas Pregações</h2>
              <p>Ouça a Palavra de Deus exposta com fidelidade.</p>
            </div>
            <a href="#" className="btn btnSecondary">Ver todos os sermões</a>
          </div>

          <div className="grid grid3">
            {sermons.map(s => (
              <div key={s.id} className="card group">
                <div className="h-48 bg-slate-900 rounded-xl mb-6 relative overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-green/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                      <Youtube size={28} className="text-white" />
                    </div>
                  </div>
                </div>
                <span className="cardMeta">{new Date(s.date).toLocaleDateString('pt-BR')}</span>
                <h3 className="cardTitle font-bold !text-xl !font-sans !mb-2">{s.title}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Pastor: {s.pastor}</p>
                <p className="text-sm line-clamp-2 mb-6">{s.description}</p>
                <div className="mt-auto">
                  <button className="btn btnSecondary w-full !text-xs !py-2.5">Ouvir Agora</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Premium Reformulado */}
      <footer>
        <div className="container">
          <div className="footerGrid">
            <div className="footerBrand">
              <div className="flex flex-col mb-8">
                <span className="font-extrabold text-2xl text-white leading-tight uppercase tracking-tight">IPB Brotas</span>
                <span className="text-xs font-bold text-[#D19E65] uppercase tracking-widest leading-none">Presbiteriana</span>
              </div>
              <p className="max-w-xs mb-8 !text-white/60">Filiada à Igreja Presbiteriana do Brasil (IPB). Pela Glória de Deus, pela edificação da Igreja e pela proclamação do Reino.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#D19E65] transition-all border border-white/10">
                  <Instagram size={20} className="text-white" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#D19E65] transition-all border border-white/10">
                  <Youtube size={20} className="text-white" />
                </a>
              </div>
            </div>

            <div className="footerCol">
              <h4>Onde Estamos</h4>
              <p>{settings.contact_address}</p>
              <p className="mt-4 text-[#D19E65] font-bold">Brotas de Macaúbas • BA</p>
            </div>

            <div className="footerCol">
              <h4>Cultos Centrais</h4>
              <p>Domingo: 09h00 (EBD)<br />Domingo: 19h00 (Noite)<br />Quarta: 19h30 (Oração)</p>
            </div>

            <div className="footerCol">
              <h4>Administrativo</h4>
              <Link to="/login" className="btn btnSecondary !bg-white/5 !border-white/10 !text-white/60 hover:!text-white w-full !text-xs">
                Acessar Portal
              </Link>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
            <span>© {new Date().getFullYear()} Igreja Presbiteriana • Brotas de Macaúbas</span>
            <span>Desenvolvido com Fé</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;