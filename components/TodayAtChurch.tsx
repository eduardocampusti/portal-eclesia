import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Flame, ChevronRight, AlertCircle, Info, Plus } from 'lucide-react';
import { WEEKLY_SCHEDULE } from '../constants';
import BannerSlider from './BannerSlider';
import { Banner } from '../types';

interface TodayAtChurchProps {
    banners?: Banner[];
    mode?: 'grid' | 'live';
}

const TodayAtChurch: React.FC<TodayAtChurchProps> = ({ banners = [], mode = 'grid' }) => {
    const [now, setNow] = useState(new Date());
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getWeekdayName = (dayIndex: number) => {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[dayIndex];
    };

    const isPrayerWeek = now.getDate() <= 7;
    const activeSchedule = WEEKLY_SCHEDULE; // Show full schedule in grid mode

    const currentDay = now.getDay();
    const todayEvents = activeSchedule.filter(e => e.day === currentDay);
    todayEvents.sort((a, b) => a.time.localeCompare(b.time));

    const nextEventToday = todayEvents.find(e => {
        const [hours, minutes] = e.time.split(':').map(Number);
        const eventDate = new Date(now);
        eventDate.setHours(hours, minutes, 0);
        return eventDate > now;
    });

    useEffect(() => {
        if (!nextEventToday) {
            setTimeLeft('');
            return;
        }
        const [h, m] = nextEventToday.time.split(':').map(Number);
        const eventDate = new Date(now);
        eventDate.setHours(h, m, 0);
        const diff = eventDate.getTime() - now.getTime();
        if (diff <= 0) return;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
    }, [now, nextEventToday]);

    if (mode === 'live') {
        return (
            <section id="agenda-viva" className="section bg-white">
                <div className="container">
                    <div className="text-center space-y-4 mb-12">
                        <div className="badge mx-auto">
                            <Clock size={12} />
                            <span>Agenda Viva</span>
                        </div>
                        <h2 className="!text-[#27432F]">Avisos e Novidades</h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Banners Slider */}
                        <div className="card !p-0 overflow-hidden min-h-[300px]">
                            {banners.length > 0 ? (
                                <BannerSlider banners={banners} />
                            ) : (
                                <div className="p-12 h-full flex flex-col justify-center items-center text-center bg-[#D19E65]/05">
                                    <Flame className="text-[#D19E65] mb-4" size={48} />
                                    <h4 className="font-bold text-[#27432F]">Fique por dentro</h4>
                                    <p className="text-muted text-sm">Acompanhe nossas redes sociais para avisos em tempo real.</p>
                                </div>
                            )}
                        </div>

                        {/* Today's Special Aviso */}
                        <div className="card !bg-[#D19E65]/10 !border-[#D19E65]/20 flex flex-col justify-center p-8 md:p-12">
                            <h4 className="text-[#27432F] font-black uppercase tracking-widest text-xs mb-4">Aviso Importante</h4>
                            {isPrayerWeek ? (
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-[#27432F]">Semana de Oração</h3>
                                    <p className="text-[#111827] font-medium leading-relaxed">
                                        De terça a sexta desta semana, as atividades regulares estão suspensas para nos dedicarmos à oração nos lares e na igreja.
                                    </p>
                                    <div className="badge !bg-white !text-[#27432F]">Sábado e Domingo: Normal</div>
                                </div>
                            ) : nextEventToday ? (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[#D19E65] font-black text-3xl">{nextEventToday.time}</p>
                                        <h3 className="text-2xl md:text-3xl font-bold text-[#27432F]">{nextEventToday.title}</h3>
                                        <p className="text-[#111827]/60 font-bold uppercase tracking-widest text-[10px] mt-1">{nextEventToday.ministry}</p>
                                    </div>
                                    {timeLeft && (
                                        <div className="flex items-center gap-2 text-[#27432F] font-bold">
                                            <div className="w-2 h-2 bg-[#D19E65] rounded-full animate-ping"></div>
                                            <span>Começa em {timeLeft}</span>
                                        </div>
                                    )}
                                    <button className="btnPrimary !bg-[#27432F] w-fit">
                                        Saber mais
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-[#27432F]">Culto Doméstico</h3>
                                    <p className="text-[#111827] font-medium leading-relaxed">
                                        Aproveite hoje para momentos de adoração em família e leitura da palavra.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Default: Grid Mode (Programação Semanal)
    return (
        <section id="agenda" className="section bg-white">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="badge">
                            <Calendar size={12} />
                            <span>Programação</span>
                        </div>
                        <h2 className="!text-[#27432F]">Próximos Encontros</h2>
                        <p className="text-muted text-elegant font-medium">
                            Participe de nossa programação regular e cresça na graça e no conhecimento.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeSchedule.map((item, idx) => (
                        <div key={idx} className="card group flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="bg-[#27432F]/5 text-[#27432F] px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">
                                        {getWeekdayName(item.day)}
                                    </div>
                                    <div className="text-[#D19E65] font-black font-mono text-lg">
                                        {item.time}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-[#27432F] group-hover:text-[#D19E65] transition-colors">{item.title}</h4>
                                    <div className="flex items-center gap-2 text-muted text-xs font-bold mt-1 uppercase tracking-widest">
                                        <MapPin size={12} />
                                        <span>{item.ministry}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button className="btnAccent w-full flex items-center justify-center gap-2 !py-3 !text-xs">
                                    <Plus size={16} />
                                    Adicionar ao Calendário
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TodayAtChurch;
