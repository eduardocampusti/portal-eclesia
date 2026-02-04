
import React, { useState, useEffect } from 'react';
import { churchService } from '../services/churchService';
import { Member } from '../types';
import { Users, Plus, Mail, Phone, MapPin, ChevronRight, Search, Loader2, Trash2 } from 'lucide-react';

const MembersManager: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: '', email: '', phone: '', address: '', status: 'ACTIVE', joinDate: new Date().toISOString().split('T')[0]
  });

  // Fix: Await the async service call to get members and update local state
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const data = await churchService.getMembers();
    setMembers(data);
  };

  const handleAdd = async () => {
    setError(null);
    if (!newMember.name || newMember.name.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres.');
      return;
    }
    if (!newMember.email || !newMember.email.includes('@')) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (!newMember.phone) {
      setError('O telefone é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      const m: Omit<Member, 'id'> = {
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
        address: newMember.address || '',
        status: (newMember.status as any) || 'ACTIVE',
        joinDate: newMember.joinDate || new Date().toISOString()
      };
      await churchService.addMember(m);
      await loadMembers();
      setShowAdd(false);
      setNewMember({ name: '', email: '', phone: '', address: '', status: 'ACTIVE', joinDate: new Date().toISOString().split('T')[0] });
    } catch (err: any) {
      setError('Erro ao salvar membro: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este membro?')) return;
    try {
      await churchService.deleteMember(id);
      await loadMembers();
    } catch (err: any) {
      alert('Erro ao excluir membro: ' + (err.message || 'Erro desconhecido'));
    }
  };

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rol de Membros</h2>
          <p className="text-gray-500 text-sm">Controle de membros, congregados e visitantes.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center justify-center space-x-2 font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          <span>Novo Membro</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center space-x-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar membros por nome ou e-mail..."
            className="bg-transparent border-none focus:ring-0 w-full text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.map(member => (
            <div key={member.id} className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 font-black text-xl">
                  {member.name.charAt(0)}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-gray-900">{member.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {member.status === 'ACTIVE' ? 'ATIVO' : 'INATIVO'}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><Mail size={14} /> {member.email}</div>
                  <div className="flex items-center gap-2"><Phone size={14} /> {member.phone}</div>
                  <div className="flex items-center gap-2 sm:col-span-2 md:col-span-1"><MapPin size={14} /> {member.address}</div>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                <button className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">Prontuário</button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-gray-300 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <button className="p-2 text-gray-300 hover:text-gray-600"><ChevronRight size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Cadastrar Novo Membro</h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100 animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newMember.name}
                  onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newMember.email}
                  onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="text"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newMember.phone}
                  onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newMember.address}
                  onChange={e => setNewMember({ ...newMember, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newMember.status}
                  onChange={e => setNewMember({ ...newMember, status: e.target.value as any })}
                >
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                  <option value="VISITOR">Visitante</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Admissão</label>
                <input
                  type="date"
                  className="w-full border-gray-200 rounded-xl py-3 px-4 border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newMember.joinDate}
                  onChange={e => setNewMember({ ...newMember, joinDate: e.target.value })}
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
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManager;
