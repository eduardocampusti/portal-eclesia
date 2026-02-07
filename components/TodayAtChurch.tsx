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
        <div className="grid grid3">
            {activeSchedule.map((item, idx) => (
                <div key={idx} className="card h-full flex flex-col">
                    <span className="cardMeta">
                        {getWeekdayName(item.day)} • {item.time}
                    </span>
                    <h3 className="cardTitle font-bold !text-xl !font-sans !mb-2">{item.title}</h3>
                    <p className="text-sm italic text-slate-400 mb-6">{item.ministry}</p>

                    <div className="mt-auto">
                        <button className="btn btnSecondary w-full !text-xs !py-2.5">
                            <Plus size={14} /> Adicionar lembrete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TodayAtChurch;
