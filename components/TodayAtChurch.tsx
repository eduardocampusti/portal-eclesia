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
                <div key={idx} className="eventCard group">
                    <div className="flex flex-col h-full">
                        <span className="text-[10px] font-black uppercase text-orange tracking-[0.2em] mb-2">{item.ministry}</span>
                        <h3 className="!text-2xl !font-bold mb-6 group-hover:text-orange transition-colors">{item.title}</h3>

                        <div className="mt-auto pt-6 border-t border-slate-50">
                            <p className="!text-[#27432F] !font-bold !text-sm flex items-center gap-2 mb-6">
                                <Clock size={14} className="text-orange" /> {getWeekdayName(item.day)} às {item.time}
                            </p>
                            <button className="btnAccent w-full !rounded-xl !py-4 shadow-lg shadow-orange/10 hover:shadow-orange/20">
                                Adicionar ao Calendário
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
                    </div >
                </div >
            ))}
        </div >
    );
};

export default TodayAtChurch;
