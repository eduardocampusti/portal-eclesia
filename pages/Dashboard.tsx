import React from 'react';
import { useAuth } from '../App';
import { RoleType } from '../types';
import {
  Users,
  Mic2,
  Calendar,
  TrendingUp,
  Clock,
  HeartHandshake,
  Megaphone,
  Plus,
  ShieldCheck,
  TrendingDown,
  DollarSign,
  PieChart,
  ChevronRight,
  Globe,
  Layout
} from 'lucide-react';
import Cross from '../components/Cross';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Renderiza widgets específicos baseados no perfil (RBAC)
  const renderStats = () => {
    switch (user.roleId) {
      case RoleType.CONTADORA:
        return [
          { label: 'Entradas (Mês)', value: 'R$ 15.200', icon: <DollarSign size={24} />, color: 'bg-green', growth: '+8%' },
          { label: 'Saídas (Mês)', value: 'R$ 8.450', icon: <TrendingDown size={24} />, color: 'bg-rose-500', growth: '+2%' },
          { label: 'Saldo Caixa', value: 'R$ 45.100', icon: <PieChart size={24} />, color: 'bg-orange', growth: '+15%' },
        ];
      case RoleType.MISSIONARIA:
        return [
          { label: 'Projetos Ativos', value: '4', icon: <HeartHandshake size={24} />, color: 'bg-rose-500', growth: 'Estável' },
          { label: 'Campos Atendidos', value: '12', icon: <Calendar size={24} />, color: 'bg-green', growth: '+1' },
          { label: 'Ações Pendentes', value: '3', icon: <Clock size={24} />, color: 'bg-orange', growth: '-1' },
        ];
      case RoleType.SECRETARIA:
        return [
          { label: 'Membros Ativos', value: '158', icon: <Users size={24} />, color: 'bg-green', growth: '+3' },
          { label: 'Visitantes Recentes', value: '12', icon: <Plus size={24} />, color: 'bg-orange', growth: '+5' },
          { label: 'Avisos de Hoje', value: '2', icon: <Megaphone size={24} />, color: 'bg-amber-500', growth: '0' },
        ];
      case RoleType.PRESBITERO:
        return [
          { label: 'Sermões Recentes', value: '52', icon: <Mic2 size={24} />, color: 'bg-green', growth: '+4' },
          { label: 'Membros Ativos', value: '158', icon: <Users size={24} />, color: 'bg-orange', growth: '+2' },
          { label: 'Avisos Internos', value: '5', icon: <Megaphone size={24} />, color: 'bg-slate-700', growth: '0' },
        ];
      case RoleType.DIACONO:
        return [
          { label: 'Membros Atendidos', value: '45', icon: <Users size={24} />, color: 'bg-green', growth: '+5' },
          { label: 'Ações Sociais', value: '4', icon: <HeartHandshake size={24} />, color: 'bg-rose-500', growth: 'Ativo' },
          { label: 'Agenda Diaconal', value: '3', icon: <Calendar size={24} />, color: 'bg-orange', growth: '+1' },
        ];
      case RoleType.EDITOR_SITE:
        return [
          { label: 'Páginas Editáveis', value: '4', icon: <Layout size={24} />, color: 'bg-green', growth: 'Geral' },
          { label: 'Última Edição', value: 'Hoje', icon: <Clock size={24} />, color: 'bg-slate-900', growth: 'OK' },
          { label: 'Status do Site', value: 'Online', icon: <Globe size={24} />, color: 'bg-green-dark', growth: '100%' },
        ];
      default: // Admin / Pastor
        return [
          { label: 'Total Membros', value: '158', icon: <Users size={24} />, color: 'bg-green', growth: '+12%' },
          { label: 'Saldo de Caixa', value: 'R$ 45k', icon: <TrendingUp size={24} />, color: 'bg-orange', growth: '+5%' },
          { label: 'Segurança Portal', value: 'Ativa', icon: <ShieldCheck size={24} />, color: 'bg-green-dark', growth: '100%' },
        ];
    }
  };

  const stats = renderStats();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-orange uppercase tracking-[0.3em] mb-3 opacity-80">Backoffice Eclésia</p>
          <h2 className="text-4xl md:text-5xl font-serif text-green tracking-tight">
            Graça e Paz, <span className="text-orange italic">{(user?.name || 'Usuário').split(' ')[0]}</span>.
          </h2>
          <p className="text-slate-500 font-medium text-lg">Bem-vindo ao centro de operações da sua igreja.</p>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acesso Autorizado</span>
          <span className="bg-green text-white px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider mt-2 shadow-lg shadow-green/10 border border-white/10">
            {user.roleId}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-2xl hover:shadow-green/5 hover:border-green/10 transition-all duration-500 cursor-default overflow-hidden relative">
            <div className="absolute top-0 right-0 -tr-10 op-5 group-hover:op-10 transition-opacity">
              {React.cloneElement(stat.icon as React.ReactElement, { size: 120 })}
            </div>

            <div className="flex items-start justify-between relative z-10">
              <div className={`${stat.color} p-5 rounded-2xl text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-green bg-orange-light px-3 py-1.5 rounded-full flex items-center gap-1 border border-orange/10">
                {stat.growth}
              </span>
            </div>
            <div className="mt-10 relative z-10">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</h3>
              <p className="text-4xl font-serif text-green mt-2">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Widget de Agenda Condicional */}
        <div className="lg:col-span-3 bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-shadow duration-500">
          <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-serif text-green text-2xl">Atividades Próximas</h3>
            <Link to="/admin/events" className="text-[10px] font-black text-orange hover:text-green uppercase tracking-widest transition-colors flex items-center gap-2">
              Ver Agenda Completa <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {[1, 2, 3].map(i => (
              <div key={i} className="px-10 py-7 flex items-center space-x-6 hover:bg-orange-light/30 transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-green border border-slate-100 shadow-sm group-hover:border-orange/20 transition-colors">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-orange">JUN</span>
                  <span className="text-2xl font-serif leading-none mt-1">{10 + i}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-green text-xl">{i === 1 ? 'Reunião de Conselho' : i === 2 ? 'Círculo de Oração' : 'União de Adolescentes'}</p>
                  <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                    <Clock size={14} className="text-orange" /> 19:30 • {i === 1 ? 'Sala de Reuniões' : 'Templo Central'}
                  </p>
                </div>
                <div className="hidden sm:block opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                  <ChevronRight size={20} className="text-orange" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner de Status Mobile-Ready */}
        <div className="lg:col-span-2 bg-green-dark rounded-4xl p-12 text-white shadow-2xl relative overflow-hidden group border border-white/5">
          <div className="absolute right-0 bottom-0 opacity-10 -mr-20 -mb-20 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700">
            <Cross size={400} />
          </div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="bg-orange/20 border border-orange/30 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-orange mb-8">
              Portal Mobile Status
            </div>
            <h3 className="text-3xl font-serif leading-tight mb-6">Infraestrutura <br /> <span className="text-orange italic">API-Ready</span>.</h3>
            <p className="text-slate-300 font-medium text-lg leading-relaxed flex-1">
              Seu backoffice já está sincronizado e pronto para alimentar o aplicativo mobile da IPB Brotas.
            </p>
            <div className="pt-10">
              <button className="w-full bg-orange text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-green transition-all duration-300 shadow-xl shadow-orange/10 active:scale-95">
                Ver Documentação API
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;