import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, supabaseUrl } from '../services/supabaseClient';
import { ChevronLeft, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import Cross from '../components/Cross';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!supabaseUrl || supabaseUrl === 'https://placeholder-project.supabase.co') {
            setError('Variáveis de ambiente do Supabase não configuradas.');
            setLoading(false);
            return;
        }

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(authError.message === 'Invalid login credentials'
                    ? 'E-mail ou senha incorretos.'
                    : authError.message);
            } else {
                navigate('/admin');
            }
        } catch (err: any) {
            setError('Ocorreu um erro inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white selection:bg-orange/30">
            {/* Lado Esquerdo - Branding Imersivo */}
            <div className="hidden lg:flex lg:col-span-7 bg-green relative overflow-hidden items-center justify-center p-20">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>

                {/* Efeito Visual de Fundo */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-dark/40 rounded-full blur-[100px] -ml-40 -mb-40"></div>

                <div className="relative z-10 max-w-xl text-white animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-10 border border-white/10 shadow-2xl">
                        <Cross size={40} className="text-orange" />
                    </div>
                    <h1 className="text-6xl font-serif leading-tight mb-8">
                        Gestão Eclesiástica <br />
                        <span className="text-orange italic">Inteligente</span>.
                    </h1>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange mt-2.5"></div>
                            <p className="text-white/80 text-xl font-medium tracking-wide">Controle total de membros, patrimônio e finanças em um só lugar.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange mt-2.5"></div>
                            <p className="text-white/80 text-xl font-medium tracking-wide">Transparência e segurança para a liderança e comunidade.</p>
                        </div>
                    </div>

                    <div className="mt-20 pt-10 border-t border-white/10">
                        <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">Igreja Presbiteriana em Brotas de Macaúbas</p>
                    </div>
                </div>
            </div>

            {/* Lado Direito - Formulário Revisitado */}
            <div className="lg:col-span-5 flex items-center justify-center p-8 md:p-12 lg:p-20 relative bg-orange-light/20">
                <div className="w-full max-w-sm">
                    <div className="mb-12 text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="w-16 h-16 bg-green rounded-2xl flex items-center justify-center text-white shadow-xl">
                                <Cross size={32} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-serif text-green mb-3">Bem-vindo ao Portal</h2>
                        <p className="text-slate-500 font-medium">Insira suas credenciais para gerenciar a igreja.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3 animate-in shake duration-500">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2 group">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-green transition-colors">E-mail Administrativo</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange transition-colors" size={20} />
                                <input
                                    type="email"
                                    placeholder="seu@eclesia.org"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-orange/5 focus:border-orange outline-none transition-all font-medium text-slate-900 group-focus-within:shadow-xl group-focus-within:shadow-orange/5"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-green transition-colors">Senha de Acesso</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange transition-colors" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-orange/5 focus:border-orange outline-none transition-all font-medium text-slate-900 group-focus-within:shadow-xl group-focus-within:shadow-orange/5"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-orange focus:ring-orange/20" />
                                <span className="text-slate-400 font-bold group-hover:text-slate-600 transition-colors">Lembrar acesso</span>
                            </label>
                            <a href="#" className="text-orange font-black hover:text-green transition-colors">Esqueci a senha</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-green-dark transition-all shadow-2xl shadow-green/20 active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                'Entrar no Sistema'
                            )}
                        </button>
                    </form>

                    <div className="mt-16 text-center">
                        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-green font-bold text-sm transition-all group">
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Voltar para o site público
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
