
import React, { useState, useEffect } from 'react';
import { churchService } from '../services/churchService';
import { Member } from '../types';
import { Users, Plus, Mail, Phone, MapPin, ChevronRight, Search, Loader2, Trash2, AlertCircle } from 'lucide-react';

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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-orange uppercase tracking-[0.3em] mb-3 opacity-80">Gestão de Pessoas</p>
          <h2 className="text-4xl font-serif text-green tracking-tight">Rol de <span className="text-orange italic">Membros</span></h2>
          <p className="text-slate-500 font-medium mt-1">Administre o corpo de membros e visitantes da igreja.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-green text-white px-8 py-4 rounded-2xl flex items-center justify-center space-x-3 font-black text-xs uppercase tracking-widest hover:bg-green-dark transition-all shadow-xl shadow-green/10 active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Novo Registro</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-shadow duration-500">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center space-x-4">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou e-mail..."
            className="bg-transparent border-none focus:ring-0 w-full text-slate-900 font-medium placeholder:text-slate-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <Users size={40} />
              </div>
              <p className="text-slate-400 font-medium">Nenhum membro encontrado com estes termos.</p>
            </div>
          ) : (
            filtered.map(member => (
              <div key={member.id} className="p-8 flex flex-col md:flex-row md:items-center gap-8 hover:bg-orange-light/10 transition-all duration-300">
                <div className="flex-shrink-0 relative">
                  <div className="w-20 h-20 bg-white border-2 border-slate-50 rounded-2xl flex items-center justify-center text-green font-serif text-3xl shadow-sm group-hover:border-orange/20 transition-all duration-500">
                    {member.name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${member.status === 'ACTIVE' ? 'bg-green' : 'bg-slate-300'}`}></div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <h4 className="text-2xl font-serif text-green tracking-tight">{member.name}</h4>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${member.status === 'ACTIVE' ? 'bg-green/5 text-green border-green/10' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                      {member.status === 'ACTIVE' ? 'ATIVO' : member.status === 'VISITOR' ? 'VISITANTE' : 'INATIVO'}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-2.5"><Mail size={16} className="text-orange/60" /> {member.email}</div>
                    <div className="flex items-center gap-2.5"><Phone size={16} className="text-orange/60" /> {member.phone}</div>
                    <div className="flex items-center gap-2.5 sm:col-span-2 lg:col-span-1"><MapPin size={16} className="text-orange/60" /> {member.address}</div>
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-3">
                  <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-green hover:bg-green hover:text-white rounded-xl border border-green/10 transition-all">Prontuário</button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Excluir Membro"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button className="p-3 text-slate-300 hover:text-green hover:bg-green/5 rounded-xl transition-all"><ChevronRight size={24} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-green-dark/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-2xl p-12 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Users size={200} className="text-green" />
            </div>

            <div className="relative z-10">
              <div className="mb-10">
                <p className="text-[10px] font-black text-orange uppercase tracking-[0.3em] mb-2">Novos Dados</p>
                <h3 className="text-3xl font-serif text-green italic">Cadastrar Membro</h3>
              </div>

              {error && (
                <div className="mb-8 p-5 rounded-2xl bg-rose-50 text-rose-600 text-sm font-bold border border-rose-100 flex items-center gap-3 animate-in shake duration-500">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2 space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-green transition-colors">Nome Completo</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-orange/5 focus:border-orange outline-none transition-all font-medium text-slate-900"
                    placeholder="Ex: João da Silva"
                    value={newMember.name}
                    onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-green transition-colors">E-mail</label>
                  <input
                    type="email"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-orange/5 focus:border-orange outline-none transition-all font-medium text-slate-900"
                    placeholder="email@exemplo.com"
                    value={newMember.email}
                    onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-green transition-colors">Telefone</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-orange/5 focus:border-orange outline-none transition-all font-medium text-slate-900"
                    placeholder="(00) 00000-0000"
                    value={newMember.phone}
                    onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-green transition-colors">Endereço Residencial</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-orange/5 focus:border-orange outline-none transition-all font-medium text-slate-900"
                    placeholder="Rua, Número, Bairro"
                    value={newMember.address}
                    onChange={e => setNewMember({ ...newMember, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-green transition-colors">Status Eclesiástico</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-orange/5 focus:border-orange outline-none transition-all font-medium text-slate-900 appearance-none"
                    value={newMember.status}
                    onChange={e => setNewMember({ ...newMember, status: e.target.value as any })}
                  >
                    <option value="ACTIVE">Membro Ativo</option>
                    <option value="INACTIVE">Membro Inativo</option>
                    <option value="VISITOR">Visitante</option>
                  </select>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-green transition-colors">Data de Admissão</label>
                  <input
                    type="date"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-orange/5 focus:border-orange outline-none transition-all font-medium text-slate-900"
                    value={newMember.joinDate}
                    onChange={e => setNewMember({ ...newMember, joinDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-12 flex gap-6">
                <button
                  disabled={loading}
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-5 border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  Descartar
                </button>
                <button
                  disabled={loading}
                  onClick={handleAdd}
                  className="flex-1 py-5 bg-green text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-dark transition-all shadow-xl shadow-green/10 disabled:opacity-50 flex justify-center items-center"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Finalizar Cadastro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManager;
