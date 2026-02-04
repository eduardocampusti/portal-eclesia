
import React, { useState, useEffect } from 'react';
import { churchService } from '../services/churchService';
import { SocialAction } from '../types';
import { HeartHandshake, Plus, Clock, Search, Trash2, CheckCircle2, X, Loader2 } from 'lucide-react';

const SocialActionsManager: React.FC = () => {
  const [actions, setActions] = useState<SocialAction[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newAction, setNewAction] = useState<Partial<SocialAction>>({
    title: '', description: '', targetAudience: '', status: 'PLANNED', date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await churchService.getSocialActions();
    setActions(data);
  };

  const handleAdd = async () => {
    setError(null);
    if (!newAction.title || newAction.title.length < 5) {
      setError('O título deve ter pelo menos 5 caracteres.');
      return;
    }
    if (!newAction.description || newAction.description.length < 10) {
      setError('A descrição deve ter pelo menos 10 caracteres.');
      return;
    }
    if (!newAction.targetAudience) {
      setError('O público-alvo é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      const action: Omit<SocialAction, 'id'> = {
        title: newAction.title,
        description: newAction.description,
        targetAudience: newAction.targetAudience,
        status: (newAction.status as any) || 'PLANNED',
        date: newAction.date || new Date().toISOString().split('T')[0]
      };
      await churchService.addSocialAction(action);
      await load();
      setShowAdd(false);
      setNewAction({ title: '', description: '', targetAudience: '', status: 'PLANNED', date: new Date().toISOString().split('T')[0] });
    } catch (err: any) {
      setError('Erro ao salvar ação social: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta ação social?')) return;
    try {
      await churchService.deleteSocialAction(id);
      await load();
    } catch (err: any) {
      alert('Erro ao excluir ação social: ' + (err.message || 'Erro desconhecido'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Ações Sociais & Missões</h2>
          <p className="text-gray-500 text-sm">Gerencie o impacto da igreja na comunidade local e campos missionários.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-rose-600 text-white px-5 py-3 rounded-2xl flex items-center justify-center space-x-2 font-bold hover:bg-rose-700 transition-all shadow-xl shadow-rose-200"
        >
          <Plus size={20} />
          <span>Nova Ação</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map(action => (
          <div key={action.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all">
            <div className="p-6 flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                  <HeartHandshake size={24} />
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${action.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                  action.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'
                  }`}>
                  {action.status}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{action.title}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase mt-1">Público: {action.targetAudience}</p>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{action.description}</p>
              <div className="pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400 font-bold gap-2">
                <Clock size={14} /> Data Prevista: {action.date}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-end gap-2">
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><CheckCircle2 size={18} /></button>
              <button
                onClick={() => handleDelete(action.id)}
                className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Nova Ação Social / Missão</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100 animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título da Ação</label>
                <input
                  type="text"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-rose-500 outline-none"
                  value={newAction.title}
                  onChange={e => setNewAction({ ...newAction, title: e.target.value })}
                  placeholder="Ex: Entrega de Cestas Básicas"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-rose-500 outline-none"
                    value={newAction.status}
                    onChange={e => setNewAction({ ...newAction, status: e.target.value as any })}
                  >
                    <option value="PLANNED">Planejado</option>
                    <option value="IN_PROGRESS">Em Andamento</option>
                    <option value="COMPLETED">Concluído</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Público-alvo</label>
                  <input
                    type="text"
                    className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-rose-500 outline-none"
                    value={newAction.targetAudience}
                    onChange={e => setNewAction({ ...newAction, targetAudience: e.target.value })}
                    placeholder="Ex: Famílias Necessitadas"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-rose-500 outline-none h-32"
                  value={newAction.description}
                  onChange={e => setNewAction({ ...newAction, description: e.target.value })}
                  placeholder="Descreva o objetivo e detalhes da ação..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Prevista</label>
                <input
                  type="date"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-rose-500 outline-none"
                  value={newAction.date}
                  onChange={e => setNewAction({ ...newAction, date: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                disabled={loading}
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 border border-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                disabled={loading}
                onClick={handleAdd}
                className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 disabled:opacity-50 flex justify-center items-center shadow-lg shadow-rose-200"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Ação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialActionsManager;
