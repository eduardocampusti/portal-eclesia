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
  Info
} from 'lucide-react';
import { churchService } from '../services/churchService';
import { Sermon, Event } from '../types';

const PublicLanding: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [s, e] = await Promise.all([
        churchService.getSermons(),
        churchService.getEvents()
      ]);
      setSermons(s.slice(0, 3));
      setEvents(e.slice(0, 3));
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
            <a href="#inicio" className="text-sm text-gray-600 hover:text-blue-800 font-bold transition-colors">Início</a>
            <a href="#sermoes" className="text-sm text-gray-600 hover:text-blue-800 font-bold transition-colors">Sermões</a>
            <a href="#agenda" className="text-sm text-gray-600 hover:text-blue-800 font-bold transition-colors">Agenda</a>
            <a href="#ofertas" className="text-sm text-gray-600 hover:text-blue-800 font-bold transition-colors">Contribuições</a>
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
              <span>Cremos na Soberania de Deus</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-none">
              Uma Igreja <span className="text-blue-700">Reformada</span>, Confessante e Bíblica.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              Nossa missão é glorificar a Deus através da proclamação do Evangelho de Jesus Cristo e da edificação mútua do corpo.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#agenda" className="bg-blue-800 text-white px-10 py-5 rounded-2xl font-black flex items-center space-x-3 hover:bg-blue-900 transition-all shadow-2xl shadow-blue-900/30">
                <span>Nossos Cultos</span>
                <ChevronRight size={20} />
              </a>
              <a href="#ofertas" className="bg-white text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-2xl font-black flex items-center space-x-3 hover:border-blue-200 transition-all">
                <Heart size={20} className="text-rose-500" />
                <span>Ofertar</span>
              </a>
            </div>
          </div>
          <div className="relative animate-in zoom-in duration-1000">
            <div className="absolute -inset-4 bg-blue-800 rounded-[48px] rotate-3 opacity-10"></div>
            <img
              src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1200"
              alt="Igreja"
              className="relative rounded-[40px] shadow-2xl object-cover h-[600px] w-full"
            />
          </div>
        </div>
      </section>

      {/* Sermons */}
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

      {/* Offering */}
      <section id="ofertas" className="py-32 bg-blue-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black">Contribua com a <span className="text-blue-300">Obra do Senhor</span></h2>
            <p className="text-blue-100 text-lg leading-relaxed font-medium">
              Seus dízimos e ofertas sustentam o ministério pastoral, a manutenção do templo e nossas frentes missionárias locais e globais.
            </p>
            <div className="bg-white/10 p-8 rounded-[32px] border border-white/10 space-y-4">
              <h4 className="font-bold text-xl">Chave PIX (CNPJ)</h4>
              <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl">
                <span className="font-mono text-xl">00.123.456/0001-01</span>
                <button className="bg-white text-blue-900 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50">Copiar</button>
              </div>
              <p className="text-xs text-blue-200 uppercase font-bold tracking-widest">Igreja Presbiteriana do Brasil - Central</p>
            </div>
          </div>
          <div className="bg-white rounded-[48px] p-12 text-slate-900 shadow-2xl">
            <h3 className="text-3xl font-black mb-8">Dados Bancários</h3>
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Banco do Brasil</p>
                <div className="flex justify-between font-bold text-lg">
                  <span>Agência: 1234-5</span>
                  <span>C/C: 1010-1</span>
                </div>
              </div>
              <div className="border-b border-slate-100 pb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bradesco</p>
                <div className="flex justify-between font-bold text-lg">
                  <span>Agência: 9876-0</span>
                  <span>C/C: 2233-X</span>
                </div>
              </div>
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
              Filiada à Igreja Presbiteriana do Brasil, mantendo os padrões de fé da Confissão de Westminster e Catecismos.
            </p>
          </div>
          <div className="space-y-6">
            <h5 className="text-white font-black uppercase tracking-widest text-xs">Endereço & Contato</h5>
            <p className="text-sm leading-loose">
              Av. Consolação, 450<br />
              São Paulo - SP, 01301-100<br />
              (11) 3212-4455<br />
              contato@ipbcentral.org.br
            </p>
          </div>
          <div className="space-y-6">
            <h5 className="text-white font-black uppercase tracking-widest text-xs">Administração</h5>
            <Link to="/login" className="text-sm font-bold text-blue-500 hover:text-blue-400 underline decoration-blue-500/30 underline-offset-8">Acesso Restrito ao Conselho</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-24 pt-8 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-center">
          © 2024 Portal Eclésia - Todos os direitos reservados. Prontos para o Mobile.
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;