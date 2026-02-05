
import React, { useState, useEffect } from 'react';
import { churchService } from '../services/churchService';
import { User, RoleType } from '../types';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  X,
  Loader2,
  Search,
  Filter,
  MoreVertical,
  Mail,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Lock,
  Pencil,
  Eye,
  EyeOff
} from 'lucide-react';

const UsersManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string, name: string } | null>(null);
  const [newUser, setNewUser] = useState<Partial<User> & { password?: string }>({
    name: '', email: '', roleId: RoleType.SECRETARIA, password: ''
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await churchService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newUser.name || newUser.name.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres.');
      return;
    }
    if (!newUser.email || !newUser.email.includes('@')) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (!isEditing && (!newUser.password || newUser.password.length < 6)) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setActionLoading(true);
    try {
      const u = {
        name: (newUser.name || '').trim(),
        email: (newUser.email || '').trim().toLowerCase(),
        roleId: newUser.roleId as any || RoleType.SECRETARIA,
        password: (newUser.password || '').trim()
      };

      if (isEditing && editingId) {
        await churchService.updateUser(editingId, u);
      } else {
        await churchService.addUser(u);
      }

      await load();
      setShowInvite(false);
      setIsEditing(false);
      setEditingId(null);
      setNewUser({ name: '', email: '', roleId: RoleType.SECRETARIA, password: '' });
    } catch (err: any) {
      setError('Erro ao salvar usuário: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    setUserToDelete({ id, name });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setActionLoading(true);
    try {
      await churchService.deleteUser(userToDelete.id);
      await load();
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (err: any) {
      setError('Erro ao excluir usuário: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.roleId === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: RoleType) => {
    const config: Record<RoleType, { label: string, color: string }> = {
      [RoleType.ADMIN]: { label: 'Admin Global', color: 'bg-slate-900 text-white shadow-slate-200' },
      [RoleType.PASTOR_SENIOR]: { label: 'Pastor', color: 'bg-blue-700 text-white shadow-blue-200' },
      [RoleType.PRESBITERO]: { label: 'Presbítero', color: 'bg-blue-100 text-blue-700 shadow-transparent' },
      [RoleType.DIACONO]: { label: 'Diácono', color: 'bg-emerald-100 text-emerald-700 shadow-transparent' },
      [RoleType.CONTADORA]: { label: 'Contabilidade', color: 'bg-amber-100 text-amber-700 shadow-transparent' },
      [RoleType.MISSIONARIA]: { label: 'Missionária', color: 'bg-rose-100 text-rose-700 shadow-transparent' },
      [RoleType.SECRETARIA]: { label: 'Secretaria', color: 'bg-slate-100 text-slate-700 shadow-transparent' },
      [RoleType.EDITOR_SITE]: { label: 'Editor do Site', color: 'bg-indigo-100 text-indigo-700 shadow-transparent' },
    };
    const item = config[role] || { label: role, color: 'bg-gray-100 text-gray-600' };
    return (
      <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg ${item.color}`}>
        {item.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-slate-900 p-2 rounded-lg shadow-lg shadow-slate-200 text-white">
              <ShieldCheck size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Gestão de Segurança • RBAC</p>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Usuários & Acessos</h2>
          <p className="text-slate-500 font-medium mt-1">Gerencie permissões e convide novos oficiais para o portal.</p>
        </div>

        <button
          onClick={() => {
            setIsEditing(false);
            setEditingId(null);
            setNewUser({ name: '', email: '', roleId: RoleType.SECRETARIA, password: '' });
            setShowInvite(true);
          }}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl active:scale-95"
        >
          <UserPlus size={20} />
          <span>Cadastrar Usuário</span>
        </button>
      </div>

      {/* Stats & Filters Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            className="w-full bg-white border-2 border-transparent focus:border-blue-500 rounded-[24px] pl-16 pr-8 py-5 outline-none transition-all shadow-sm font-medium text-slate-900 placeholder:text-slate-300"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
            <Filter size={20} />
          </div>
          <select
            className="w-full bg-white border-2 border-transparent focus:border-blue-500 rounded-[24px] pl-16 pr-8 py-5 outline-none transition-all shadow-sm font-bold text-slate-700 appearance-none cursor-pointer"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="all">Todos os Cargos</option>
            <option value={RoleType.PASTOR_SENIOR}>Pastores</option>
            <option value={RoleType.PRESBITERO}>Presbíteros</option>
            <option value={RoleType.DIACONO}>Diáconos</option>
            <option value={RoleType.MISSIONARIA}>Missionárias</option>
            <option value={RoleType.CONTADORA}>Contabilidade</option>
            <option value={RoleType.EDITOR_SITE}>Editores do Site</option>
          </select>
        </div>

        <div className="bg-blue-50 rounded-[24px] p-5 flex items-center justify-center border border-blue-100">
          <p className="text-blue-700 font-black text-lg">
            {filteredUsers.length} <span className="text-[10px] uppercase tracking-widest text-blue-500 ml-1">Ativos</span>
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden mb-20 px-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr>
                <th className="px-8 pt-10 pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Operador</th>
                <th className="px-8 pt-10 pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Perfil (RBAC)</th>
                <th className="px-8 pt-10 pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Último Acesso</th>
                <th className="px-8 pt-10 pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2 className="animate-spin text-blue-600 mx-auto" size={40} />
                    <p className="mt-4 text-slate-400 font-medium tracking-tight">Consultando base de usuários...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <UserIcon size={40} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhum usuário encontrado</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="group hover:bg-slate-50/80 transition-all rounded-[32px]">
                    <td className="px-8 py-6 rounded-l-[32px]">
                      <div className="flex items-center space-x-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-500 font-black text-xl border border-white shadow-inner group-hover:scale-110 transition-transform">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{u.name}</p>
                          <p className="text-xs text-slate-400 font-bold flex items-center gap-1">
                            <Mail size={12} /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {getRoleBadge(u.roleId)}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <p className="text-xs font-black text-slate-500 flex items-center justify-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${u.lastLogin ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></span>
                        {u.lastLogin || 'Pendente'}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right rounded-r-[32px]">
                      <div className="flex items-center justify-end space-x-3 transition-all">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditingId(u.id);
                            setNewUser({
                              name: u.name,
                              email: u.email,
                              roleId: u.roleId,
                              password: ''
                            });
                            setShowInvite(true);
                          }}
                          className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm bg-white border border-blue-100"
                          title="Editar Usuário"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          className="p-3 text-rose-600 hover:bg-rose-50 rounded-2xl transition-all shadow-sm bg-white border border-rose-100"
                          title="Excluir Usuário"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-xl p-10 lg:p-14 shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
            <div className="absolute top-0 right-0 p-8">
              <button
                onClick={() => {
                  setShowInvite(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setShowPassword(false);
                  setNewUser({ name: '', email: '', roleId: RoleType.SECRETARIA, password: '' });
                }}
                className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-10">
              <div className="bg-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6">
                <UserPlus size={32} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {isEditing ? 'Editar Acesso' : 'Criar Novo Acesso'}
              </h3>
              <p className="text-slate-500 font-medium mt-1">
                {isEditing ? 'Atualize as permissões deste oficial.' : 'Configure o perfil e credenciais do novo oficial.'}
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 rounded-[20px] bg-rose-50 text-rose-700 text-sm font-bold border-2 border-rose-100 flex items-center gap-3 animate-in shake duration-500">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-900"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nome do oficial"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-900"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@portal.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cargo e Perfil de Acesso</label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-black text-slate-700 appearance-none cursor-pointer"
                    value={newUser.roleId}
                    onChange={e => setNewUser({ ...newUser, roleId: e.target.value as any })}
                  >
                    <option value={RoleType.PASTOR_SENIOR}>Pastor (Acesso Total)</option>
                    <option value={RoleType.PRESBITERO}>Presbítero</option>
                    <option value={RoleType.DIACONO}>Diácono</option>
                    <option value={RoleType.MISSIONARIA}>Missionária</option>
                    <option value={RoleType.SECRETARIA}>Secretário(a)</option>
                    <option value={RoleType.CONTADORA}>Contador(a) / Financeiro</option>
                    <option value={RoleType.EDITOR_SITE}>Editor do Site (CMS)</option>
                    <option value={RoleType.ADMIN}>Administrador Global</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Filter size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {isEditing ? 'Nova Senha (Deixe em branco para manter)' : 'Senha de Acesso Inicial'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!isEditing}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl pl-16 pr-12 py-4 outline-none transition-all font-medium text-slate-900"
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder={isEditing ? '********' : 'Defina uma senha'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  {actionLoading ? 'Salvando...' : isEditing ? 'Atualizar Perfil' : 'Salvar e Ativar Acesso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
            <div className="text-center">
              <div className="bg-rose-100 w-20 h-20 rounded-3xl flex items-center justify-center text-rose-600 mx-auto mb-8 shadow-inner">
                <ShieldAlert size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Confirmar Exclusão</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Tem certeza que deseja remover o acesso de <span className="text-slate-900 font-black">{userToDelete?.name}</span>? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                {actionLoading ? 'Excluindo...' : 'Sim, Remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManager;
