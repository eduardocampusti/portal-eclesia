
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  PieChart, 
  Users, 
  Loader2
} from 'lucide-react';
import { churchService } from '../services/churchService';
import { Member, FinancialTransaction } from '../types';

const ReportsManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [membersData, financeData] = await Promise.all([
        churchService.getMembers(),
        churchService.getFinance()
      ]);
      setMembers(membersData);
      setTransactions(financeData);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos de Membros
  const activeMembers = members.filter(m => m.status === 'ACTIVE').length;
  // Membros que entraram nos últimos 90 dias
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const newMembersCount = members.filter(m => new Date(m.joinDate) >= ninetyDaysAgo).length;
  const previousMemberCount = Math.max(1, members.length - newMembersCount); // Evitar divisão por zero
  const growthRate = ((newMembersCount / previousMemberCount) * 100).toFixed(1);

  // Cálculos Financeiros
  const incomeTransactions = transactions.filter(t => t.type === 'INCOME');
  const expenseTransactions = transactions.filter(t => t.type === 'EXPENSE');

  const totalTithes = incomeTransactions
    .filter(t => t.category === 'Dízimo')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const totalOfferings = incomeTransactions
    .filter(t => t.category === 'Oferta')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
  
  // Per capita (Dízimo / Membros Ativos)
  const tithePerCapita = activeMembers > 0 ? (totalTithes / activeMembers) : 0;

  // Porcentagens
  const tithePercentage = totalIncome > 0 ? ((totalTithes / totalIncome) * 100).toFixed(0) : 0;
  const offeringPercentage = totalIncome > 0 ? ((totalOfferings / totalIncome) * 100).toFixed(0) : 0;

  // Alocação de Despesas
  const totalExpenses = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);
  
  // Agrupar despesas por categoria
  const expensesByCategory = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  // Pegar a maior despesa (Categoria com maior gasto)
  const sortedCategories = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a);
  const topExpenseCategory = sortedCategories.length > 0 ? sortedCategories[0] : ['Nenhuma', 0];
  const topExpensePercentage = totalExpenses > 0 ? ((topExpenseCategory[1] / totalExpenses) * 100).toFixed(0) : 0;

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Central de Relatórios</h2>
          <p className="text-gray-500 text-sm">Análise consolidada (Dízimos R$ {totalTithes.toLocaleString()} • Ofertas R$ {totalOfferings.toLocaleString()})</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-100 text-gray-600 px-5 py-3 rounded-2xl flex items-center justify-center space-x-2 font-bold hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} />
            <span>PDF Mensal</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Crescimento */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Crescimento (Trimestre)</p>
              <Users className="text-blue-500" size={20} />
            </div>
            <h4 className="text-4xl font-black text-gray-900 tracking-tighter">+{growthRate}%</h4>
            <p className="text-xs text-emerald-600 font-bold mt-2">{newMembersCount} novos membros em 90 dias</p>
          </div>
          <div className="mt-8">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Total Ativos</span>
              <span className="font-bold text-slate-900">{activeMembers} Membros</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
               <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, (activeMembers / 200) * 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Card Saúde Financeira */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Dízimo Médio</p>
              <TrendingUp className="text-emerald-500" size={20} />
            </div>
            <h4 className="text-4xl font-black text-gray-900 tracking-tighter">R$ {tithePerCapita.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h4>
            <p className="text-xs text-gray-400 font-bold mt-2">Dízimo médio per capita</p>
          </div>
          <div className="mt-8 space-y-3">
             <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
               <span>Dízimos do Total</span>
               <span className="text-gray-900">{tithePercentage}%</span>
             </div>
             <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500" style={{ width: `${tithePercentage}%` }}></div>
             </div>
             <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400 pt-2">
               <span>Ofertas do Total</span>
               <span className="text-gray-900">{offeringPercentage}%</span>
             </div>
             <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500" style={{ width: `${offeringPercentage}%` }}></div>
             </div>
          </div>
        </div>

        {/* Card Alocação de Verba */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Maior Despesa</p>
              <PieChart className="text-purple-500" size={20} />
            </div>
            <h4 className="text-4xl font-black text-gray-900 tracking-tighter">R$ {topExpenseCategory[1].toLocaleString()}</h4>
            <p className="text-xs text-rose-500 font-bold mt-2">{topExpenseCategory[0]} representa {topExpensePercentage}%</p>
          </div>
          <div className="mt-8">
            <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Top Categorias de Saída</h5>
            <div className="space-y-2">
              {sortedCategories.slice(0, 3).map(([cat, amount], i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                   <span className="text-gray-600 font-medium">{cat}</span>
                   <span className="text-gray-900 font-bold">R$ {amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
           <h3 className="text-xl font-black tracking-tight">Relatório de Transparência</h3>
           <p className="text-slate-400 text-sm max-w-md font-medium">Gere automaticamente o relatório para assembleia ordinária com todos os dados consolidados (Entradas: R$ {totalIncome.toLocaleString()} / Saídas: R$ {totalExpenses.toLocaleString()}).</p>
        </div>
        <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-colors">
          Gerar Relatório Anual
        </button>
      </div>
    </div>
  );
};

export default ReportsManager;
