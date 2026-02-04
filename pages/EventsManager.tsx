import React, { useState, useEffect } from 'react';
import { churchService } from '../services/churchService';
import { Event } from '../types';
import { Calendar, Plus, MapPin, Trash2, Edit2, Clock, Loader2 } from 'lucide-react';

const EventsManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '', date: '', location: '', description: '', category: 'CULT'
  });

  useEffect(() => {
    const loadEvents = async () => {
      const data = await churchService.getEvents();
      setEvents(data);
    };
    loadEvents();
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    setError(null);
    if (!newEvent.title || newEvent.title.length < 3) {
      setError('O título deve ter pelo menos 3 caracteres.');
      return;
    }
    if (!newEvent.date) {
      setError('A data e hora são obrigatórias.');
      return;
    }
    if (!newEvent.location) {
      setError('O local é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      const ev: Omit<Event, 'id'> = {
        title: newEvent.title,
        date: newEvent.date,
        location: newEvent.location || '',
        description: newEvent.description || '',
        category: (newEvent.category as any) || 'CULT'
      };
      await churchService.addEvent(ev);
      const data = await churchService.getEvents();
      setEvents(data);
      setShowAdd(false);
      setNewEvent({ title: '', date: '', location: '', description: '', category: 'CULT' });
    } catch (err: any) {
      setError('Erro ao salvar evento: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este evento?')) return;
    try {
      await churchService.deleteEvent(id);
      const data = await churchService.getEvents();
      setEvents(data);
    } catch (err: any) {
      alert('Erro ao excluir evento: ' + (err.message || 'Erro desconhecido'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agenda da Igreja</h2>
          <p className="text-gray-500 text-sm">Organize os eventos, cultos e reuniões.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center justify-center space-x-2 font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus size={20} />
          <span>Novo Evento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map(ev => (
          <div key={ev.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                  <Calendar size={24} />
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase">{ev.category}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{ev.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500 gap-2">
                  <Clock size={16} /> {new Date(ev.date).toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-gray-500 gap-2">
                  <MapPin size={16} /> {ev.location}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-6">{ev.description}</p>
              <div className="flex items-center justify-end border-t border-gray-50 pt-4 gap-2">
                <button className="text-gray-400 hover:text-emerald-600 p-2 transition-colors"><Edit2 size={18} /></button>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="text-gray-400 hover:text-rose-600 p-2 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Criar Novo Evento</h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100 animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
                <input
                  type="datetime-local"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newEvent.date}
                  onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newEvent.category}
                  onChange={e => setNewEvent({ ...newEvent, category: e.target.value as any })}
                >
                  <option value="CULT">Culto</option>
                  <option value="MEETING">Reunião</option>
                  <option value="OUTREACH">Evangelismo</option>
                  <option value="CONFERENCE">Conferência</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                <input
                  type="text"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newEvent.location}
                  onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
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
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManager;