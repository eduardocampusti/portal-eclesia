import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Flame, ChevronRight, AlertCircle, Info, Plus, Loader2 } from 'lucide-react';
import { churchService } from '../services/churchService';
import { Event } from '../types';

interface TodayAtChurchProps {
    mode?: 'grid' | 'live';
}

const TodayAtChurch: React.FC<TodayAtChurchProps> = ({ mode = 'grid' }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await churchService.getEvents();
                // Filter recurring events to show in the "Weekly Schedule" section
                const weekly = data.filter(ev => ev.is_recurring);
                setEvents(weekly);
            } catch (err) {
                console.error('Error loading agenda:', err);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    const getWeekdayName = (dayIndex: number | undefined) => {
        if (dayIndex === undefined) return '';
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[dayIndex];
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                <Loader2 size={40} className="animate-spin text-orange mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Carregando Agenda...</p>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Nenhuma programação cadastrada para esta semana.</p>
            </div>
        );
    }

    // Grid Mode (Programação Semanal Institucional)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((item, idx) => (
                <div key={item.id} className="eventCard group !p-0 overflow-hidden !rounded-[32px] border-none shadow-xl hover:shadow-2xl transition-all duration-500">
                    <div className="flex flex-col h-full relative">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 z-0">
                            {item.image_url ? (
                                <img
                                    src={item.image_url}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={item.title}
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-100" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--green)] via-[var(--green)]/80 to-[var(--green)]/20" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-8 pt-24 h-full flex flex-col">
                            <span className="text-[10px] font-black uppercase text-orange tracking-[0.2em] mb-2 drop-shadow-sm">
                                {item.ministry || 'Ministério'}
                            </span>
                            <h3 className="!text-white !text-2xl !font-bold mb-6 group-hover:text-orange transition-colors drop-shadow-lg">
                                {item.title}
                            </h3>

                            <div className="mt-auto pt-6 border-t border-white/10">
                                <p className="font-bold text-sm text-white/90 flex items-center gap-2 mb-6">
                                    <Clock size={14} className="text-orange" />
                                    {getWeekdayName(item.day_of_week)} às {item.time}
                                </p>
                                <button className="btnAccent w-full !rounded-xl !py-4 shadow-lg shadow-black/20 hover:shadow-orange/20 border-none">
                                    Adicionar ao Calendário
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TodayAtChurch;
