import React, { useState, useEffect } from 'react';
import { churchService } from '../services/churchService';
import { Announcement } from '../types';
import { Megaphone, Plus, Bell, Trash2, Clock, Edit2, X, Loader2 } from 'lucide-react';

const AnnouncementsManager: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({
    title: '', content: '', priority: 'NORMAL', target: 'PUBLIC', date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    const data = await churchService.getAnnouncements();
    setAnnouncements(data);
  };

  const handleAdd = async () => {
    setError(null);
    if (!newAnnouncement.title || newAnnouncement.title.length < 5) {
      setError('O título deve ter pelo menos 5 caracteres.');
      return;
    }
    if (!newAnnouncement.content || newAnnouncement.content.length < 10) {
      setError('O conteúdo deve ter pelo menos 10 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const ann: Omit<Announcement, 'id'> = {
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        priority: (newAnnouncement.priority as any) || 'NORMAL',
        target: (newAnnouncement.target as any) || 'PUBLIC',
        date: newAnnouncement.date || new Date().toISOString().split('T')[0]
      };
      await churchService.addAnnouncement(ann);
      await loadAnnouncements();
      setShowAddModal(false);
      setNewAnnouncement({ title: '', content: '', priority: 'NORMAL', target: 'PUBLIC', date: new Date().toISOString().split('T')[0] });
    } catch (err: any) {
      setError('Erro ao salvar comunicado: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este comunicado?')) return;
    try {
      await churchService.deleteAnnouncement(id);
      await loadAnnouncements();
    } catch (err: any) {
      alert('Erro ao excluir comunicado: ' + (err.message || 'Erro desconhecido'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comunicados Oficiais</h2>
          <p className="text-gray-500 text-sm">Avisos importantes para a congregação.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 text-white px-4 py-2 rounded-xl flex items-center justify-center space-x-2 font-bold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus size={20} />
          <span>Novo Comunicado</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className={`bg-white p-6 rounded-3xl border ${ann.priority === 'HIGH' ? 'border-amber-200' : 'border-gray-100'} shadow-sm relative overflow-hidden group`}>
            {ann.priority === 'HIGH' && (
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase">Urgente</div>
            )}
            <div className="flex gap-6">
              <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${ann.priority === 'HIGH' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                <Megaphone size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{ann.title}</h3>
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Clock size={14} /> {ann.date}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{ann.content}</p>
                <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <Bell size={12} /> Enviado via Push API
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"><Edit2 size={18} /></button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Novo Comunicado</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100 animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newAnnouncement.title}
                  onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Ex: Reunião de Jovens"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                  <select
                    className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newAnnouncement.priority}
                    onChange={e => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">Alta (Urgente)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Público-alvo</label>
                  <select
                    className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newAnnouncement.target}
                    onChange={e => setNewAnnouncement({ ...newAnnouncement, target: e.target.value as any })}
                  >
                    <option value="PUBLIC">Público (Todos)</option>
                    <option value="INTERNAL">Interno (Membros)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
                <textarea
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none h-32"
                  value={newAnnouncement.content}
                  onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Descreva o comunicado em detalhes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newAnnouncement.date}
                  onChange={e => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
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
                className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Postar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsManager;