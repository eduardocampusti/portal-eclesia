import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Flame, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { WEEKLY_SCHEDULE } from '../constants';
import BannerSlider from './BannerSlider';
import { Banner } from '../types';

interface TodayAtChurchProps {
    banners?: Banner[];
}

const TodayAtChurch: React.FC<TodayAtChurchProps> = ({ banners = [] }) => {
    const [now, setNow] = useState(new Date());
    const [timeLeft, setTimeLeft] = useState<string>('');

    // Logic to update time and countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Helper: Get Weekday Name
    const getWeekdayName = (dayIndex: number) => {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[dayIndex];
    };

    // 1. Determine "Prayer Week" (First week of month: 1st to 7th)
    const isPrayerWeek = now.getDate() <= 7;

    // 2. Filter Schedule based on Prayer Week
    const activeSchedule = WEEKLY_SCHEDULE.filter(event => {
        if (!isPrayerWeek) return true; // Normal week, show all
        // Prayer Week: Only Keep Weekend (0=Sun, 6=Sat)
        return event.day === 0 || event.day === 6;
    });

    // 3. Find Today's Event
    const currentDay = now.getDay();
    const todayEvents = activeSchedule.filter(e => e.day === currentDay);

    // Sort today's events by time
    todayEvents.sort((a, b) => a.time.localeCompare(b.time));

    // Find next event TODAY
    const nextEventToday = todayEvents.find(e => {
        const [hours, minutes] = e.time.split(':').map(Number);
        const eventDate = new Date(now);
        eventDate.setHours(hours, minutes, 0);
        return eventDate > now;
    });

    // Calculate Countdown
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

    return (
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <Clock size={12} />
                            <span>Agenda Viva</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Hoje na <span className="text-blue-700">Igreja</span>
                        </h2>
                    </div>

                    {/* Prayer Week Banner */}
                    {isPrayerWeek && (
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-3 max-w-lg animate-in slide-in-from-right">
                            <Flame className="text-orange-500 flex-shrink-0" size={24} />
                            <div className="space-y-1">
                                <p className="text-xs font-black text-orange-800 uppercase tracking-widest">Semana de Oração</p>
                                <p className="text-sm text-orange-900/80 leading-relaxed font-medium">
                                    De terça a sexta desta semana, as atividades regulares estão suspensas para nos dedicarmos à oração nos lares e na igreja. Apenas Sábado e Domingo mantêm programação normal.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left: Today's Highlight */}
                    <div className="lg:col-span-2">
                        {banners.length > 0 ? (
                            <BannerSlider banners={banners} />
                        ) : nextEventToday ? (
                            <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/10 border border-slate-100 p-8 md:p-12 relative overflow-hidden group h-full flex flex-col justify-center">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Clock size={200} />
                                </div>

                                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
                                    <div className="bg-blue-600 text-white p-6 rounded-3xl text-center min-w-[120px]">
                                        <span className="block text-4xl font-black">{nextEventToday.time}</span>
                                        <span className="text-xs uppercase font-bold text-blue-200 tracking-widest">Horário</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">
                                            <MapPin size={12} />
                                            <span>Presencial</span>
                                        </div>
                                        <div>
                                            <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 leading-none">
                                                {nextEventToday.title}
                                            </h3>
                                            <p className="text-slate-500 font-medium text-lg">Ministério: {nextEventToday.ministry}</p>
                                        </div>
                                        {timeLeft && (
                                            <div className="pt-4 flex items-center gap-2 text-blue-700 font-bold animate-pulse">
                                                <Clock size={18} />
                                                <span>Começa em {timeLeft}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 p-12 h-full flex flex-col justify-center items-center text-center space-y-6">
                                <div className="bg-slate-100 p-6 rounded-full text-slate-400">
                                    <Calendar size={48} />
                                </div>
                                <div className="max-w-md space-y-2">
                                    <h3 className="text-2xl font-black text-slate-700">Sem atividades presenciais hoje</h3>
                                    <p className="text-slate-500 font-medium">
                                        Aproveite este tempo para seu culto doméstico, leitura bíblica e oração em família.
                                    </p>
                                </div>
                                <div className="inline-flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    <Info size={14} />
                                    <span>Consulte a agenda da semana</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Weekly List (Premium Revamp) */}
                    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col h-[600px] relative overflow-hidden">

                        {/* Title Header */}
                        <div className="flex items-center gap-3 mb-8 z-10 relative">
                            <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-600/20">
                                <Calendar size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="font-black text-xl text-slate-900 tracking-tight">Programação Semanal</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Atividades Regulares</p>
                            </div>
                        </div>

                        {/* Fading Gradients for Scroll */}
                        <div className="absolute top-[100px] left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

                        <div className="overflow-y-auto pr-2 space-y-6 custom-scrollbar flex-1 pb-24 relative z-0">
                            {[0, 1, 2, 3, 4, 5, 6].map(dayNum => {
                                // Filter events for this day
                                const dayEvents = activeSchedule.filter(e => e.day === dayNum);
                                if (dayEvents.length === 0) return null;

                                const isToday = currentDay === dayNum;

                                return (
                                    <div key={dayNum} className={`relative group`}>
                                        {/* Connecting Line (Decor) */}
                                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-100 group-last:hidden" />

                                        {/* Sticky header with solid bg to prevent overlap */}
                                        <div className="mb-4 pl-1 sticky top-0 bg-white z-10 py-3 border-b border-white/0 transition-all">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ml-3 ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>
                                                {getWeekdayName(dayNum)} {isToday && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[8px] ml-2 font-bold">HOJE</span>}
                                            </span>
                                        </div>

                                        <div className={`space-y-4 pl-3`}>
                                            {dayEvents.map((ev, idx) => {
                                                let isNext = false;
                                                // Robust "Next Event" check
                                                if (nextEventToday && isToday && ev.time === nextEventToday.time) {
                                                    isNext = true;
                                                }

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`
                                                            p-5 rounded-[24px] border transition-all duration-300 relative overflow-hidden
                                                            ${isNext
                                                                ? 'bg-white border-blue-500 shadow-xl shadow-blue-900/10 ring-4 ring-blue-50/50 scale-[1.02] z-10'
                                                                : isToday
                                                                    ? 'bg-blue-50/50 border-blue-100 shadow-sm'
                                                                    : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 hover:-translate-y-1'
                                                            }
                                                        `}
                                                    >
                                                        {isNext && (
                                                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-md">
                                                                A Seguir
                                                            </div>
                                                        )}

                                                        <div className="flex items-start gap-4 relative z-10">
                                                            <div className={`
                                                                font-black text-lg tracking-tight min-w-[60px] text-right font-mono
                                                                ${isNext ? 'text-blue-700' : isToday ? 'text-slate-700' : 'text-slate-900'}
                                                            `}>
                                                                {ev.time}
                                                            </div>
                                                            <div className={`flex-1 border-l-2 pl-4 py-1 ${isNext ? 'border-blue-200' : 'border-slate-200/50'}`}>
                                                                <h5 className={`font-bold leading-tight text-lg mb-1 ${isNext ? 'text-blue-900' : 'text-slate-800'}`}>
                                                                    {ev.title}
                                                                </h5>
                                                                <p className={`text-[10px] font-bold uppercase tracking-wide ${isNext || isToday ? 'text-blue-500' : 'text-slate-400'}`}>
                                                                    {ev.ministry}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {/* Spacer between groups */}
                                        <div className="h-4"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TodayAtChurch;
