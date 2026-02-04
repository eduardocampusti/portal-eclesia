
import React from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  PieChart, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Users 
} from 'lucide-react';

const ReportsManager: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Central de Relatórios</h2>
          <p className="text-gray-500 text-sm">Análise consolidada do crescimento e saúde financeira da igreja.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-100 text-gray-600 px-5 py-3 rounded-2xl flex items-center justify-center space-x-2 font-bold hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} />
            <span>PDF Mensal</span>
          </button>
          <button className="bg-blue-600 text-white px-5 py-3 rounded-2xl flex items-center justify-center space-x-2 font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
            <Download size={18} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Crescimento de Rol</p>
              <Users className="text-blue-500" size={20} />
            </div>
            <h4 className="text-4xl font-black text-gray-900 tracking-tighter">+12.5%</h4>
            <p className="text-xs text-emerald-600 font-bold mt-2">18 novos membros este trimestre</p>
          </div>
          <div className="mt-8 h-24 flex items-end gap-1">
             {[30, 45, 35, 60, 55, 80, 70, 90].map((h, i) => (
               <div key={i} className="flex-1 bg-blue-100 rounded-t-lg hover:bg-blue-600 transition-all" style={{ height: `${h}%` }}></div>
             ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Saúde Financeira</p>
              <BarChart3 className="text-emerald-500" size={20} />
            </div>
            <h4 className="text-4xl font-black text-gray-900 tracking-tighter">R$ 4.2k</h4>
            <p className="text-xs text-gray-400 font-bold mt-2">Média de dízimo per capita</p>
          </div>
          <div className="mt-8 space-y-3">
             <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
               <span>Dízimos</span>
               <span className="text-gray-900">82%</span>
             </div>
             <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 w-[82%]"></div>
             </div>
             <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400 pt-2">
               <span>Ofertas</span>
               <span className="text-gray-900">18%</span>
             </div>
             <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 w-[18%]"></div>
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Alocação de Verba</p>
              <PieChart className="text-purple-500" size={20} />
            </div>
            <h4 className="text-4xl font-black text-gray-900 tracking-tighter">R$ 15k</h4>
            <p className="text-xs text-rose-500 font-bold mt-2">Gasto fixo mensal em 32%</p>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-[12px] border-purple-500 border-r-blue-500 border-b-emerald-500 border-l-rose-500"></div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
           <h3 className="text-xl font-black tracking-tight">Relatório de Transparência</h3>
           <p className="text-slate-400 text-sm max-w-md font-medium">Gere automaticamente o relatório para assembleia ordinária com todos os dados consolidados do sistema.</p>
        </div>
        <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-colors">
          Gerar Relatório Anual
        </button>
      </div>
    </div>
  );
};

export default ReportsManager;
