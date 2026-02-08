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
  Sprout,
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
              <span className="font-extrabold text-lg text-[#27432F] leading-[1.1] uppercase tracking-[0.05em]">Igreja Presbiteriana</span>
              <span className="text-[10px] font-extrabold text-[#D19E65] uppercase tracking-[0.3em] leading-none mt-1">de Brotas de Macaúbas</span>
            </div>
          </Link>

          <nav className="navMenu hidden lg:flex items-center gap-6">
            <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')}>Sobre</a>
            <div className="navSeparator" />
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')}>Programação</a>
            <div className="navSeparator" />
            <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')}>Localização</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnAccent hidden md:inline-flex !py-3 !px-6 !text-[12px] !font-bold">
              Horários dos Cultos <ChevronRight size={14} className="ml-1" />
            </a>
            <button className="lg:hidden p-2 text-[#27432F]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section (Design Match) */}
      <section className="hero">
        <div className="container">
          <div className="heroContent animate-in fade-in slide-in-from-left duration-1000">
            <h1 className="mb-8 tracking-tight !leading-[1.05]">Igreja Presbiteriana de Brotas de Macaúbas</h1>
            <p className="heroSub text-xl !font-medium !italic tracking-wide !text-[#27432F]">
              Pureza na Doutrina, <span className="text-orange">Simplicidade no Culto</span>, Santidade na Vida.
            </p>
            <div className="flex flex-wrap gap-4 mt-12">
              <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btn btnPrimary !px-10">
                Ver horários
              </a>
              <a href="#visite" onClick={(e) => scrollToSection(e, 'visite')} className="btn btnSecondary !px-10 !bg-[#FBFBFA]">
                Como chegar <ChevronRight size={18} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda - Próximos Encontros */}
      <section id="agenda" className="section bg-white">
        <div className="container">
          <div className="mb-16 text-center">
            <span className="kicker !mb-4">Comunhão</span>
            <h2 className="!text-5xl mb-4">Próximos Encontros</h2>
            <p className="max-w-2xl mx-auto text-lg">Acompanhe nossas atividades e participe conosco em adoração.</p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="infoCard group !bg-[#F4F1EA]">
              <div className="circleIcon !bg-orange"><Sprout size={36} strokeWidth={1.5} /></div>
              <h3 className="mb-4 !text-2xl">Nossa Fé</h3>
              <p className="text-sm leading-relaxed">Nossa piedade fundamenta-se puramente nas Escrituras Sagradas.</p>
            </div>
            <div className="infoCard group !bg-[#F4F1EA]">
              <div className="circleIcon !bg-orange"><Cross size={36} strokeWidth={1.5} /></div>
              <h3 className="mb-4 !text-2xl">Nossa Missão</h3>
              <p className="text-sm leading-relaxed">Proclamar Jesus Cristo, manter a comunhão e fazer discípulos.</p>
            </div>
            <div className="infoCard group !bg-[#F4F1EA]">
              <div className="circleIcon !bg-orange"><User size={36} strokeWidth={1.5} /></div>
              <h3 className="mb-4 !text-2xl">Como Participar</h3>
              <p className="text-sm leading-relaxed">Entre em contato para eventos, cultos e grupos de estudos.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="#sobre" className="text-green font-bold text-base inline-flex items-center gap-2 hover:gap-4 transition-all group">
              Conheça nossa história <ChevronRight size={18} className="text-orange" />
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
              <div className="sermonCard group !rounded-3xl border border-white/10">
                <img src="/hero.jpg" alt="A Palavra de Deus" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="playOverlay !bg-green/40 backdrop-blur-[2px] group-hover:backdrop-blur-sm transition-all duration-500">
                  <div className="text-center p-8">
                    <div className="playButton mx-auto mb-8 shadow-2xl shadow-green/40 group-hover:scale-110 !w-20 !h-20">
                      <Mic2 size={36} fill="currentColor" />
                    </div>
                    <h4 className="text-white text-4xl font-bold mb-8 tracking-tight">Assista aos nossos Cultos</h4>
                    <button className="btn !bg-white !text-green hover:!bg-orange hover:!text-white border-none shadow-xl transition-all duration-500 font-bold uppercase tracking-widest text-[10px] px-8 py-4">
                      Ver no Youtube ›
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Direita: Info Grid */}
            <div className="lg:col-span-5 col-span-12 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                <div className="p-8 bg-[#F4F1EA] rounded-xl flex items-center gap-6 group hover:translate-x-2 transition-transform">
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-orange shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-black text-orange tracking-widest mb-1 leading-none">Rua Waldemar Falcão</h4>
                    <p className="text-sm font-bold text-green">Brotas de Macaúbas • BA</p>
                  </div>
                </div>

                <div className="p-8 bg-[#F4F1EA] rounded-xl flex items-center gap-6 group hover:translate-x-2 transition-transform">
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-orange shadow-sm">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-black text-orange tracking-widest mb-1 leading-none">Horários dos Cultos</h4>
                    <p className="text-sm font-bold text-green">Domingo • 09:00h & 19:00h</p>
                    <p className="text-sm font-bold text-green">Quarta-feira • 19:30h</p>
                  </div>
                </div>

                <div className="p-8 bg-[#F4F1EA] rounded-xl flex items-center gap-6 group hover:translate-x-2 transition-transform">
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-orange shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-black text-orange tracking-widest mb-1 leading-none">Telefone</h4>
                    <p className="text-sm font-bold text-green">(77) 99999-9999</p>
                  </div>
                </div>

                <div className="p-8 bg-[#F4F1EA] rounded-xl flex items-center gap-6 group hover:translate-x-2 transition-transform">
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-orange shadow-sm">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-black text-orange tracking-widest mb-1 leading-none">E-mail</h4>
                    <p className="text-sm font-bold text-green">contatobrotas@ipb.org.br</p>
                  </div>
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
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-orange mt-1 shrink-0" />
                <span>Rua Waldemar Falcão, s/n<br />Brotas de Macaúbas - BA</span>
              </p>
            </div>
            <div className="footerCol">
              <h4>Horários dos Cultos</h4>
              <p>Domingo: 09:00h & 19:00h</p>
              <p>Quarta-Feira: 19:30h</p>
            </div>
            <div className="footerCol">
              <h4>Fale Conosco</h4>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-orange" /> (77) 99999-9999
              </p>
            </div>
            <div className="footerCol">
              <h4>Fale Conosco</h4>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-orange" /> (77) 99999-9999
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-orange" /> contato@ipbrotas.com.br
              </p>
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


