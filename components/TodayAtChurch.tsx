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

    const activeSchedule = WEEKLY_SCHEDULE;

    // Grid Mode (Programação Semanal Institucional)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeSchedule.map((item, idx) => (
                <div key={idx} className="eventCard group !p-0 overflow-hidden flex flex-col">
                    <div className="p-8 pb-4">
                        <h3 className="!text-xl !font-bold mb-2 group-hover:text-orange transition-colors duration-500">{item.title}</h3>
                        <p className="text-sm !text-text-muted mb-1">{getWeekdayName(item.day)} - {item.time}</p>
                        <p className="text-xs font-semibold !text-orange uppercase tracking-wider">{item.ministry}</p>
                    </div>

                    <div className="relative h-48 mt-auto">
                        <img
                            src="/hero.jpg"
                            alt={item.title}
                            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-6 pt-10 bg-gradient-to-t from-white via-white/80 to-transparent">
                            <button className="btnAccent w-full !rounded-md !py-3 !text-[11px] !font-bold uppercase tracking-widest shadow-xl shadow-orange/20">
                                Adicionar ao Calendário <ChevronRight size={14} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TodayAtChurch;
