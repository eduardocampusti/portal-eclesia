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
    hero_image_url: '/hero.jpg',
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
    banners: [],
    // New Fields
    logo_url: '/logo.png',
    social_instagram: '',
    social_youtube: '',
    social_twitter: '',
    about_card1_title: 'Cultos',
    about_card1_text: 'Venha adorar conosco.',
    about_card2_title: 'Estudo',
    about_card2_text: 'Cresça na Palavra.',
    about_card3_title: 'Missões',
    about_card3_text: 'Servindo ao próximo.',
    google_maps_url: '',
    schedule_summary: 'Domingos 9h e 19h',
    footer_copyright: `© ${new Date().getFullYear()} IPB Brotas. Todos os direitos reservados.`
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
          // Merge settings but keep defaults if fetched values are empty
          setSettings(prev => {
            const merged = { ...prev };
            Object.keys(set).forEach(key => {
              const val = (set as any)[key];
              if (val !== null && val !== undefined && val !== '') {
                (merged as any)[key] = val;
              }
            });
            return merged;
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="landing bg-[#FBFBFA]">
      {/* Header Institucional (Design Match) */}
      <header className="header">
        <div className="container headerInner">
          <Link to="/" className="logoArea">
            <img src={settings.logo_url || "/logo.jpg"} alt="Logo IPB" />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-[#27432F] leading-tight uppercase tracking-tight">IPB Brotas</span>
              <span className="text-[10px] font-bold text-[#D19E65] uppercase tracking-widest leading-none">Presbiteriana</span>
            </div>
          </Link>

          <nav className="navMenu hidden lg:flex">
            <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')}>Sobre</a>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')}>Programação</a>
            <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')}>Localização</a>
          </nav>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-bold text-[#1B3022] hover:text-[#C87A3E] transition-colors">
              Entrar
            </Link>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnAccent rounded-lg shadow-md hover:shadow-lg transition-all hidden md:flex items-center gap-2">
              Horários dos Cultos <ChevronRight size={16} />
            </a>
            <button className="lg:hidden p-2 text-[#1B3022]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[90px] bg-[#FDFBFA] z-[110] p-8 flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in duration-300">
            <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className="text-2xl font-bold text-[#1B3022]">Sobre a IPB</a>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="text-2xl font-bold text-[#1B3022]">Programação</a>
            <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')} className="text-2xl font-bold text-[#1B3022]">Localização</a>
            <div className="mt-4 pt-6 border-t border-slate-100 flex flex-col gap-4">
              <Link to="/login" className="text-center py-4 font-bold text-[#1B3022]">Entrar / Login</Link>
              <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnAccent w-full text-center">Horários dos Cultos</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section (Design Match) */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${settings.hero_image_url || "/hero.jpg"})`,
          backgroundAttachment: 'fixed' // Parallax effect for premium feel
        }}
      >
        <div className="container">
          <div className="heroContent animate-in fade-in slide-in-from-left duration-1000">
            <div className="flex flex-col items-start">
              <span className="heroKicker mb-6">Uma Igreja Viva</span>
              <h1 className="mb-6 drop-shadow-md">{settings.hero_title || DEFAULT_SETTINGS.hero_title}</h1>
              <p className="heroSub mb-8 drop-shadow-md">
                {settings.hero_subtitle || DEFAULT_SETTINGS.hero_subtitle}
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btn btnPrimary !px-10 shadow-xl">
                  Ver Programação
                </a>
                <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')} className="btn btnSecondary !px-10 font-bold glass shadow-sm">
                  Visitar agora <ChevronRight size={18} className="ml-1 text-orange" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda - Próximos Encontros */}
      <section id="agenda" className="section bg-white">
        <div className="container">
          <div className="sectionTitle">
            <span className="kicker">Vida Comunitária</span>
            <h2>{settings.mission_title || 'Próximos Encontros'}</h2>
          </div>
          <TodayAtChurch mode="grid" />
        </div>
      </section>

      {/* Sobre Nós (Design Match Cards) */}
      <section id="sobre" className="section bg-[#FBFBFA]">
        <div className="container">
          <div className="sectionTitle">
            <span className="kicker">Identidade</span>
            <h2>{settings.about_title || 'Sobre Nós'}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="infoCard">
              <div className="circleIcon"><Compass size={32} /></div>
              <h3>Nossa Fé</h3>
              <p className="text-sm">Nossa piedade fundamenta-se puramente nas Escrituras Sagradas.</p>
            </div>
            <div className="infoCard">
              <div className="circleIcon"><Flame size={32} fill="currentColor" /></div>
              <h3>Nossa Missão</h3>
              <p className="text-sm">Proclamar Jesus Cristo, manter a comunhão e fazer discípulos.</p>
            </div>
            <div className="infoCard">
              <div className="circleIcon"><User size={32} /></div>
              <h3>Como Participar</h3>
              <p className="text-sm">Entre em contato para eventos, cultos e grupos de estudos.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="max-w-2xl mx-auto mb-8 text-lg text-slate-600 italic">
              "{settings.about_description}"
            </p>
            <a href="#sobre" className="text-green font-extrabold text-base inline-flex items-center gap-2 hover:gap-4 transition-all group">
              Conheça nossa história <ChevronRight size={18} className="text-orange" />
            </a>
          </div>
        </div>
      </section>

      <section id="visite" className="section bg-white">
        <div className="container">
          <div className="sectionTitle">
            <span className="kicker">Localização</span>
            <h2>Visite-nos</h2>
          </div>

          <div className="grid grid12 gap-8 items-start">
            {/* Esquerda: Sermon/Video (Model Match) */}
            <div className="lg:col-span-6 col-span-12">
              <div className="sermonCard group relative">
                <img src={settings.hero_image_url || "/hero.jpg"} alt="A Palavra de Deus" className="w-full h-full object-cover" />
                <div className="playOverlay">
                  <div className="text-center">
                    <div className="playButton mx-auto mb-4 bg-white/20 backdrop-blur-md">
                      <Mic2 size={32} className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h4 className="text-white text-xl font-bold mb-2">A Palavra de Deus</h4>
                  <button className="btn btnAccent !py-2 !px-6 !text-xs uppercase tracking-widest">
                    Assista ao Sermão ›
                  </button>
                </div>
              </div>
            </div>

            {/* Direita: Info List (Model Match) */}
            <div className="lg:col-span-6 col-span-12 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-[#F4F1EA] rounded-xl flex items-start gap-4">
                  <MapPin size={24} className="text-orange shrink-0 mt-1" />
                  <div>
                    <h4 className="text-[11px] uppercase font-black text-orange tracking-widest mb-1">Rua Waldemar Falcão</h4>
                    <p className="text-sm font-bold text-green">Domingo - 9:00h & 19:00h</p>
                    <p className="text-sm font-bold text-green">Quarta-feira - 19:30h</p>
                  </div>
                </div>

                <div className="p-6 bg-[#F4F1EA] rounded-xl flex items-start gap-4">
                  <div className="bg-orange p-1 rounded text-white font-bold text-[10px]">IPB</div>
                  <div>
                    <h4 className="text-[11px] uppercase font-black text-orange tracking-widest mb-1">Horários dos Cultos</h4>
                    <p className="text-sm font-bold text-green">Domingo - 9:00h & 19:00h</p>
                    <p className="text-sm font-bold text-green">Quarta-feira - 19:30h</p>
                  </div>
                </div>

                <div className="p-6 bg-[#F4F1EA] rounded-xl flex items-start gap-4 col-span-1 md:col-span-2">
                  <div className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center text-green">
                    <Phone size={18} />
                  </div>
                  <p className="text-sm font-bold text-green">{settings.contact_phone}</p>
                </div>

                <div className="p-6 bg-[#F4F1EA] rounded-xl flex items-start gap-4 col-span-1 md:col-span-2">
                  <div className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center text-green font-bold text-xs">✓</div>
                  <p className="text-sm font-bold text-green">{settings.contact_email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15444.601449852236!2d-42.636657800000005!3d-12.000694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x74423877995648f%3A0xe6719b0d238c3867!2sIgreja%20Presbiteriana%20de%20Brotas%20de%20Maca%C3%BAbas!5e0!3m2!1spt-BR!2sbr!4v1739144400000!5m2!1spt-BR!2sbr"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
              allowFullScreen={true}
              loading="lazy"
              title="Google Maps Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer (Design Match) */}
      <footer className="mainFooter">
        <div className="container">
          <div className="footerSocials">
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="hover:bg-orange transition-colors"><Instagram size={20} /></a>
            )}
            {settings.social_twitter && (
              <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="hover:bg-orange transition-colors"><Twitter size={20} /></a>
            )}
            {settings.social_youtube && (
              <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="hover:bg-orange transition-colors"><Youtube size={20} /></a>
            )}
          </div>

          <div className="footerGrid">
            <div className="footerCol">
              <h4>Nosso Endereço</h4>
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-orange" /> {settings.contact_address}
              </p>
            </div>
            <div className="footerCol">
              <h4>Programação</h4>
              <p>Domingo - 9:00h & 19:00h</p>
              <p>Quarta-feira - 19:30h</p>
            </div>
            <div className="footerCol">
              <h4>Fale Conosco</h4>
              <p className="flex items-center gap-2 text-xs font-bold underline">
                <Phone size={14} /> {settings.contact_phone}
              </p>
              <p className="text-[10px] opacity-60 break-all">{settings.contact_email}</p>
            </div>
          </div>

          <div className="footerBottom">
            <p>© {new Date().getFullYear()} {settings.footer_copyright || 'Igreja Presbiteriana de Brotas de Macaúbas. Todos os direitos reservados.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;
