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
      {/* Navbar Normalizada */}
      <header>
        <div className="headerInner">
          <div className="brand">
            <img src="/logo.jpg" alt="Logo IPB Brotas" />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-[#27432F] leading-tight uppercase tracking-tight">Igreja Presbiteriana</span>
              <span className="text-[9px] font-bold text-[#D19E65] uppercase tracking-widest leading-none">de Brotas de Macaúbas</span>
            </div>
          </div>

          <nav className="navLinks">
            <a href="#sobre" onClick={(e) => scrollToSection(e, 'sobre')} className="font-semibold text-sm hover:text-[#D19E65]">Sobre</a>
            <span className="text-[#D19E65] opacity-30 text-xs">|</span>
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="font-semibold text-sm hover:text-[#D19E65]">Programação</a>
            <span className="text-[#D19E65] opacity-30 text-xs">|</span>
            <a href="#localizacao" onClick={(e) => scrollToSection(e, 'localizacao')} className="font-semibold text-sm hover:text-[#D19E65]">Localização</a>
          </nav>

          <div className="headerCTA">
            <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnOrange hidden md:inline-flex">
              Horários dos Cultos
            </a>
            <button className="lg:hidden p-2 text-[#27432F] menuBtn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[64px] bg-white z-[110] p-6 flex flex-col space-y-4 shadow-xl">
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
          <div className="heroCard">
            <div className="heroText">
              <div className="badge animate-fade-in">
                <Flame size={14} className="text-[#D29E65]" />
                <span>Igreja Presbiteriana do Brasil</span>
              </div>
              <h1>{settings.hero_title}</h1>

              <p className="mt-8 mb-10 text-lg sans text-slate-600 max-w-lg leading-relaxed">
                Um lugar de esperança, verdade e serviço. <span className="text-[#D29E65] font-bold">Simplicidade no Culto, Santidade na Vida.</span>
              </p>

              <div className="heroActions flex flex-col sm:flex-row gap-4">
                <a href="#agenda" onClick={(e) => scrollToSection(e, 'agenda')} className="btnPrimary">
                  Conhecer Programação
                </a>
                <a href="#localizacao" onClick={(e) => scrollToSection(e, 'localizacao')} className="btnSecondary">
                  Onde Estamos <ChevronRight size={16} />
                </a>
              </div>
            </div>

            <div className="heroMedia">
              <img src={settings.hero_image_url} alt="Fachada da Igreja" />
            </div>
          </div>
        </div>
      </section>


      {/* Próximos Encontros */}
      {/* Próximos Encontros Normalizado */}
      <section id="agenda" className="section">
        <div className="container">
          <div className="sectionTitle">
            <h2>Próximos Encontros</h2>
          </div>
          <p className="sectionSub">
            Participe de nossas atividades e comunhão. Todos são bem-vindos!
          </p>
          <TodayAtChurch banners={settings.banners} mode="grid" />
        </div>
      </section>

      {/* Sobre Nós */}
      {/* Sobre Nós Normalizado */}
      {/* Sobre Nós */}
      <section id="sobre" className="section bg-white">
        <div className="container">
          <div className="sectionTitle">
            <span className="overline">Identidade</span>
            <h2>Nossas Raízes</h2>
          </div>

          <div className="grid3">
            <div className="card aboutCard">
              <div className="iconBubble">
                <Flame size={24} />
              </div>
              <h3 className="serif text-xl font-bold mb-3">Escritura Sagrada</h3>
              <p className="sans text-sm leading-relaxed text-slate-500">
                Nossa fé e prática baseiam-se unicamente na Palavra de Deus, mantendo a tradição das Reformas.
              </p>
            </div>

            <div className="card aboutCard">
              <div className="iconBubble">
                <Cross size={24} />
              </div>
              <h3 className="serif text-xl font-bold mb-3">Proclamação</h3>
              <p className="sans text-sm leading-relaxed text-slate-500">
                Existimos para glorificar a Deus e fazer Jesus Cristo conhecido em todas as esferas da vida.
              </p>
            </div>

            <div className="card aboutCard">
              <div className="iconBubble">
                <User size={24} />
              </div>
              <h3 className="serif text-xl font-bold mb-3">Comunhão Familiar</h3>
              <p className="sans text-sm leading-relaxed text-slate-500">
                Somos uma família voltada para o cuidado mútuo, o amor fraternal e o serviço comunitário.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <a href="#" className="btnSecondary gap-2">
              Leia mais sobre nossa história <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Visite-nos */}
      {/* Visite-nos */}
      <section id="localizacao" className="section">
        <div className="container">
          <div className="sectionTitle">
            <span className="overline">Programe sua visita</span>
            <h2>Onde nos encontrar</h2>
          </div>

          <div className="visitGrid">
            {/* Contact Info */}
            <div className="flex flex-col gap-6">
              <div className="card !p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#D29E65] flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Localização Principal</h4>
                    <p className="text-slate-500 sans">{settings.contact_address}</p>
                  </div>
                </div>
              </div>

              <div className="card !p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#D29E65] flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Cultos Centrais</h4>
                    <div className="text-slate-500 sans space-y-2">
                      <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                        <span>Domingo Manhã (EBD)</span>
                        <span className="font-bold text-slate-800">09h00</span>
                      </div>
                      <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                        <span>Domingo Noite (Culto)</span>
                        <span className="font-bold text-slate-800">19h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quarta-feira (Oração)</span>
                        <span className="font-bold text-slate-800">19h30</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card !p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#D29E65] flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Secretaria</h4>
                    <p className="text-slate-500 sans">{settings.contact_phone}</p>
                    <p className="text-[#D29E65] font-medium text-sm mt-1">{settings.contact_email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Premium Preview */}
            <div className="mapCard">
              <div className="mapPreview">
                {/* Visual PIN */}
                <div className="mapPin animate-bounce"></div>

                {/* Overlay explicativo caso a imagem falhe */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur rounded-xl shadow-xl flex items-center justify-between border border-white">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-700">Pronto para navegação</span>
                  </div>
                </div>
              </div>
              <div className="mapFooter">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.contact_address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btnPrimary !rounded-xl !py-3 !px-6 !text-xs !shadow-none"
                >
                  Ver no Google Maps <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contribua */}
      {/* Contribua */}
      <section id="ofertas" className="section bg-white">
        <div className="container">
          <div className="sectionTitle">
            <span className="overline">Generosidade</span>
            <h2 className="!text-[#27432F]">Ofertas e Contribuições</h2>
          </div>

          <div className="donationWrap">
            {/* Texto de Instrução */}
            <div className="space-y-6">
              <h3 className="serif text-2xl font-bold">Apoie a obra do Senhor em Brotas</h3>
              <p className="text-slate-600 sans leading-relaxed pb-4">
                Seus dízimos e ofertas voluntárias sustentam o ministério pastoral, a manutenção do nosso templo e nossas ações sociais na comunidade.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-700">
                    <Info size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-800">CNPJ: 14.123.456/0001-90</span>
                </div>
                {settings.finance_bank1_name && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-[#D29E65] uppercase tracking-widest mb-2">{settings.finance_bank1_name}</p>
                    <p className="text-sm font-bold">Agência: {settings.finance_bank1_agency} | Conta: {settings.finance_bank1_account}</p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-[#1F4D35]/03 rounded-2xl border-l-4 border-[#D29E65]">
                <p className="text-xs italic text-slate-600">
                  "Cada um contribua conforme determinou em seu coração, não com pesar nem por obrigação..." - 2 Coríntios 9:7
                </p>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="qrContainer">
              <div className="card qrCard !p-8 flex flex-col items-center">
                <img
                  src={settings.finance_pix_qr_url || `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(settings.finance_pix_key || '')}`}
                  className="qrImg mb-6"
                  alt="QR Code PIX"
                />
                <div className="w-full space-y-3">
                  <span className="text-[10px] font-black uppercase text-center block text-slate-400">Chave PIX ({settings.finance_pix_type})</span>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                    <span className="font-mono text-xs font-bold truncate block">{settings.finance_pix_key}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (settings.finance_pix_key) {
                        navigator.clipboard.writeText(settings.finance_pix_key)
                          .then(() => alert('Chave PIX copiada!'))
                          .catch(() => prompt('Copie a chave manualmente:', settings.finance_pix_key));
                      }
                    }}
                    className="btnCopy w-full justify-center !py-4"
                  >
                    Copiar Chave Completa
                  </button>
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

          <div className="cardsGrid">
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
            <div className="sectionTitle space-y-4 mb-16">
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