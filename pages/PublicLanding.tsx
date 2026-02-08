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
    <div className="landing bg-[#FBFBFA]">
      {/* Header Institucional (Design Match) */}
      <header className="header">
        <div className="container headerInner">
          <Link to="/" className="logoArea">
            <img src="/logo.jpg" alt="Logo IPB" />
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

          <div className="flex items-center gap-4">
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnAccent hidden md:inline-flex">
              Horários dos Cultos
            </a>
            <button className="lg:hidden p-2 text-[#27432F]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[90px] bg-white z-[110] p-8 flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in duration-300">
            <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className="text-2xl font-bold text-[#27432F]">Sobre a IPB</a>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="text-2xl font-bold text-[#27432F]">Programação</a>
            <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')} className="text-2xl font-bold text-[#27432F]">Localização</a>
            <div className="mt-4 pt-6 border-t border-slate-100">
              <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnAccent w-full">Horários dos Cultos</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section (Design Match) */}
      <section className="hero">
        <div className="container">
          <div className="heroContent animate-in fade-in slide-in-from-left duration-1000">
            <h1 className="mb-8">Igreja Presbiteriana de Brotas de Macaúbas</h1>
            <p className="heroSub">
              Pureza na Doutrina, Simplicidade no Culto, Santidade na Vida.
            </p>
            <div className="flex flex-wrap gap-4 mt-12">
              <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btn btnPrimary !px-10">
                Ver horários
              </a>
              <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')} className="btn btnSecondary !px-10 font-bold">
                Como chegar <ChevronRight size={18} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda - Próximos Encontros */}
      <section id="agenda" className="section bg-white">
        <div className="container">
          <div className="mb-12">
            <span className="kicker">Comunhão</span>
            <h2>Próximos Encontros</h2>
            <p>Acompanhe nossas atividades e participe conosco em adoração.</p>
          </div>
          <TodayAtChurch mode="grid" />
        </div>
      </section>

      {/* Sobre Nós (Design Match Cards) */}
      <section id="sobre" className="section bg-[#FBFBFA]">
        <div className="container">
          <div className="sectionTitle">
            <h2>Sobre Nós</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="infoCard">
              <div className="circleIcon"><Compass size={32} /></div>
              <h3>Nossa Fé</h3>
              <p className="text-sm">Nossa doutrina fundamental baseia-se puramente nas Escrituras Sagradas.</p>
            </div>
            <div className="infoCard">
              <div className="circleIcon"><Flame size={32} /></div>
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
            <a href="#sobre" className="text-green font-bold text-lg inline-flex items-center gap-2 hover:gap-4 transition-all group">
              Conheça nossa história <ChevronRight size={20} className="text-orange" />
            </a>
          </div>
        </div>
      </section>

      <section id="visite" className="section bg-white">
        <div className="container">
          <div className="sectionTitle">
            <h2>Visite-nos</h2>
          </div>

          <div className="grid grid12 gap-12 items-start">
            {/* Esquerda: Sermon/Video */}
            <div className="lg:col-span-7 col-span-12">
              <div className="sermonCard group">
                <img src="/hero.jpg" alt="A Palavra de Deus" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="playOverlay">
                  <div className="text-center">
                    <div className="playButton mx-auto mb-6 shadow-xl shadow-green/20 group-hover:scale-110 transition-transform">
                      <Mic2 size={32} fill="currentColor" />
                    </div>
                    <h4 className="text-white text-3xl font-bold mb-6">A Palavra de Deus</h4>
                    <button className="btn btnPrimary !bg-white !text-[#27432F] hover:!bg-orange hover:!text-white border-none shadow-lg">
                      Assista ao Sermão ›
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Direita: Info Grid */}
            <div className="lg:col-span-4 col-span-12 flex flex-col gap-6">
              <div className="p-8 bg-[#F4F1EA] rounded-xl flex items-center gap-6 group hover:translate-x-2 transition-transform">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-orange tracking-widest mb-1">Rua Waldemar Falcão</h4>
                  <p className="text-base font-bold text-green">Brotas de Macaúbas • BA</p>
                </div>
              </div>

              <div className="p-8 bg-[#F4F1EA] rounded-xl flex items-center gap-6 group hover:translate-x-2 transition-transform">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange shadow-sm">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-orange tracking-widest mb-1">Horários dos Cultos</h4>
                  <p className="text-base font-bold text-green">Domingo • 09:00h & 19:00h</p>
                  <p className="text-base font-bold text-green">Quarta-feira • 19:30h</p>
                </div>
              </div>

              <div className="p-8 bg-[#F4F1EA] rounded-xl flex items-center gap-6 group hover:translate-x-2 transition-transform">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange shadow-sm">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-orange tracking-widest mb-1">Fale Conosco</h4>
                  <p className="text-base font-bold text-green">(77) 99999-9999</p>
                  <p className="text-base font-bold text-green">contato@ipbbrotas.com.br</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m13!1m3!1d3861.1502493325605!2d-42.6288!3d-12.0007!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDAwJzAyLjUiUyA0MsKwMzgnMDQuNiJX!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer (Design Match) */}
      <footer className="mainFooter">
        <div className="container">
          <div className="footerSocials">
            <a href="#" className="hover:bg-orange transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:bg-orange transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:bg-orange transition-colors"><Youtube size={20} /></a>
          </div>

          <div className="footerGrid">
            <div className="footerCol">
              <h4>Nosso Endereço</h4>
              <p className="flex items-center gap-2">
                <MapPin size={14} /> Rua Waldemar Falcão, s/n<br />
                Brotas de Macaúbas - BA
              </p>
            </div>
            <div className="footerCol">
              <h4>Horários dos Cultos</h4>
              <p>Domingo: 09:00h & 19:00h</p>
              <p>Quarta-Feira: 19:30h</p>
            </div>
            <div className="footerCol">
              <h4>Fale Conosco</h4>
              <p>(77) 99994-9999</p>
              <p>contato@ipbbrotas.org</p>
            </div>
            <div className="footerCol">
              <h4>Redes Sociais</h4>
              <p>Siga-nos no Instagram</p>
              <p>Assista no Youtube</p>
            </div>
          </div>

          <div className="footerBottom">
            <p>© 2024 Igreja Presbiteriana de Brotas de Macaúbas. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;


