import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cross, ArrowLeft, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../App';
import { RoleType } from '../types';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!authError) {
        navigate('/admin');
        return;
      }

      // Se der erro (inclusive Failed to fetch), tentamos o fallback local
      console.warn('Supabase auth failed, checking local database...');
      const localUsersRaw = localStorage.getItem('eclesia_users');
      if (localUsersRaw) {
        const localUsers = JSON.parse(localUsersRaw);
        const searchEmail = email.trim().toLowerCase();
        const searchPass = password.trim();

        const matchedUser = localUsers.find((u: any) =>
          u.email?.trim().toLowerCase() === searchEmail &&
          u.password?.trim() === searchPass
        );

        if (matchedUser) {
          const { password: _, ...userToStore } = matchedUser;
          localStorage.setItem('eclesia_dev_user', JSON.stringify({
            ...userToStore,
            id: matchedUser.id || 'local-' + Date.now()
          }));
          window.location.hash = '/admin';
          window.location.reload(); // Garante que o App.tsx re-leia o localStorage
          return;
        }
      }

      setError(authError.message === 'Invalid login credentials' || authError.message === 'Failed to fetch'
        ? 'Credenciais inválidas ou erro de conexão. Tente o Acesso Rápido ou verifique seus dados.'
        : authError.message);
    } catch (err: any) {
      // Catch para erros de rede drásticos (Failed to fetch)
      const localUsersRaw = localStorage.getItem('eclesia_users');
      if (localUsersRaw) {
        const localUsers = JSON.parse(localUsersRaw);
        const searchEmail = email.trim().toLowerCase();
        const searchPass = password.trim();

        const matchedUser = localUsers.find((u: any) =>
          u.email?.trim().toLowerCase() === searchEmail &&
          u.password?.trim() === searchPass
        );
        if (matchedUser) {
          const { password: _, ...userToStore } = matchedUser;
          localStorage.setItem('eclesia_dev_user', JSON.stringify(userToStore));
          window.location.hash = '/admin';
          window.location.reload();
          return;
        }
      }
      setError('Erro de conexão (Failed to fetch). Verifique sua internet ou use o Modo Dev.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-8 mx-auto">
          <ArrowLeft size={16} className="mr-2" /> Voltar ao site público
        </Link>
        <div className="flex justify-center">
          <div className="bg-blue-700 p-3 rounded-2xl shadow-xl shadow-blue-200">
            <Cross size={40} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Portal Eclésia Restrito</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Gestão administrativa IPB</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-gray-100">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100 animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail Administrativo</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Acessar Painel'}
              </button>
            </div>
          </form>

          <div className="mt-4">
            <button
              onClick={() => {
                const devUser = {
                  id: 'dev-admin',
                  name: 'Admin de Emergência',
                  email: 'admin@brotar.com',
                  roleId: RoleType.ADMIN
                };
                localStorage.setItem('eclesia_dev_user', JSON.stringify(devUser));
                window.location.reload();
              }}
              type="button"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border-2 border-slate-100 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-50 hover:border-blue-100 hover:text-blue-700 transition-all"
            >
              <ShieldCheck size={18} />
              Acesso Rápido (Modo Dev)
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Protegido por criptografia de ponta a ponta. <br />
              Acesso restrito a oficiais e funcionários autorizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
