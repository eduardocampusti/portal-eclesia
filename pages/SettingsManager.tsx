import React, { useState, useEffect } from 'react';
import {
    Save,
    Image as ImageIcon,
    Info,
    Mail,
    Phone,
    MapPin,
    Layout,
    History,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Monitor,
    Plus,
    Trash2,
    MousePointer2,
    Upload,
    Pencil,
    ArrowLeft,
    X,
    Heart,
    DollarSign,
    QrCode,
    Landmark,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { SiteSettings, Banner } from '../types';
import { churchService } from '../services/churchService';

const SettingsManager: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings>({
        hero_title: '',
        hero_subtitle: '',
        hero_image_url: '',
        mission_title: '',
        mission_description: '',
        about_title: '',
        about_description: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        banners: [],
        finance_title: '',
        finance_description: '',
        finance_pix_key: '',
        finance_pix_type: '',
        finance_pix_holder: '',
        finance_bank1_name: '',
        finance_bank1_agency: '',
        finance_bank1_account: '',
        finance_bank2_name: '',
        finance_bank2_agency: '',
        finance_bank2_account: '',
        finance_pix_qr_url: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'contact' | 'banners' | 'finance'>('hero');
    const [uploading, setUploading] = useState<string | null>(null); // banner ID currently uploading
    const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await churchService.getSettings();
            if (data) setSettings(data);
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await churchService.updateSettings(settings);
            setMessage({ text: 'Configurações atualizadas com sucesso!', type: 'success' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            if (err.message === 'QUOTA_EXCEEDED') {
                setMessage({
                    text: '⚠️ Memória cheia! Use o botão "Otimizar Sistema" abaixo para corrigir.',
                    type: 'error'
                });
            } else {
                setMessage({ text: 'Erro ao salvar configurações. Verifique o tamanho das imagens.', type: 'error' });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleOptimize = async () => {
        if (!window.confirm("Isso irá remover as imagens pesadas que estão travando o sistema. Você precisará enviá-las novamente. Deseja continuar?")) return;

        setSaving(true);
        try {
            const optimizeBanners = (settings.banners || []).map(b => ({
                ...b,
                imageUrl: b.imageUrl && b.imageUrl.length > 500000 ? '' : b.imageUrl
            }));

            const optimizedSettings = { ...settings, banners: optimizeBanners };
            setSettings(optimizedSettings);

            await churchService.updateSettings(optimizedSettings);
            churchService.simplifySettings();

            setMessage({ text: 'Sistema otimizado! Tente salvar agora.', type: 'success' });
        } catch (e) {
            setMessage({ text: 'Erro ao otimizar. Tente recarregar a página.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const MAX_WIDTH = 1920;
                    const MAX_HEIGHT = 1080;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Compression failed'));
                            return;
                        }
                        const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    }, 'image/jpeg', 0.7);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, bannerId: string) => {
        const originalFile = e.target.files?.[0];
        if (!originalFile) return;

        setUploading(bannerId);
        try {
            const file = await compressImage(originalFile);
            const url = await churchService.uploadImage(file);

            setSettings(prev => {
                const newBanners = [...(prev.banners || [])];
                const index = newBanners.findIndex(b => b.id === bannerId);
                if (index !== -1) {
                    newBanners[index] = { ...newBanners[index], imageUrl: url };
                }
                return { ...prev, banners: newBanners };
            });
        } catch (err) {
            console.error(err);
            setMessage({ text: 'Erro ao processar imagem.', type: 'error' });
        } finally {
            setUploading(null);
        }
    };

    const deleteBanner = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Tem certeza que deseja excluir este banner?')) {
            const newBanners = settings.banners?.filter(b => b.id !== id);
            setSettings({ ...settings, banners: newBanners });
            if (editingBannerId === id) setEditingBannerId(null);
            churchService.updateSettings({ ...settings, banners: newBanners }).catch(console.error);
        }
    };

    const moveBanner = (id: string, direction: 'up' | 'down', e: React.MouseEvent) => {
        e.stopPropagation();
        setSettings(prev => {
            const banners = [...(prev.banners || [])];
            const index = banners.findIndex(b => b.id === id);
            if (index === -1) return prev;

            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= banners.length) return prev;

            const temp = banners[index];
            banners[index] = banners[newIndex];
            banners[newIndex] = temp;

            return { ...prev, banners };
        });
    };

    const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                setEditingBannerId(null);
            }}
            className={`
        flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap
        ${activeTab === id
                    ? 'text-blue-700'
                    : 'text-slate-400 hover:text-slate-600'}
      `}
        >
            <Icon size={18} />
            {label}
            {activeTab === id && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-700 rounded-t-full shadow-[0_-4px_12px_rgba(29,78,216,0.5)]" />
            )}
        </button>
    );

    // Filter to find the banner being edited
    const currentBanner = settings.banners?.find(b => b.id === editingBannerId);
    const currentBannerIndex = settings.banners?.findIndex(b => b.id === editingBannerId) ?? -1;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-slate-400 font-medium animate-pulse">Carregando editor premium...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-700 p-2 rounded-lg shadow-lg shadow-blue-200">
                            <Layout className="text-white" size={20} />
                        </div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">CMS Pro • Editor</p>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Editor do Site</h2>
                    <p className="text-slate-500 font-medium mt-1">Personalize a experiência pública do seu portal.</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleOptimize}
                        className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-amber-200 transition-all flex items-center gap-2"
                        title="Corrige erros de salvamento limpando memória"
                    >
                        <Trash2 size={16} /> Otimizar Sistema
                    </button>

                    {/* Show Back button if editing a banner */}
                    {activeTab === 'banners' && editingBannerId && (
                        <button
                            onClick={() => setEditingBannerId(null)}
                            className="bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
                        >
                            <ArrowLeft size={18} /> Voltar
                        </button>
                    )}

                    <button
                        onClick={(e) => handleSave(e)}
                        disabled={saving}
                        className={`
                            flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl
                            ${saving
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-700 text-white hover:bg-blue-800 hover:shadow-blue-200 active:scale-95'}
                        `}
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>

            {/* Floating Status Message */}
            {message && (
                <div className={`
          fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in zoom-in duration-300
          ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}
        `}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold text-sm tracking-tight">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-2 opacity-50 hover:opacity-100"><X size={14} /></button>
                </div>
            )}

            {/* Main Container */}
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                {/* Sidebar-like Navigation */}
                <div className="flex border-b border-slate-50 bg-slate-50/50 overflow-x-auto custom-scrollbar">
                    <TabButton id="hero" label="Cabeçalho (Hero)" icon={ImageIcon} />
                    <TabButton id="banners" label="Banners Rotativos" icon={Monitor} />
                    <TabButton id="about" label="Institucional" icon={History} />
                    <TabButton id="contact" label="Contatos & Social" icon={Mail} />
                    <TabButton id="finance" label="Contribuição" icon={Heart} />
                </div>

                <div className="p-10 lg:p-14">
                    {/* HERO TAB */}
                    {activeTab === 'hero' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid lg:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título de Impacto</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                            value={settings.hero_title}
                                            onChange={e => setSettings({ ...settings, hero_title: e.target.value })}
                                            placeholder="Ex: Uma Igreja Reformada..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtítulo (Mensagem de Boas-vindas)</label>
                                        <textarea
                                            rows={4}
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-600 placeholder:text-slate-300 resize-none"
                                            value={settings.hero_subtitle}
                                            onChange={e => setSettings({ ...settings, hero_subtitle: e.target.value })}
                                            placeholder="Descreva brevemente a missão..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL da Imagem de Fundo</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                                                <ImageIcon size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl pl-12 pr-6 py-4 outline-none transition-all font-medium text-slate-900"
                                                value={settings.hero_image_url}
                                                onChange={e => setSettings({ ...settings, hero_image_url: e.target.value })}
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prévia Visual</label>
                                        <div className="flex items-center gap-2">
                                            <Monitor size={14} className="text-blue-500" />
                                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Live Preview</span>
                                        </div>
                                    </div>
                                    <div className="aspect-video rounded-[32px] overflow-hidden border-8 border-slate-50 shadow-inner group relative">
                                        {settings.hero_image_url ? (
                                            <>
                                                <img
                                                    src={settings.hero_image_url}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    alt="Preview"
                                                />
                                                <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-end">
                                                    <h4 className="text-white font-black text-lg line-clamp-1">{settings.hero_title || 'Título Aqui'}</h4>
                                                    <p className="text-white/70 text-xs font-medium line-clamp-2">{settings.hero_subtitle || 'Subtítulo aqui...'}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 space-y-2">
                                                <ImageIcon size={48} strokeWidth={1} />
                                                <p className="text-xs font-bold uppercase tracking-widest">Insira uma URL válida</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BANNERS TAB - REFACTORED */}
                    {activeTab === 'banners' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">

                            {/* VIEW: LIST OF BANNERS */}
                            {!editingBannerId && (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 tracking-tight">Galeria de Banners</h4>
                                            <p className="text-slate-500 text-sm font-medium">Banners ativos na página inicial.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newId = Math.random().toString(36).substr(2, 9);
                                                const newBanner: Banner = {
                                                    id: newId,
                                                    imageUrl: '',
                                                    title: '',
                                                    subtitle: '',
                                                    linkUrl: '',
                                                    active: true
                                                };
                                                setSettings({ ...settings, banners: [...(settings.banners || []), newBanner] });
                                                setEditingBannerId(newId);
                                            }}
                                            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10"
                                        >
                                            <Plus size={16} /> Novo Banner
                                        </button>
                                    </div>

                                    {(!settings.banners || settings.banners.length === 0) ? (
                                        <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
                                            <Monitor className="text-slate-300 mx-auto mb-4" size={48} strokeWidth={1} />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhum banner cadastrado</p>
                                        </div>
                                    ) : (
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {settings.banners.map((banner) => (
                                                <div
                                                    key={banner.id}
                                                    onClick={() => setEditingBannerId(banner.id)}
                                                    className="group bg-slate-50 rounded-[24px] overflow-hidden border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer relative"
                                                >
                                                    {/* Image Thumbnail */}
                                                    <div className="aspect-video bg-slate-200 relative overflow-hidden">
                                                        {banner.imageUrl ? (
                                                            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="flex items-center justify-center w-full h-full text-slate-400">
                                                                <ImageIcon size={32} />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                                                        {/* Floating Edit Icon */}
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-md text-white p-3 rounded-full">
                                                            <Pencil size={24} />
                                                        </div>
                                                    </div>

                                                    {/* Content Preview */}
                                                    <div className="p-5 flex items-start gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-black text-slate-900 truncate text-sm">{banner.title || 'Sem título'}</h5>
                                                            <p className="text-xs text-slate-500 truncate">{banner.subtitle || 'Sem descrição'}</p>
                                                        </div>
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSettings(prev => {
                                                                    const newBanners = [...(prev.banners || [])];
                                                                    const idx = newBanners.findIndex(b => b.id === banner.id);
                                                                    if (idx !== -1) {
                                                                        newBanners[idx] = { ...newBanners[idx], active: !newBanners[idx].active };
                                                                    }
                                                                    return { ...prev, banners: newBanners };
                                                                });
                                                            }}
                                                            className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${banner.active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}
                                                            title={banner.active ? 'Ativo' : 'Inativo'}
                                                        />
                                                    </div>

                                                    {/* Action Buttons Overlay */}
                                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button
                                                            onClick={(e) => deleteBanner(banner.id, e)}
                                                            className="p-2 bg-white/95 text-rose-500 rounded-lg shadow-md hover:bg-rose-50 hover:scale-110 transition-all"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>

                                                        {settings.banners && settings.banners.length > 1 && (
                                                            <div className="flex flex-col gap-1">
                                                                <button
                                                                    onClick={(e) => moveBanner(banner.id, 'up', e)}
                                                                    disabled={settings.banners.indexOf(banner) === 0}
                                                                    className="p-2 bg-white/95 text-blue-600 rounded-lg shadow-md hover:bg-blue-50 hover:scale-110 transition-all disabled:opacity-30 disabled:hover:scale-100"
                                                                    title="Mover para cima"
                                                                >
                                                                    <ArrowUp size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => moveBanner(banner.id, 'down', e)}
                                                                    disabled={settings.banners.indexOf(banner) === settings.banners.length - 1}
                                                                    className="p-2 bg-white/95 text-blue-600 rounded-lg shadow-md hover:bg-blue-50 hover:scale-110 transition-all disabled:opacity-30 disabled:hover:scale-100"
                                                                    title="Mover para baixo"
                                                                >
                                                                    <ArrowDown size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* VIEW: EDIT BANNER FORM */}
                            {editingBannerId && currentBanner && (
                                <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 tracking-tight">Editar Banner</h4>
                                            <p className="text-slate-500 text-sm font-medium">Personalize os detalhes deste banner.</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${currentBanner.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {currentBanner.active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 rounded-[32px] p-8 border border-slate-100 relative">
                                        <div className="grid lg:grid-cols-2 gap-10">
                                            {/* Preview Area (Left on Desktop) */}
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prévia</label>
                                                <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-200 group">
                                                    {currentBanner.imageUrl ? (
                                                        <img src={currentBanner.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center w-full h-full text-slate-400 opacity-60">
                                                            <ImageIcon size={48} />
                                                            <span className="text-[10px] font-black uppercase mt-2">Sem Imagem</span>
                                                        </div>
                                                    )}

                                                    {/* Overlay Text Preview */}
                                                    <div className="absolute inset-0 bg-black/20 p-6 flex flex-col justify-end">
                                                        <h4 className="text-white font-black text-xl leading-tight drop-shadow-md">{currentBanner.title}</h4>
                                                        <p className="text-white/80 text-xs font-medium mt-1 drop-shadow-sm">{currentBanner.subtitle}</p>
                                                    </div>
                                                </div>

                                                {/* Upload Control */}
                                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                    <label className="flex items-center gap-4 cursor-pointer group">
                                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                            {uploading === currentBanner.id ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-slate-900">Alterar Imagem</p>
                                                            <p className="text-xs text-slate-400">Recomendado: 1920x1080px (Max 2MB)</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={e => handleFileUpload(e, currentBanner.id)}
                                                            disabled={!!uploading}
                                                        />
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Form Fields (Right on Desktop) */}
                                            <div className="space-y-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL da Imagem (Opcional)</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-600 text-xs"
                                                            value={currentBanner.imageUrl}
                                                            onChange={e => {
                                                                setSettings(prev => {
                                                                    const newBanners = [...(prev.banners || [])];
                                                                    newBanners[currentBannerIndex] = { ...newBanners[currentBannerIndex], imageUrl: e.target.value };
                                                                    return { ...prev, banners: newBanners };
                                                                });
                                                            }}
                                                            placeholder="https://..."
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-900"
                                                            value={currentBanner.title}
                                                            onChange={e => {
                                                                setSettings(prev => {
                                                                    const newBanners = [...(prev.banners || [])];
                                                                    newBanners[currentBannerIndex] = { ...newBanners[currentBannerIndex], title: e.target.value };
                                                                    return { ...prev, banners: newBanners };
                                                                });
                                                            }}
                                                            placeholder="Título do evento ou destaque"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtítulo</label>
                                                        <textarea
                                                            rows={2}
                                                            className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-600 resize-none"
                                                            value={currentBanner.subtitle}
                                                            onChange={e => {
                                                                setSettings(prev => {
                                                                    const newBanners = [...(prev.banners || [])];
                                                                    newBanners[currentBannerIndex] = { ...newBanners[currentBannerIndex], subtitle: e.target.value };
                                                                    return { ...prev, banners: newBanners };
                                                                });
                                                            }}
                                                            placeholder="Breve descrição..."
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Link de Ação</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-blue-600"
                                                            value={currentBanner.linkUrl}
                                                            onChange={e => {
                                                                setSettings(prev => {
                                                                    const newBanners = [...(prev.banners || [])];
                                                                    newBanners[currentBannerIndex] = { ...newBanners[currentBannerIndex], linkUrl: e.target.value };
                                                                    return { ...prev, banners: newBanners };
                                                                });
                                                            }}
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <div className={`w-14 h-8 rounded-full transition-all relative ${currentBanner.active ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${currentBanner.active ? 'left-7' : 'left-1'}`} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-700">Banner Ativo</span>
                                                            <span className="text-[10px] text-slate-400">Exibir publicamente</span>
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={currentBanner.active}
                                                            onChange={e => {
                                                                setSettings(prev => {
                                                                    const newBanners = [...(prev.banners || [])];
                                                                    newBanners[currentBannerIndex] = { ...newBanners[currentBannerIndex], active: e.target.checked };
                                                                    return { ...prev, banners: newBanners };
                                                                });
                                                            }}
                                                        />
                                                    </label>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            handleSave(e);
                                                            setEditingBannerId(null); // Go back to list on save
                                                        }}
                                                        disabled={saving}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2"
                                                    >
                                                        {saving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                                                        Salvar & Voltar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ABOUT TAB */}
                    {activeTab === 'about' && (
                        <div className="grid lg:grid-cols-2 gap-16 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-10">
                                <div className="bg-blue-50/50 p-8 rounded-[32px] border border-blue-100 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="text-blue-600" size={20} />
                                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Nossa Missão</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-bold text-slate-900"
                                            value={settings.mission_title}
                                            onChange={e => setSettings({ ...settings, mission_title: e.target.value })}
                                            placeholder="Título da Missão"
                                        />
                                        <textarea
                                            rows={3}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-600 resize-none"
                                            value={settings.mission_description}
                                            onChange={e => setSettings({ ...settings, mission_description: e.target.value })}
                                            placeholder="Descrição detalhada..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Info className="text-slate-600" size={20} />
                                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Sobre a Igreja</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-bold text-slate-900"
                                            value={settings.about_title}
                                            onChange={e => setSettings({ ...settings, about_title: e.target.value })}
                                            placeholder="Ex: Nossa História"
                                        />
                                        <textarea
                                            rows={3}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-600 resize-none"
                                            value={settings.about_description}
                                            onChange={e => setSettings({ ...settings, about_description: e.target.value })}
                                            placeholder="Uma breve história da congregação..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTACT TAB */}
                    {activeTab === 'contact' && (
                        <div className="grid md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-100 transition-colors space-y-6 group">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Mail size={20} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail Público</label>
                                    <input
                                        type="email"
                                        className="w-full border-b-2 border-slate-50 focus:border-blue-500 outline-none py-2 font-bold text-slate-900 transition-all"
                                        value={settings.contact_email}
                                        onChange={e => setSettings({ ...settings, contact_email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-100 transition-colors space-y-6 group">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <Phone size={20} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telefone / WhatsApp</label>
                                    <input
                                        type="text"
                                        className="w-full border-b-2 border-slate-50 focus:border-blue-500 outline-none py-2 font-bold text-slate-900 transition-all"
                                        value={settings.contact_phone}
                                        onChange={e => setSettings({ ...settings, contact_phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-100 transition-colors space-y-6 group">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <MapPin size={20} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Endereço Completo</label>
                                    <input
                                        type="text"
                                        className="w-full border-b-2 border-slate-50 focus:border-blue-500 outline-none py-2 font-bold text-slate-900 transition-all"
                                        value={settings.contact_address}
                                        onChange={e => setSettings({ ...settings, contact_address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FINANCE TAB */}
                    {activeTab === 'finance' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-12">
                            {/* Section Header */}
                            <div className="grid lg:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div className="bg-blue-50/50 p-8 rounded-[32px] border border-blue-100 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <Heart className="text-blue-600" size={20} />
                                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Título & Descrição</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título da Seção</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-bold text-slate-900"
                                                    value={settings.finance_title}
                                                    onChange={e => setSettings({ ...settings, finance_title: e.target.value })}
                                                    placeholder="Ex: Contribua com a Obra"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtítulo (Call to Action)</label>
                                                <textarea
                                                    rows={3}
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-600 resize-none"
                                                    value={settings.finance_description}
                                                    onChange={e => setSettings({ ...settings, finance_description: e.target.value })}
                                                    placeholder="Texto explicativo sobre dízimos e ofertas..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* PIX Settings */}
                                    <div className="bg-emerald-50/50 p-8 rounded-[32px] border border-emerald-100 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <QrCode className="text-emerald-600" size={20} />
                                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Configuração do PIX</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chave PIX</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                                                        value={settings.finance_pix_key}
                                                        onChange={e => setSettings({ ...settings, finance_pix_key: e.target.value })}
                                                        placeholder="Ex: 12345678000"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Chave</label>
                                                    <select
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all font-medium text-slate-600"
                                                        value={settings.finance_pix_type}
                                                        onChange={e => setSettings({ ...settings, finance_pix_type: e.target.value })}
                                                    >
                                                        <option value="">Selecionar...</option>
                                                        <option value="CNPJ">CNPJ</option>
                                                        <option value="CPF">CPF</option>
                                                        <option value="Email">Email</option>
                                                        <option value="Telefone">Telefone</option>
                                                        <option value="Aleatória">Chave Aleatória</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titular da Conta</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all font-medium text-slate-600"
                                                    value={settings.finance_pix_holder}
                                                    onChange={e => setSettings({ ...settings, finance_pix_holder: e.target.value })}
                                                    placeholder="Nome do titular como aparece no banco"
                                                />
                                            </div>

                                            {/* QR Code Upload */}
                                            <div className="pt-4 border-t border-emerald-100">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-3">QR Code do PIX (Opcional)</label>
                                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                                    <div className="w-32 h-32 bg-white rounded-2xl border-2 border-dashed border-emerald-200 flex items-center justify-center overflow-hidden group relative">
                                                        {settings.finance_pix_qr_url ? (
                                                            <>
                                                                <img src={settings.finance_pix_qr_url} className="w-full h-full object-contain" alt="QR Code" />
                                                                <button
                                                                    onClick={() => setSettings({ ...settings, finance_pix_qr_url: '' })}
                                                                    className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <QrCode size={40} className="text-emerald-100" />
                                                        )}
                                                        {uploading === 'pix_qr' && (
                                                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                                <Loader2 className="animate-spin text-emerald-600" size={24} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 space-y-3 w-full">
                                                        <label className="flex items-center gap-3 bg-white border border-emerald-200 px-4 py-3 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors group">
                                                            <Upload size={18} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                                                            <span className="text-xs font-bold text-slate-700">Fazer Upload do QR Code</span>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (!file) return;
                                                                    setUploading('pix_qr');
                                                                    try {
                                                                        const compressed = await compressImage(file);
                                                                        const url = await churchService.uploadImage(compressed);
                                                                        setSettings(prev => ({ ...prev, finance_pix_qr_url: url }));
                                                                    } catch (err) {
                                                                        console.error(err);
                                                                        setMessage({ text: 'Erro ao enviar QR Code.', type: 'error' });
                                                                    } finally {
                                                                        setUploading(null);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                        <p className="text-[10px] text-slate-400 leading-tight">
                                                            💡 Se preferir, você pode enviar uma imagem do QR Code gerado pelo seu banco.
                                                            Caso não envie, o sistema gerará um automático baseado na Chave PIX acima.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bank Accounts */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 ml-2">
                                    <Landmark className="text-slate-600" size={20} />
                                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Contas Bancárias</h4>
                                </div>
                                <div className="grid lg:grid-cols-2 gap-8">
                                    {/* Bank 1 */}
                                    <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h5 className="font-bold text-slate-700">Conta Principal</h5>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">1</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Banco</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-600"
                                                    value={settings.finance_bank1_name}
                                                    onChange={e => setSettings({ ...settings, finance_bank1_name: e.target.value })}
                                                    placeholder="Ex: Banco do Brasil"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agência</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-600"
                                                    value={settings.finance_bank1_agency}
                                                    onChange={e => setSettings({ ...settings, finance_bank1_agency: e.target.value })}
                                                    placeholder="0000-0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conta</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-600"
                                                    value={settings.finance_bank1_account}
                                                    onChange={e => setSettings({ ...settings, finance_bank1_account: e.target.value })}
                                                    placeholder="00000-0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank 2 */}
                                    <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h5 className="font-bold text-slate-700">Conta Secundária (Opcional)</h5>
                                            <span className="text-xs bg-slate-200 text-slate-500 px-3 py-1 rounded-full font-bold">2</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Banco</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-600"
                                                    value={settings.finance_bank2_name}
                                                    onChange={e => setSettings({ ...settings, finance_bank2_name: e.target.value })}
                                                    placeholder="Ex: Caixa Econômica"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agência</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-600"
                                                    value={settings.finance_bank2_agency}
                                                    onChange={e => setSettings({ ...settings, finance_bank2_agency: e.target.value })}
                                                    placeholder="0000"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conta</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium text-slate-600"
                                                    value={settings.finance_bank2_account}
                                                    onChange={e => setSettings({ ...settings, finance_bank2_account: e.target.value })}
                                                    placeholder="00000000-0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsManager;
