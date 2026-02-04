
import React, { useState, useEffect } from 'react';
import { churchService } from '../services/churchService';
import { Sermon } from '../types';
import { Mic2, Plus, Search, Trash2, Edit2, Play, Loader2 } from 'lucide-react';

const SermonsManager: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSermon, setNewSermon] = useState<Partial<Sermon>>({
    title: '', pastor: '', date: new Date().toISOString().split('T')[0], description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fix: Await the async service call to get sermons and update local state
  useEffect(() => {
    const loadSermons = async () => {
      const data = await churchService.getSermons();
      setSermons(data);
    };
    loadSermons();
  }, []);

  // Fix: Make handleAdd async and await service calls for persistence and state refresh
  const handleAdd = async () => {
    setError(null);
    if (!newSermon.title || newSermon.title.length < 5) {
      setError('O título do sermão deve ter pelo menos 5 caracteres.');
      return;
    }
    if (!newSermon.pastor) {
      setError('O nome do pregador é obrigatório.');
      return;
    }
    if (!newSermon.date) {
      setError('A data é obrigatória.');
      return;
    }

    setLoading(true);
    try {
      const sermon: Omit<Sermon, 'id'> = {
        title: newSermon.title,
        pastor: newSermon.pastor,
        date: newSermon.date || '',
        description: newSermon.description || '',
      };
      await churchService.addSermon(sermon);
      const data = await churchService.getSermons();
      setSermons(data);
      setShowAddModal(false);
      setNewSermon({ title: '', pastor: '', date: new Date().toISOString().split('T')[0], description: '' });
    } catch (err: any) {
      setError('Erro ao salvar sermão: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este sermão?')) return;
    try {
      await churchService.deleteSermon(id);
      const data = await churchService.getSermons();
      setSermons(data);
    } catch (err: any) {
      alert('Erro ao excluir sermão: ' + (err.message || 'Erro desconhecido'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Sermões</h2>
          <p className="text-gray-500 text-sm">Gerencie os vídeos e áudios das pregações dominicais.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center justify-center space-x-2 font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          <span>Novo Sermão</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center space-x-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título ou pastor..."
            className="bg-transparent border-none focus:ring-0 w-full text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sermão</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Pastor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sermons.map(sermon => (
                <tr key={sermon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <Mic2 size={18} />
                      </div>
                      <span className="font-bold text-gray-900">{sermon.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{sermon.pastor}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{sermon.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Play size={18} /></button>
                      <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button
                        onClick={() => handleDelete(sermon.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Adicionar Novo Sermão</h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100 animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Sermão</label>
                <input
                  type="text"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newSermon.title}
                  onChange={e => setNewSermon({ ...newSermon, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pregador</label>
                <input
                  type="text"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newSermon.pastor}
                  onChange={e => setNewSermon({ ...newSermon, pastor: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="date"
                    className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newSermon.date}
                    onChange={e => setNewSermon({ ...newSermon, date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none h-24"
                  value={newSermon.description}
                  onChange={e => setNewSermon({ ...newSermon, description: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <button
                disabled={loading}
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border border-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                disabled={loading}
                onClick={handleAdd}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SermonsManager;
