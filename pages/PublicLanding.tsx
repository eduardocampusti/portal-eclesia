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
  Flame
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
    hero_subtitle: 'Uma Igreja Reformada, Confessante e Bíblica.',
    hero_image_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1200',
    mission_title: 'CREMOS NA SOBERANIA DE DEUS',
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
              <span className="font-black text-sm md:text-lg text-[#27432F] leading-tight uppercase tracking-tighter">IPB Brotas</span>
              <span className="text-[8px] md:text-[10px] font-bold text-[#D19E65] uppercase tracking-widest leading-none">Igreja Presbiteriana</span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className="text-sm text-[#111827] hover:text-[#27432F] font-bold transition-colors">Sobre</a>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="text-sm text-[#111827] hover:text-[#27432F] font-bold transition-colors">Programação</a>
            <a href="#localizacao" onClick={(e) => scrollToSection(e, 'localizacao')} className="text-sm text-[#111827] hover:text-[#27432F] font-bold transition-colors">Localização</a>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnPrimary !py-2 !px-5 !text-xs">
              Horários dos Cultos
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-[#27432F]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[64px] bg-white z-40 animate-in fade-in slide-in-from-top duration-300">
            <div className="flex flex-col p-6 space-y-6">
              <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className="text-xl font-bold text-[#111827]">Sobre</a>
              <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="text-xl font-bold text-[#111827]">Programação</a>
              <a href="#localizacao" onClick={(e) => scrollToSection(e, 'localizacao')} className="text-xl font-bold text-[#111827]">Localização</a>
              <a href="#ofertas" onClick={(e) => scrollToSection(e, 'ofertas')} className="text-xl font-bold text-[#111827]">Contribuições</a>
              <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnPrimary w-full justify-center py-4">
                Horários dos Cultos
              </a>
            </div>
          </div>
        )}
      </header>


      {/* Hero */}
      <section id="inicio" className="hero">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.hero_image_url}
            alt="Fachada da Igreja Presbiteriana de Brotas de Macaúbas"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#27432F]/95 via-[#27432F]/80 to-transparent md:bg-gradient-to-r"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="container heroContent relative z-10 py-20">
          <div className="max-w-3xl space-y-8 animate-in slide-in-from-left duration-700">
            <div className="badge !bg-[#D19E65]/20 !text-[#D19E65] !border !border-[#D19E65]/30">
              <Info size={14} />
              <span>{settings.mission_title}</span>
            </div>

            <h1 className="text-white !font-black !leading-[1.1]">
              {settings.hero_title}
            </h1>

            <div className="space-y-4">
              <p className="text-[#D19E65] font-black uppercase tracking-[0.2em] text-sm italic">
                “Pureza na Doutrina, Simplicidade no Culto e Santidade na Vida”
              </p>
              <p className="text-gray-100 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                {settings.hero_subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnPrimary !py-4 !px-10 justify-center">
                <span>Ver horários</span>
                <ChevronRight size={20} />
              </a>
              <a href="#localizacao" onClick={(e) => scrollToSection(e, 'localizacao')} className="btnSecondary !bg-white/10 !text-white !border-white/20 !backdrop-blur-md !py-4 !px-10 justify-center hover:!bg-white/20">
                <MapPin size={20} />
                <span>Como chegar</span>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Próximos Encontros */}
      <TodayAtChurch banners={settings.banners} mode="grid" />

      {/* Sobre Nós */}
      <section id="sobre" className="section bg-[#F7F6F3]">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <div className="badge mx-auto">
              <span>Nossa Essência</span>
            </div>
            <h2 className="!text-[#27432F]">{settings.about_title}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#D19E65]/10 flex items-center justify-center text-[#27432F]">
                <Cross size={32} />
              </div>
              <h4 className="text-xl font-bold text-[#27432F]">Nossa Fé</h4>
              <p className="text-muted text-sm font-medium">
                Cremos nas Escrituras como única regra de fé e prática, seguindo a tradição reformada.
              </p>
            </div>

            <div className="card text-center flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#D19E65]/10 flex items-center justify-center text-[#27432F]">
                <Heart size={32} />
              </div>
              <h4 className="text-xl font-bold text-[#27432F]">Nossa Missão</h4>
              <p className="text-muted text-sm font-medium">
                {settings.mission_description}
              </p>
            </div>

            <div className="card text-center flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#D19E65]/10 flex items-center justify-center text-[#27432F]">
                <User size={32} />
              </div>
              <h4 className="text-xl font-bold text-[#27432F]">Como Participar</h4>
              <p className="text-muted text-sm font-medium">
                Venha nos visitar em nossos cultos e atividades. Todos são bem-vindos para adorar a Deus conosco.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a href="#historia" className="text-[#27432F] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 group hover:text-[#D19E65]">
              Conheça nossa história <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Visite-nos */}
      <section id="localizacao" className="section bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="badge">
                <MapPin size={14} />
                <span>Venha nos visitar</span>
              </div>
              <h2 className="!text-[#27432F]">Como Chegar</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="card !p-6">
                  <h5 className="font-bold text-[#27432F] mb-1">Endereço</h5>
                  <p className="text-sm text-muted">{settings.contact_address}</p>
                </div>
                <div className="card !p-6">
                  <h5 className="font-bold text-[#27432F] mb-1">Horários</h5>
                  <p className="text-sm text-muted">Dom: 09h e 19h<br />Qua: 19h30</p>
                </div>
                <div className="card !p-6 sm:col-span-2">
                  <h5 className="font-bold text-[#27432F] mb-1">Contato</h5>
                  <p className="text-sm text-muted">{settings.contact_phone}<br />{settings.contact_email}</p>
                </div>
              </div>

              <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.contact_address)}`} target="_blank" rel="noopener noreferrer" className="btnPrimary">
                Abrir no Google Maps
                <ExternalLink size={18} />
              </a>
            </div>

            <div className="card !p-0 overflow-hidden !radius-14 shadow-premium h-[280px] md:h-[360px]">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(settings.contact_address)}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              {/* Note: I'll use a standard embed string if I don't have a key, but for structure this is correct */}
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center -z-10">
                <p className="text-muted text-sm font-medium">Carregando mapa...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda Viva */}
      <TodayAtChurch banners={settings.banners} mode="live" />

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
      <footer className="bg-[#27432F] pt-20 pb-10 text-white/80">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-white">
                <img src="/logo.jpg" alt="Logo da Igreja Presbiteriana de Brotas de Macaúbas" className="h-12 w-auto object-contain brightness-0 invert opacity-90" loading="lazy" />
                <div className="flex flex-col">
                  <span className="font-black text-xl uppercase tracking-tighter">IPB Brotas</span>
                  <span className="text-[10px] font-bold text-[#D19E65] uppercase tracking-widest">Portal Eclésia</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                {settings.about_description.substring(0, 150)}...
              </p>
            </div>

            <div className="space-y-6">
              <h5 className="text-white font-bold uppercase tracking-widest text-xs">Acesso Rápido</h5>
              <div className="flex flex-col space-y-3 text-sm">
                <a href="#sobre" className="hover:text-[#D19E65] transition-colors">Sobre Nós</a>
                <a href="#agenda" className="hover:text-[#D19E65] transition-colors">Programação</a>
                <a href="#localizacao" className="hover:text-[#D19E65] transition-colors">Localização</a>
                <a href="#ofertas" className="hover:text-[#D19E65] transition-colors">Contribuições</a>
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="text-white font-bold uppercase tracking-widest text-xs">Administração</h5>
              <Link to="/login" className="btnSecondary !bg-white/5 !text-white !border-white/10 !py-2 !px-4 !text-xs hover:!bg-white/10">
                Painel Administrativo
              </Link>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              © {new Date().getFullYear()} Igreja Presbiteriana de Brotas de Macaúbas. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;