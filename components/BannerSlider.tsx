
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Banner } from '../types';

interface BannerSliderProps {
    banners: Banner[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
    const [current, setCurrent] = useState(0);
    const activeBanners = banners.filter(b => b.active);

    useEffect(() => {
        if (activeBanners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % activeBanners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeBanners.length]);

    if (activeBanners.length === 0) return null;

    const next = () => setCurrent((current + 1) % activeBanners.length);
    const prev = () => setCurrent((current - 1 + activeBanners.length) % activeBanners.length);

    return (
        <div className="relative w-full aspect-video rounded-[40px] overflow-hidden group shadow-2xl shadow-blue-900/10 border border-slate-100 bg-white">
            {/* Slides */}
            <div className="relative w-full h-full">
                {activeBanners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                            }`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={banner.imageUrl}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient only if there is text content, otherwise clean image */}
                            {(banner.title || banner.subtitle) && (
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                            )}
                        </div>

                        {/* Content - Only render if there's text to avoid blocking art */}
                        {(banner.title || banner.subtitle || banner.linkUrl) && (
                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
                                <div className="space-y-4 max-w-lg mb-6 transform transition-all duration-700 delay-300 translate-y-0 opacity-100">
                                    {banner.title && (
                                        <h3 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-lg">
                                            {banner.title}
                                        </h3>
                                    )}
                                    {banner.subtitle && (
                                        <p className="text-lg text-slate-200 font-medium drop-shadow-md">
                                            {banner.subtitle}
                                        </p>
                                    )}
                                    {banner.linkUrl && (
                                        <div className="pt-4">
                                            <a
                                                href={banner.linkUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95"
                                            >
                                                Saiba Mais
                                                <ExternalLink size={18} />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Controls (Navigation) */}
            {activeBanners.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-10 left-12 flex items-center gap-2">
                        {activeBanners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`h-1.5 rounded-full transition-all ${index === current ? 'w-8 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default BannerSlider;
