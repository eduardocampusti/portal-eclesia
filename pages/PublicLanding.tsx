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
  Twitter
} from 'lucide-react';
import { churchService } from '../services/churchService';
import { Sermon, Event, SiteSettings } from '../types';
import { CHURCH_BANK_INFO } from '../constants';
import TodayAtChurch from '../components/TodayAtChurch';

const PublicLanding: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  // ... existing states ...
  const [events, setEvents] = useState<Event[]>([]);
  const DEFAULT_SETTINGS: SiteSettings = {
    id: 'default',
    hero_title: 'Igreja Presbiteriana de Brotas de Macaúbas',
    hero_subtitle: 'Pureza na Doutrina, Simplicidade no Culto, Santidade na Vida',
    hero_image_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1200',
    mission_title: 'Sobre Nós',
    mission_description: 'Nossa missão é glorificar a Deus através da proclamação do Evangelho.',
    about_title: 'Nossa História',
    about_description: 'Filiada à Igreja Presbiteriana do Brasil, mantendo os padrões de fé e prática das Escrituras Sagradas.',
    contact_email: 'contato@ipbbrotas.org',
    contact_phone: '(77) 99999-9999',
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
          setSettings({
            ...DEFAULT_SETTINGS,
            ...set,
            hero_title: set.hero_title || DEFAULT_SETTINGS.hero_title,
            hero_subtitle: set.hero_subtitle || DEFAULT_SETTINGS.hero_subtitle,
            hero_image_url: set.hero_image_url || DEFAULT_SETTINGS.hero_image_url,
            mission_title: set.mission_title || DEFAULT_SETTINGS.mission_title,
            about_title: set.about_title || DEFAULT_SETTINGS.about_title,
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

          // Inject JSON-LD Schema
          const schema = {
            "@context": "https://schema.org",
            "@type": "ReligiousOrganization",
            "name": "Igreja Presbiteriana em Brotas de Macaúbas",
            "url": "https://portaleclesia.com.br",
            "logo": "https://portaleclesia.com.br/logo.jpg",
            "description": set.hero_subtitle || DEFAULT_SETTINGS.hero_subtitle,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": set.contact_address || DEFAULT_SETTINGS.contact_address,
              "addressLocality": "Brotas de Macaúbas",
              "addressRegion": "BA",
              "addressCountry": "BR"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": set.contact_phone || DEFAULT_SETTINGS.contact_phone,
              "contactType": "customer service"
            }
          };

          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.text = JSON.stringify(schema);
          document.head.appendChild(script);
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
      <header>
        <div className="container h-full flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="Logo IPB Brotas" className="logo" />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm md:text-base text-[#27432F] leading-tight uppercase tracking-tight">Igreja Presbiteriana</span>
              <span className="text-[9px] md:text-[11px] font-bold text-[#D19E65] uppercase tracking-widest leading-none">de Brotas de Macaúbas</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className="nav-link">Sobre</a>
            <span className="nav-separator">·</span>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="nav-link">Programação</a>
            <span className="nav-separator">·</span>
            <a href="#localizacao" onClick={(e) => scrollToSection(e, 'localizacao')} className="nav-link">Localização</a>
          </div>

          <div className="hidden md:block">
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnOrange">
              Horários dos Cultos <ChevronRight size={14} />
            </a>
          </div>

          <button className="lg:hidden p-2 text-[#27432F]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[84px] bg-white z-[110] p-6 flex flex-col space-y-4 shadow-xl">
            <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className="text-xl font-bold">Sobre</a>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="text-xl font-bold">Programação</a>
            <a href="#localizacao" onClick={(e) => scrollToSection(e, 'localizacao')} className="text-xl font-bold">Localização</a>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnOrange w-full justify-center py-4">Horários dos Cultos</a>
          </div>
        )}
      </header>


      {/* Hero */}
      <section id="inicio" className="hero">
        <div className="container">
          <div className="heroContent">
            <h1>{settings.hero_title}</h1>

            <p className="hero-mission">
              Pureza na Doutrina, <span>Simplicidade no Culto, Santidade na Vida</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnPrimary">
                Ver horários
              </a>
              <a href="#localizacao" onClick={(e) => scrollToSection(e, 'localizacao')} className="btnSecondary">
                Como chegar <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="hero-image-side">
          <img src={settings.hero_image_url} alt="Fachada da Igreja" />
        </div>
      </section>


      {/* Próximos Encontros */}
      <TodayAtChurch banners={settings.banners} mode="grid" />

      {/* Sobre Nós */}
      <section id="sobre" className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2>Sobre Nós</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="badge-round green-circle">
                <Flame size={24} />
              </div>
              <h3 className="card-title">Nossa Fé</h3>
              <p className="text-sm leading-relaxed text-[#666]">
                Nossa piedade fundamenta-se puramente nas Escrituras Sagradas.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="badge-round orange-circle">
                <Cross size={24} />
              </div>
              <h3 className="card-title">Nossa Missão</h3>
              <p className="text-sm leading-relaxed text-[#666]">
                Proclamar Jesus Cristo, manter a comunhão e fazer discípulos.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="badge-round orange-circle">
                <User size={24} />
              </div>
              <h3 className="card-title">Como Participar</h3>
              <p className="text-sm leading-relaxed text-[#666]">
                Entre em contato para eventos, cultos e grupos de estudos.
              </p>
            </div>
          </div>

          <a href="#" className="center-link">Conheça nossa história {'>'}</a>
        </div>
      </section>

      {/* Visite-nos */}
      <section id="localizacao" className="section">
        <div className="container">
          <div className="section-title">
            <h2>Visite-nos</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Sermon Card */}
            <div className="sermon-big-card">
              <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800" alt="Palavra de Deus" />
              <div className="sermon-big-overlay">
                <h3 className="text-2xl font-black mb-4">A Palavra de Deus</h3>
                <a href="#" className="btnOrange w-fit">Assista ao Sermão {'>'}</a>
              </div>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="contact-item">
                <div className="flex items-center gap-2 text-[#D19E65] mb-1">
                  <MapPin size={14} />
                  <h4>Endereço</h4>
                </div>
                <p>{settings.contact_address}</p>
              </div>

              <div className="contact-item">
                <div className="flex items-center gap-2 text-[#D19E65] mb-1">
                  <Clock size={14} />
                  <h4>Horários</h4>
                </div>
                <p>Dom: 09h00 & 19h00</p>
                <p>Qua: 19h30</p>
              </div>

              <div className="contact-item">
                <div className="flex items-center gap-2 text-[#D19E65] mb-1">
                  <Phone size={14} />
                  <h4>Telefone</h4>
                </div>
                <p>{settings.contact_phone}</p>
              </div>

              <div className="contact-item">
                <div className="flex items-center gap-2 text-[#D19E65] mb-1">
                  <Mail size={14} />
                  <h4>E-mail</h4>
                </div>
                <p>{settings.contact_email}</p>
              </div>

              <div className="col-span-2 mt-2 h-40 rounded-lg overflow-hidden border border-border">
                <iframe
                  title="Mapa de Localização"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.9687799480135!2d-42.631!3d-12.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDAwJzAwLjAiUyA0MsKwMzgnMzYuMCJX!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contribua */}
      <section id="ofertas" className="section bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <div className="badge mx-auto">
                <Heart size={14} className="text-[#D19E65]" />
                <span>Generosidade</span>
              </div>
              <h2 className="!text-[#27432F]">{settings.finance_title}</h2>
              <p className="text-muted font-medium mx-auto">
                {settings.finance_description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* Pix Card */}
              <div className="card flex flex-col items-center text-center space-y-6">
                <div className="w-12 h-12 bg-[#27432F]/5 rounded-xl flex items-center justify-center text-[#27432F]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h.01" /><path d="M7 17h.01" /><path d="M17 7h.01" /><path d="M17 17h.01" /></svg>
                </div>
                <h4 className="text-xl font-bold text-[#27432F]">PIX (QR Code)</h4>

                <div className="bg-[#F7F6F3] p-4 rounded-2xl border border-dashed border-[#D19E65]/30">
                  <img
                    src={settings.finance_pix_qr_url || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(settings.finance_pix_key || '')}`}
                    alt="QR Code PIX"
                    className="w-40 h-40"
                  />
                </div>

                <div className="w-full space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted">Chave {settings.finance_pix_type}</p>
                  <div className="flex items-center justify-between bg-[#F7F6F3] p-4 rounded-xl border border-[#111827]/05">
                    <span className="font-mono text-sm truncate mr-4 text-[#111827]">{settings.finance_pix_key}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (settings.finance_pix_key) {
                        navigator.clipboard.writeText(settings.finance_pix_key)
                          .then(() => alert('Chave PIX copiada!'))
                          .catch(() => prompt('Copie a chave manualmente:', settings.finance_pix_key));
                      }
                    }}
                    className="btnPrimary w-full justify-center"
                  >
                    Copiar Chave
                  </button>
                  <p className="text-[10px] text-muted font-medium">{settings.finance_pix_holder}</p>
                </div>
              </div>

              {/* Bank Card */}
              <div className="card space-y-6">
                <div className="w-12 h-12 bg-[#27432F]/5 rounded-xl flex items-center justify-center text-[#27432F]">
                  <Info size={24} />
                </div>
                <h4 className="text-xl font-bold text-[#27432F]">Dados Bancários</h4>

                <div className="space-y-6">
                  {settings.finance_bank1_name && (
                    <div className="p-4 rounded-xl bg-[#F7F6F3] border border-[#111827]/05 space-y-2">
                      <p className="text-[10px] font-black text-[#D19E65] uppercase tracking-widest">{settings.finance_bank1_name}</p>
                      <div className="flex flex-col space-y-1 text-sm font-bold text-[#111827]">
                        <span>Agência: <span className="font-mono">{settings.finance_bank1_agency}</span></span>
                        <span>Conta: <span className="font-mono">{settings.finance_bank1_account}</span></span>
                      </div>
                    </div>
                  )}

                  {settings.finance_bank2_name && (
                    <div className="p-4 rounded-xl bg-[#F7F6F3] border border-[#111827]/05 space-y-2">
                      <p className="text-[10px] font-black text-[#D19E65] uppercase tracking-widest">{settings.finance_bank2_name}</p>
                      <div className="flex flex-col space-y-1 text-sm font-bold text-[#111827]">
                        <span>Agência: <span className="font-mono">{settings.finance_bank2_agency}</span></span>
                        <span>Conta: <span className="font-mono">{settings.finance_bank2_account}</span></span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-[#27432F]/5 rounded-xl border border-[#27432F]/10">
                  <p className="text-xs text-[#27432F] italic font-medium leading-relaxed">
                    "Cada um contribua conforme determinou em seu coração, não com pesar nem por obrigação, pois Deus ama quem dá com alegria." - 2 Co 9:7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sermões */}
      <section id="sermoes" className="section bg-[#F7F6F3]">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <div className="badge">
                <Mic2 size={14} />
                <span>Palavra de Deus</span>
              </div>
              <h2 className="!text-[#27432F]">Últimas Pregações</h2>
              <p className="text-muted font-medium">
                Assista ou ouça as exposições bíblicas realizadas em nossa congregação. Conteúdo disponível para site e aplicativo.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sermons.map(s => (
              <div key={s.id} className="card !p-0 overflow-hidden group">
                <div className="h-48 bg-slate-900 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                      <Youtube size={24} />
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-black text-[#D19E65] uppercase tracking-widest">
                    <span>{new Date(s.date).toLocaleDateString('pt-BR')}</span>
                    <span className="flex items-center gap-1"><User size={10} /> {s.pastor}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#27432F] leading-tight group-hover:text-[#D19E65] transition-colors">{s.title}</h3>
                  <p className="text-muted text-sm font-medium">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="!text-[#27432F]">Perguntas Frequentes</h2>
              <p className="text-muted font-medium">Tire suas dúvidas sobre nossa igreja.</p>
            </div>

            <div className="space-y-4">
              {[
                { q: "Quais são os horários dos cultos?", a: "Nossos cultos principais acontecem aos domingos pela manhã e à noite. Verifique a seção de agenda para horários específicos." },
                { q: "Como posso contribuir?", a: "Você pode contribuir através de dízimos e ofertas via PIX ou transferência bancária, utilizando os dados na seção 'Contribuições'." },
                { q: "Vocês possuem atividades para crianças?", a: "Sim! Temos a Escola Bíblica Dominical e momentos específicos para as crianças focados no ensino bíblico reformado." }
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-4">
                  <h4 className="text-lg font-bold text-[#27432F] mb-2">{item.q}</h4>
                  <p className="text-muted text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-socials">
            <a href="#" className="footer-social-icon"><Instagram size={20} /></a>
            <a href="#" className="footer-social-icon"><Twitter size={20} /></a>
            <a href="#" className="footer-social-icon"><Youtube size={20} /></a>
          </div>

          <div className="footer-grid">
            <div className="footer-col">
              <h4>Nosso Endereço</h4>
              <p>{settings.contact_address}</p>
            </div>
            <div className="footer-col">
              <h4>Horários dos Cultos</h4>
              <p>Domingo - 09h00 & 19h00<br />Quarta-feira - 19h30</p>
            </div>
            <div className="footer-col">
              <h4>Fale Conosco</h4>
              <p>{settings.contact_phone}<br />{settings.contact_email}</p>
            </div>
            <div className="footer-col">
              <h4>Administração</h4>
              <Link to="/login" className="text-white h-8 w-fit bg-white/10 px-4 flex items-center rounded text-xs hover:bg-white/20">
                Painel Administrativo
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;