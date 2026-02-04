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
  Cross,
  Globe,
  Layout
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Renderiza widgets específicos baseados no perfil (RBAC)
  const renderStats = () => {
    switch (user.roleId) {
      case RoleType.CONTADORA:
        return [
          { label: 'Entradas (Mês)', value: 'R$ 15.200', icon: <DollarSign size={24} />, color: 'bg-emerald-500', growth: '+8%' },
          { label: 'Saídas (Mês)', value: 'R$ 8.450', icon: <TrendingDown size={24} />, color: 'bg-rose-500', growth: '+2%' },
          { label: 'Saldo Caixa', value: 'R$ 45.100', icon: <PieChart size={24} />, color: 'bg-blue-600', growth: '+15%' },
        ];
      case RoleType.MISSIONARIA:
        return [
          { label: 'Projetos Ativos', value: '4', icon: <HeartHandshake size={24} />, color: 'bg-rose-500', growth: 'Estável' },
          { label: 'Campos Atendidos', value: '12', icon: <Calendar size={24} />, color: 'bg-emerald-500', growth: '+1' },
          { label: 'Ações Pendentes', value: '3', icon: <Clock size={24} />, color: 'bg-blue-500', growth: '-1' },
        ];
      case RoleType.SECRETARIA:
        return [
          { label: 'Membros Ativos', value: '158', icon: <Users size={24} />, color: 'bg-blue-600', growth: '+3' },
          { label: 'Visitantes Recentes', value: '12', icon: <Plus size={24} />, color: 'bg-emerald-500', growth: '+5' },
          { label: 'Avisos de Hoje', value: '2', icon: <Megaphone size={24} />, color: 'bg-amber-500', growth: '0' },
        ];
      case RoleType.PRESBITERO:
        return [
          { label: 'Sermões Recentes', value: '52', icon: <Mic2 size={24} />, color: 'bg-blue-800', growth: '+4' },
          { label: 'Membros Ativos', value: '158', icon: <Users size={24} />, color: 'bg-emerald-600', growth: '+2' },
          { label: 'Avisos Internos', value: '5', icon: <Megaphone size={24} />, color: 'bg-slate-700', growth: '0' },
        ];
      case RoleType.DIACONO:
        return [
          { label: 'Membros Atendidos', value: '45', icon: <Users size={24} />, color: 'bg-blue-600', growth: '+5' },
          { label: 'Ações Sociais', value: '4', icon: <HeartHandshake size={24} />, color: 'bg-rose-500', growth: 'Ativo' },
          { label: 'Agenda Diaconal', value: '3', icon: <Calendar size={24} />, color: 'bg-amber-500', growth: '+1' },
        ];
      case RoleType.EDITOR_SITE:
        return [
          { label: 'Páginas Editáveis', value: '4', icon: <Layout size={24} />, color: 'bg-blue-900', growth: 'Geral' },
          { label: 'Última Edição', value: 'Hoje', icon: <Clock size={24} />, color: 'bg-slate-900', growth: 'OK' },
          { label: 'Status do Site', value: 'Online', icon: <Globe size={24} />, color: 'bg-emerald-500', growth: '100%' },
        ];
      default: // Admin / Pastor
        return [
          { label: 'Total Membros', value: '158', icon: <Users size={24} />, color: 'bg-blue-900', growth: '+12%' },
          { label: 'Saldo de Caixa', value: 'R$ 45k', icon: <TrendingUp size={24} />, color: 'bg-emerald-500', growth: '+5%' },
          { label: 'Segurança Portal', value: 'Ativa', icon: <ShieldCheck size={24} />, color: 'bg-slate-900', growth: '100%' },
        ];
    }
  };

  const stats = renderStats();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Backoffice Eclésia</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Graça e Paz, <span className="text-blue-800">{(user?.name || 'Usuário').split(' ')[0]}</span>.
          </h2>
          <p className="text-slate-500 font-medium mt-1">Bem-vindo ao centro de operações da sua igreja.</p>
        </div>
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível de Acesso</span>
          <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter mt-1">{user.roleId}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 group hover:shadow-2xl hover:border-blue-100 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className={`${stat.color} p-5 rounded-2xl text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                {stat.growth}
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</h3>
              <p className="text-4xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Widget de Agenda Condicional */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-xl">Atividades Próximas</h3>
            <Link to="/admin/events" className="text-[10px] font-black text-blue-700 hover:underline uppercase tracking-widest">Ver Agenda Completa</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {[1, 2, 3].map(i => (
              <div key={i} className="px-10 py-6 flex items-center space-x-6 hover:bg-slate-50 transition-colors">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-500 border border-slate-200">
                  <span className="text-[8px] font-black uppercase tracking-widest">JUN</span>
                  <span className="text-xl font-black leading-none">{10 + i}</span>
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-900 text-lg">Reunião de {i === 1 ? 'Conselho' : i === 2 ? 'Mulheres' : 'Evangelismo'}</p>
                  <p className="text-sm text-slate-500 font-medium">19:30 • {i === 1 ? 'Sala de Reuniões' : 'Templo Central'}</p>
                </div>
                <div className="hidden sm:block">
                  {/* Fix: Added missing ChevronRight icon */}
                  <ChevronRight size={20} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner de Status Mobile-Ready */}
        <div className="bg-blue-800 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 opacity-10 -mr-16 -mb-16">
            {/* Fix: Added missing Cross icon */}
            <Cross size={400} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="bg-white/10 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">Status da Infraestrutura</div>
            <h3 className="text-3xl font-black leading-tight">Base de Dados <br /> Sincronizada com Mobile.</h3>
            <p className="text-blue-100 font-medium max-w-xs leading-relaxed">
              Todos os dados que você gerencia aqui já estão preparados para serem consumidos pelo seu futuro aplicativo mobile via REST API.
            </p>
            <div className="pt-4">
              <button className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-xl">
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