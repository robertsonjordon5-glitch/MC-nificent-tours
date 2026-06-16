import React, { useState, useMemo } from 'react';
import { AirportTransferZone, BookingDetails } from '../types';
import { AIRPORT_ZONES } from '../data';
import { Car, CheckCircle2, Info, Users, ArrowUpDown, ShieldCheck } from 'lucide-react';

interface TransferCalculatorProps {
  booking: BookingDetails;
  onChange: (details: Partial<BookingDetails>) => void;
}

export default function TransferCalculator({ booking, onChange }: TransferCalculatorProps) {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(booking.transferZoneId || 'zone1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentZone = useMemo(() => {
    return AIRPORT_ZONES.find(z => z.id === selectedZoneId) || AIRPORT_ZONES[0];
  }, [selectedZoneId]);

  // Unified list of hotels with their zones
  const allHotels = useMemo(() => {
    const list: Array<{ hotel: string; zoneId: string; zoneName: string }> = [];
    AIRPORT_ZONES.forEach(z => {
      z.hotels.forEach(h => {
        list.push({ hotel: h, zoneId: z.id, zoneName: z.name });
      });
    });
    return list;
  }, []);

  // Filtered hotels based on query
  const filteredHotels = useMemo(() => {
    if (!searchQuery) return currentZone.hotels;
    return allHotels
      .filter(item => item.hotel.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(item => item.hotel);
  }, [searchQuery, currentZone, allHotels]);

  // Calculate pricing
  const prices = useMemo(() => {
    const zone = currentZone;
    const pax = booking.transferPaxCount;
    
    let oneWay = zone.oneWayPrice4Pax;
    let roundTrip = zone.roundTripPrice4Pax;
    
    if (pax > 4) {
      const extraPax = pax - 4;
      oneWay += extraPax * zone.oneWayExtraPax;
      roundTrip += extraPax * zone.roundTripExtraPax;
    }
    
    return {
      oneWay,
      roundTrip,
      current: booking.tripType === 'one-way' ? oneWay : roundTrip
    };
  }, [currentZone, booking.transferPaxCount, booking.tripType]);

  const handleZoneChange = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setSearchQuery('');
    const zone = AIRPORT_ZONES.find(z => z.id === zoneId);
    onChange({
      transferZoneId: zoneId,
      hotelName: zone?.hotels[0] || '',
      customDestinationName: ''
    });
  };

  const handleHotelSelect = (hotelName: string) => {
    // If the hotel belongs to a different zone, switch the zone
    const hotelObj = allHotels.find(h => h.hotel === hotelName);
    if (hotelObj && hotelObj.zoneId !== selectedZoneId) {
      setSelectedZoneId(hotelObj.zoneId);
    }
    onChange({
      hotelName,
      customDestinationName: ''
    });
  };

  const handleCustomDestinationChange = (name: string) => {
    onChange({
      customDestinationName: name,
      hotelName: 'Custom Destination'
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100" id="transfer-estimator">
      {/* Mini header */}
      <div className="bg-gradient-to-r from-tropical-dark to-emerald-deep px-6 py-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
            <Car className="w-6 h-6 text-accent-amber" />
          </div>
          <div>
            <span className="text-xs font-mono text-accent-amber uppercase tracking-widest font-semibold">Luxury Travel Costing</span>
            <h3 className="text-xl font-serif font-semibold">MBJ Airport Private Transfer Calculator</h3>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-6">
        {/* Step 1: Destination Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Select Destination Coast / Zone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {AIRPORT_ZONES.map(z => (
                <button
                  type="button"
                  key={z.id}
                  onClick={() => handleZoneChange(z.id)}
                  className={`px-4 py-3 text-left rounded-xl text-xs font-medium transition-all duration-300 border ${
                    selectedZoneId === z.id
                      ? 'bg-tropical-dark border-accent-amber text-white shadow-md shadow-emerald-deep/10'
                      : 'bg-sand-light hover:bg-gray-100 text-gray-700 border-transparent'
                  }`}
                >
                  <p className="font-semibold text-accent-amber mb-0.5 truncate">{z.region}</p>
                  <p className="text-[10px] opacity-75 truncate">{z.name.split(':')[1]}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Hotel search/selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Luxury Resort Finder
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search all luxury resorts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-mint text-gray-800"
                />
              </div>

              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50 bg-white shadow-inner">
                {filteredHotels.length === 0 ? (
                  <p className="p-4 text-xs text-gray-500 italic">No direct matching resort found. Please type a custom destination below.</p>
                ) : (
                  filteredHotels.map(h => (
                    <button
                      type="button"
                      key={h}
                      onClick={() => handleHotelSelect(h)}
                      className={`w-full px-4 py-2 text-left text-xs transition duration-150 flex items-center justify-between ${
                        booking.hotelName === h
                          ? 'bg-emerald-deep text-white font-semibold'
                          : 'hover:bg-sand-light text-gray-700'
                      }`}
                    >
                      <span className="truncate">{h}</span>
                      {booking.hotelName === h && <CheckCircle2 className="w-3.5 h-3.5 text-accent-amber shrink-0 ml-2" />}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Custom hotel or alternate location details */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Destination Not Listed? Enter Custom Property
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Private Villa, Negril"
                  value={booking.customDestinationName}
                  onChange={(e) => handleCustomDestinationChange(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-mint text-gray-800"
                />
                <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                  We cover all private villas, Airbnb properties, and boutique docks. Choosing an alternate location in this zone will maintain the same fair rate tier!
                </p>
              </div>

              {/* Passenger count and trip type */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-mint" /> Travelers
                  </label>
                  <select
                    value={booking.transferPaxCount}
                    onChange={(e) => onChange({ transferPaxCount: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-mint text-gray-800 font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-emerald-mint" /> Service Type
                  </label>
                  <div className="flex rounded-xl bg-gray-100 p-0.5">
                    <button
                      type="button"
                      onClick={() => onChange({ tripType: 'one-way' })}
                      className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition ${
                        booking.tripType === 'one-way'
                          ? 'bg-white text-tropical-dark shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      One Way
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ tripType: 'round-trip' })}
                      className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition ${
                        booking.tripType === 'round-trip'
                          ? 'bg-white text-tropical-dark shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Round Trip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Zone Short Description */}
        <div className="p-4 bg-sand-light rounded-2xl flex items-start gap-3 border border-gray-200/50">
          <Info className="w-5 h-5 text-emerald-deep shrink-0 mt-0.5" />
          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-800">{currentZone.name}</p>
            <p className="leading-relaxed">{currentZone.description}</p>
            <p className="text-[10px] text-gray-500 italic mt-1 font-mono">
              Base rate includes 1-4 VIP guests. Extra passenger pricing of ${booking.tripType === 'one-way' ? currentZone.oneWayExtraPax : currentZone.roundTripExtraPax} USD each applies to groups larger than 4.
            </p>
          </div>
        </div>

        {/* Direct dynamic summary as a ticket */}
        <div className="relative border-t border-dashed border-gray-200 pt-6">
          {/* Half-circles for ticketing effect */}
          <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sand-light border-r border-gray-200"></div>
          <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sand-light border-l border-gray-200"></div>

          <div className="bg-gradient-to-br from-sand-light to-white p-5 rounded-2xl border border-gray-200/60 shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-emerald-deep/10 text-emerald-deep text-[10px] font-mono rounded-full font-bold mb-2">
                EXECUTIVE TRANSFER RESERVATION
              </span>
              <h4 className="font-serif font-semibold text-gray-800 text-base">
                {booking.customDestinationName || booking.hotelName || 'Selecting destination...'}
              </h4>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 font-medium">
                <span>Private Toyota Voxy or Executive Van</span> • <span>{booking.transferPaxCount} passengers</span> • <span className="capitalize text-emerald-deep font-semibold">{booking.tripType}</span>
              </p>
            </div>

            <div className="text-left md:text-right shrink-0">
              <span className="text-[10px] font-mono text-gray-400 block tracking-widest uppercase">Guaranteed Rate</span>
              <div className="flex items-baseline md:justify-end gap-1">
                <span className="text-2xl font-serif font-bold text-tropical-dark">${prices.current}</span>
                <span className="text-xs text-gray-400 font-mono">USD</span>
              </div>
              <p className="text-[9px] text-emerald-mint font-semibold flex items-center gap-1 justify-start md:justify-end mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-mint" /> No Hidden Resort Fees
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
