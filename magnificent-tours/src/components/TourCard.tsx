import React, { useState } from 'react';
import { SightseeingTour } from '../types';
import { Clock, Check, Plus, Minus, Landmark, Compass, Award, ExternalLink } from 'lucide-react';

interface TourCardProps {
  key?: any;
  tour: SightseeingTour;
  isSelected: boolean;
  onSelectToggle: (tourId: string, adults: number, children: number) => void;
  savedPax: { adults: number; children: number } | undefined;
  onViewDetails: (tour: SightseeingTour) => void;
}

export default function TourCard({ tour, isSelected, onSelectToggle, savedPax, onViewDetails }: TourCardProps) {
  const [adults, setAdults] = useState<number>(savedPax?.adults ?? 2);
  const [children, setChildren] = useState<number>(savedPax?.children ?? 0);
  const [isHovered, setIsHovered] = useState(false);

  const totalCalculated = adults * tour.pricePerAdult + children * tour.pricePerChild;

  const handleToggle = () => {
    onSelectToggle(tour.id, adults, children);
  };

  const updateAdults = (delta: number) => {
    const newVal = Math.max(1, adults + delta);
    setAdults(newVal);
    if (isSelected) {
      onSelectToggle(tour.id, newVal, children);
    }
  };

  const updateChildren = (delta: number) => {
    const newVal = Math.max(0, children + delta);
    setChildren(newVal);
    if (isSelected) {
      onSelectToggle(tour.id, adults, newVal);
    }
  };

  // Icon depending on category
  const getCategoryIcon = () => {
    switch (tour.category) {
      case 'Heritage':
        return <Landmark className="w-3.5 h-3.5 text-accent-amber" />;
      case 'Adventure':
        return <Compass className="w-3.5 h-3.5 text-emerald-mint" />;
      default:
        return <Award className="w-3.5 h-3.5 text-accent-amber" />;
    }
  };

  return (
    <div 
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tour Image Container */}
      <div className="relative h-64 overflow-hidden shrink-0">
        <img
          src={tour.image}
          alt={tour.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Dark overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

        {/* Categories */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-tropical-dark/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono tracking-wider text-white uppercase font-bold flex items-center gap-1.5 shadow-sm">
            {getCategoryIcon()}
            {tour.category}
          </span>
          <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-mono tracking-widest text-tropical-dark font-extrabold flex items-center gap-1 shadow-sm">
            <Clock className="w-3 h-3 text-emerald-deep" />
            {tour.duration}
          </span>
        </div>

        {/* Pricing tag */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-[10px] font-mono text-accent-amber uppercase tracking-widest font-bold">Premium Private Excursion</p>
          <h4 className="text-xl font-serif font-bold group-hover:text-accent-amber transition-colors duration-300 mt-0.5 leading-tight">{tour.name}</h4>
        </div>
      </div>

      {/* Main body info */}
      <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-2">
          <p className="text-xs text-emerald-deep/80 italic font-medium leading-relaxed">
            "{tour.tagline}"
          </p>
          <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
            {tour.description}
          </p>
          
          <button
            type="button"
            onClick={() => onViewDetails(tour)}
            className="text-xs font-semibold text-emerald-deep hover:text-emerald-mint inline-flex items-center gap-1 mt-2 focus:outline-none transition group/lnk"
          >
            <span>View Full Private Itinerary & Inclusions</span> 
            <ExternalLink className="w-3 h-3 group-hover/lnk:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Luxury Configurator and Select action */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Adult price counter */}
            <div className="flex items-center justify-between bg-sand-light px-3 py-2 rounded-xl border border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 font-mono uppercase font-bold">Adults</p>
                <p className="text-xs text-gray-700 font-bold">${tour.pricePerAdult} <span className="text-[9px] text-gray-400 font-normal">ea</span></p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateAdults(-1)}
                  disabled={adults <= 1}
                  className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 border border-gray-100 disabled:opacity-40"
                >
                  <Minus className="w-3 h-3 text-gray-600" />
                </button>
                <span className="text-xs font-bold text-gray-800 w-4 text-center">{adults}</span>
                <button
                  type="button"
                  onClick={() => updateAdults(1)}
                  className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 border border-gray-100"
                >
                  <Plus className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Child price counter */}
            <div className="flex items-center justify-between bg-sand-light px-3 py-2 rounded-xl border border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 font-mono uppercase font-bold">Kids (4-11)</p>
                <p className="text-xs text-gray-700 font-bold">${tour.pricePerChild} <span className="text-[9px] text-gray-400 font-normal">ea</span></p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateChildren(-1)}
                  disabled={children <= 0}
                  className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 border border-gray-100 disabled:opacity-40"
                >
                  <Minus className="w-3 h-3 text-gray-600" />
                </button>
                <span className="text-xs font-bold text-gray-800 w-4 text-center">{children}</span>
                <button
                  type="button"
                  onClick={() => updateChildren(1)}
                  className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 border border-gray-100"
                >
                  <Plus className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Total Indicator & Add to Cart button */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div>
              <span className="text-[9px] font-mono text-gray-400 uppercase block">Subtotal (Private Tour)</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold text-gray-800">${totalCalculated}</span>
                <span className="text-[10px] text-gray-400 font-mono">USD</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-mint ${
                isSelected 
                  ? 'bg-emerald-deep text-white border border-emerald-deep hover:bg-tropical-dark' 
                  : 'bg-transparent text-emerald-deep border-2 border-emerald-deep hover:bg-emerald-deep hover:text-white'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4 text-accent-amber stroke-[3]" />
                  Added!
                </>
              ) : (
                'Add Tour To Journey'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
