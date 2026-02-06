import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, supabaseUrl } from '../services/supabaseClient';
import { ChevronLeft, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

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

        // Guard for unconfigured Supabase
        if (!supabaseUrl || supabaseUrl === 'https://placeholder-project.supabase.co') {
            setError('O sistema de autenticação (Supabase) não foi configurado corretamente nas variáveis de ambiente.');
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
                    ? 'Credenciais inválidas. Verifique seu e-mail e senha.'
                    : authError.message);
            } else {
                navigate('/admin');
            }
        } catch (err: any) {
            setError('Ocorreu um erro inesperado ao tentar entrar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authWrap">
            <div className="authCard animate-fade-in">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#1F4D35]/05 flex items-center justify-center text-[#1F4D35]">
                            <Lock size={32} />
                        </div>
                    </div>
                    <h2 className="!text-current text-[#1F4D35] !mb-1">Acesso Restrito</h2>
                    <p className="sub">Portal IPB Brotas de Macaúbas</p>
                </div>

                {error && (
                    <div className="authError">
                        <AlertCircle size={16} className="inline mr-2" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="field">
                        <label htmlFor="email">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="!pl-12"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="password">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="!pl-12"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btnPrimary w-full !py-4 shadow-lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin mr-2" />
                                Entrando...
                            </>
                        ) : (
                            'Entrar no Portal'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
                    <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-[#1F4D35] flex items-center gap-1 transition-colors">
                        <ChevronLeft size={16} /> Voltar para o site
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
