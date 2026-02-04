
import React, { useState, useEffect } from 'react';
import { churchService } from '../services/churchService';
import { FinancialTransaction } from '../types';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Search, Filter, Download, Plus, X, Loader2, Trash2 } from 'lucide-react';

const FinanceManager: React.FC = () => {
  const [records, setRecords] = useState<FinancialTransaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newRecord, setNewRecord] = useState<Partial<FinancialTransaction>>({
    type: 'INCOME', category: '', amount: 0, date: new Date().toISOString().split('T')[0], description: ''
  });

  useEffect(() => {
    loadFinance();
  }, []);

  const loadFinance = async () => {
    const data = await churchService.getFinance();
    setRecords(data);
  };

  const handleAdd = async () => {
    setError(null);
    if (!newRecord.description || newRecord.description.length < 3) {
      setError('A descrição deve ter pelo menos 3 caracteres.');
      return;
    }
    if (!newRecord.amount || newRecord.amount <= 0) {
      setError('O valor deve ser maior que zero.');
      return;
    }
    if (!newRecord.category) {
      setError('A categoria é obrigatória.');
      return;
    }
    if (!newRecord.date) {
      setError('A data é obrigatória.');
      return;
    }

    setLoading(true);
    try {
      const rec: Omit<FinancialTransaction, 'id'> = {
        type: newRecord.type as any,
        category: newRecord.category,
        amount: Number(newRecord.amount),
        date: newRecord.date,
        description: newRecord.description
      };
      await churchService.addFinance(rec);
      await loadFinance();
      setShowAddModal(false);
      setNewRecord({ type: 'INCOME', category: '', amount: 0, date: new Date().toISOString().split('T')[0], description: '' });
    } catch (err: any) {
      setError('Erro ao salvar lançamento: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este lançamento?')) return;
    try {
      await churchService.deleteFinance(id);
      await loadFinance();
    } catch (err: any) {
      alert('Erro ao excluir lançamento: ' + (err.message || 'Erro desconhecido'));
    }
  };

  const totalIncome = records.filter(r => r.type === 'INCOME').reduce((acc, r) => acc + r.amount, 0);
  const totalExpense = records.filter(r => r.type === 'EXPENSE').reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Módulo Financeiro</h2>
          <p className="text-gray-500 text-sm">Gestão de dízimos, ofertas e despesas ministeriais.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 bg-white border border-gray-100 rounded-xl text-gray-600 shadow-sm hover:bg-gray-50">
            <Download size={20} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center justify-center space-x-2 font-bold hover:bg-slate-800 transition-colors shadow-lg"
          >
            <Plus size={20} />
            <span>Novo Lançamento</span>
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Entradas</p>
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-black text-gray-900">R$ {totalIncome.toLocaleString()}</h4>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ArrowUpCircle size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Saídas</p>
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-black text-gray-900">R$ {totalExpense.toLocaleString()}</h4>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <ArrowDownCircle size={24} />
            </div>
          </div>
        </div>
        <div className="bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-200 text-white">
          <p className="text-sm font-medium text-blue-100 mb-1">Saldo Líquido</p>
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-black">R$ {(totalIncome - totalExpense).toLocaleString()}</h4>
            <div className="p-2 bg-white/20 rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Filtrar lançamentos..." className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-gray-600 px-4 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50">
            <Filter size={18} /> Filtrar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map(rec => (
                <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{rec.date}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{rec.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{rec.category}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-black ${rec.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {rec.type === 'INCOME' ? '+' : '-'} R$ {rec.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(rec.id)}
                      className="p-2 text-gray-300 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Novo Lançamento Financeiro</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100 animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Lançamento</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-xl">
                  <button
                    onClick={() => setNewRecord({ ...newRecord, type: 'INCOME' })}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${newRecord.type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                  >
                    Entrada (+)
                  </button>
                  <button
                    onClick={() => setNewRecord({ ...newRecord, type: 'EXPENSE' })}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${newRecord.type === 'EXPENSE' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-400'}`}
                  >
                    Saída (-)
                  </button>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newRecord.description}
                  onChange={e => setNewRecord({ ...newRecord, description: e.target.value })}
                  placeholder="Ex: Dízimo Mensal, Conta de Luz..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newRecord.amount || ''}
                  onChange={e => setNewRecord({ ...newRecord, amount: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newRecord.category}
                  onChange={e => setNewRecord({ ...newRecord, category: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  <option value="Dízimo">Dízimo</option>
                  <option value="Oferta">Oferta</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Pessoal">Pessoal</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newRecord.date}
                  onChange={e => setNewRecord({ ...newRecord, date: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                disabled={loading}
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border border-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                disabled={loading}
                onClick={handleAdd}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Lançar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManager;
