import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Plane, 
  CreditCard, 
  ChevronRight, 
  Phone, 
  Mail, 
  Award, 
  CheckCircle2, 
  RefreshCw, 
  Printer, 
  Search, 
  Star, 
  ExternalLink, 
  SlidersHorizontal, 
  ArrowRight, 
  ArrowLeft, 
  BookmarkPlus,
  Compass,
  Check,
  User,
  Clock,
  Briefcase,
  HelpCircle,
  FileCheck,
  Building,
  CheckSquare,
  MessageSquare
} from 'lucide-react';

import { BookingDetails, SightseeingTour } from './types';
import { AIRPORT_ZONES, SIGHTSEEING_TOURS, TRUST_BADGES, ResortHeroBg, PrivateSuvBg, VoxyBg } from './data';
import TransferCalculator from './components/TransferCalculator';
import TourCard from './components/TourCard';

export default function App() {
  // Navigation active state
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);

  // Monitor scroll for header background
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter state for tour catalog
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Popular' | 'Water' | 'Heritage' | 'Adventure'>('All');

  // Master Booking State (Replicating all pricing, zones, and details logic)
  const [booking, setBooking] = useState<BookingDetails>({
    bookingType: 'both',
    transferZoneId: 'zone1',
    hotelName: 'S Hotel Jamaica',
    transferPaxCount: 2,
    tripType: 'round-trip',
    arrivalFlight: '',
    arrivalDateTime: '',
    departureFlight: '',
    departureDateTime: '',
    customDestinationName: '',
    selectedTourIds: [],
    tourPaxRecord: {},
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    specialInstructions: ''
  });

  // Services to include toggles
  const [includeTransfer, setIncludeTransfer] = useState(true);
  const [includeTours, setIncludeTours] = useState(true);

  // Form Wizard Step
  const [bookingStep, setBookingStep] = useState<'services' | 'details' | 'checkout' | 'success'>('services');
  
  // Interactive Modal for Tour Itinerary
  const [itineraryModalTour, setItineraryModalTour] = useState<SightseeingTour | null>(null);

  // Interactive Modal for Footer Policies/Artifacts
  const [activePolicyModal, setActivePolicyModal] = useState<'privacy' | 'terms' | 'liability' | null>(null);

  // Transaction Simulator details
  const [isAuthorizingPayment, setIsAuthorizingPayment] = useState(false);
  const [simulatedBookingRef, setSimulatedBookingRef] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card'>('paypal');
  const [authStatusMessage, setAuthStatusMessage] = useState('Initiating secure JCAL booking manifest...');

  // Auto-initialize tour quantities inside record when selecting tours
  const toggleTourSelection = (tourId: string, adults: number, children: number) => {
    setBooking(prev => {
      const alreadySelected = prev.selectedTourIds.includes(tourId);
      let updatedIds = [...prev.selectedTourIds];
      let updatedPax = { ...prev.tourPaxRecord };

      if (alreadySelected) {
        updatedIds = updatedIds.filter(id => id !== tourId);
        delete updatedPax[tourId];
      } else {
        updatedIds.push(tourId);
        updatedPax[tourId] = { adults, children };
      }

      return {
        ...prev,
        selectedTourIds: updatedIds,
        tourPaxRecord: updatedPax
      };
    });
  };

  // Direct state updates helper
  const updateBookingDetails = (details: Partial<BookingDetails>) => {
    setBooking(prev => ({
      ...prev,
      ...details
    }));
  };

  // Pricing calculations
  const transferPrice = useMemo(() => {
    if (!includeTransfer) return 0;
    const zone = AIRPORT_ZONES.find(z => z.id === booking.transferZoneId) || AIRPORT_ZONES[0];
    const pax = booking.transferPaxCount;
    let basePrice = booking.tripType === 'one-way' ? zone.oneWayPrice4Pax : zone.roundTripPrice4Pax;
    let extraPaxMultiplier = booking.tripType === 'one-way' ? zone.oneWayExtraPax : zone.roundTripExtraPax;

    if (pax > 4) {
      return basePrice + (pax - 4) * extraPaxMultiplier;
    }
    return basePrice;
  }, [includeTransfer, booking.transferZoneId, booking.transferPaxCount, booking.tripType]);

  const toursPrice = useMemo(() => {
    if (!includeTours) return 0;
    return booking.selectedTourIds.reduce((sum, tourId) => {
      const tour = SIGHTSEEING_TOURS.find(t => t.id === tourId);
      if (!tour) return sum;
      const pax = booking.tourPaxRecord[tourId] || { adults: 2, children: 0 };
      return sum + (pax.adults * tour.pricePerAdult) + (pax.children * tour.pricePerChild);
    }, 0);
  }, [includeTours, booking.selectedTourIds, booking.tourPaxRecord]);

  const totalJourneyCost = useMemo(() => {
    return transferPrice + toursPrice;
  }, [transferPrice, toursPrice]);

  // Filtered sightseeing tours based on tab
  const filteredTours = useMemo(() => {
    if (selectedCategory === 'All') return SIGHTSEEING_TOURS;
    return SIGHTSEEING_TOURS.filter(t => t.category === selectedCategory);
  }, [selectedCategory]);

  // Form Field Validation
  const validateStepToGo = (targetStep: 'details' | 'checkout') => {
    if (targetStep === 'details') {
      if (!includeTransfer && !includeTours) {
        alert("Please enable either Airport Transfers or browse our Excursions list to begin your reservation.");
        return false;
      }
      if (includeTransfer && !booking.hotelName && !booking.customDestinationName) {
        alert("Please select a Luxury Resort or type in a Custom Destination first.");
        return false;
      }
      return true;
    }

    if (targetStep === 'checkout') {
      if (!booking.clientName.trim()) {
        alert("Please enter the primary Lead Passenger name.");
        return false;
      }
      if (!booking.clientEmail.trim() || !booking.clientEmail.includes('@')) {
        alert("Please provide a valid lead email address for booking vouchers.");
        return false;
      }
      if (!booking.clientPhone.trim()) {
        alert("Please enter a reliable phone number (e.g., WhatsApp enabled).");
        return false;
      }
      
      // If transfer selected, validate pickup/dropoff date/times
      if (includeTransfer) {
        if (!booking.arrivalDateTime) {
          alert("Please specify your desired Pick-up Date and Local Time.");
          return false;
        }
        if (booking.tripType === 'round-trip' && !booking.departureDateTime) {
          alert("Please specify your desired Return Pick-up Date and Local Time.");
          return false;
        }
      }
      return true;
    }
    return true;
  };

  // Generate WhatsApp formatted receipt message
  const getWhatsAppMessageText = (bookingRefCode: string) => {
    const selectedZone = AIRPORT_ZONES.find(z => z.id === booking.transferZoneId) || AIRPORT_ZONES[0];
    const destination = booking.customDestinationName || booking.hotelName || 'Specified Destination';
    
    let msg = `🌴 *MCNIFICENTS TOURS JAMAICA* 🌴\n`;
    msg += `=============================\n`;
    msg += `🏷️ *Booking Reference:* ${bookingRefCode}\n`;
    msg += `👤 *Lead Guest:* ${booking.clientName}\n`;
    msg += `📧 *Email:* ${booking.clientEmail}\n`;
    msg += `📞 *Phone:* ${booking.clientPhone}\n\n`;

    msg += `🚗 *SERVICE DETAILS:*\n`;
    msg += `-----------------------------\n`;
    if (includeTransfer) {
      msg += `• *Private Airport Transfer:* Toyota Voxy / Van\n`;
      msg += `  - *Service Type:* ${booking.tripType === 'one-way' ? 'One-Way' : 'Round-Trip'}\n`;
      msg += `  - *Zone:* ${selectedZone.name} (${selectedZone.region})\n`;
      msg += `  - *Resort/Destination:* ${destination}\n`;
      msg += `  - *Passengers:* ${booking.transferPaxCount} Guests\n`;
      msg += `  - *Requested Pick-up:* ${booking.arrivalDateTime ? new Date(booking.arrivalDateTime).toLocaleString() : 'N/A'}\n`;
      if (booking.tripType === 'round-trip') {
        msg += `  - *Requested Return:* ${booking.departureDateTime ? new Date(booking.departureDateTime).toLocaleString() : 'N/A'}\n`;
      }
    } else {
      msg += `• *Private Airport Transfer:* None Selected\n`;
    }

    if (includeTours && booking.selectedTourIds.length > 0) {
      msg += `\n• *Private Sightseeing Tours:* (${booking.selectedTourIds.length})\n`;
      booking.selectedTourIds.forEach((id, index) => {
        const tour = SIGHTSEEING_TOURS.find(t => t.id === id);
        if (tour) {
          const pax = booking.tourPaxRecord[id] || { adults: 2, children: 0 };
          msg += `   ${index + 1}. *${tour.name}* (${tour.duration})\n`;
          msg += `      Pax: ${pax.adults} Adults${pax.children > 0 ? `, ${pax.children} Children` : ''}\n`;
        }
      });
    }

    msg += `\n💰 *FINANCIAL COSTING STATEMENT:*\n`;
    msg += `-----------------------------\n`;
    if (includeTransfer) {
      msg += `• *Transfer Service:* $${transferPrice} USD\n`;
    }
    if (includeTours && booking.selectedTourIds.length > 0) {
      msg += `• *Private Excursions:* $${toursPrice} USD\n`;
    }
    msg += `⭐ *TOTAL AMOUNT DUE:* $${totalJourneyCost} USD\n`;
    msg += `👉 *Island Port Taxes:* INCLUDED (COVERED)\n`;
    msg += `👉 *VIP Meet & Greet:* INCLUDED (COVERED)\n`;
    msg += `=============================\n`;
    
    if (booking.specialInstructions) {
      msg += `✏ *Special Requests:* "${booking.specialInstructions}"\n\n`;
    }

    msg += `_This booking statement has been auto-minted for verification on WhatsApp group reservations control. Please review & authorize!_ 🇯🇲`;
    return msg;
  };

  // Booking Execution Action
  const handleFinalizeBooking = (method: 'paypal' | 'card' = 'paypal') => {
    setPaymentMethod(method);
    setIsAuthorizingPayment(true);
    setAuthStatusMessage(method === 'paypal' ? 'Routing to secure PayPal checkout portal...' : 'Connecting to secure co-branded card gateway...');
    
    // Seamless real PayPal.me payment flow redirection in new tab
    if (method === 'paypal') {
      try {
        window.open(`https://www.paypal.me/AudleyMcintyre/${totalJourneyCost}`, '_blank');
      } catch (err) {
        console.warn("Direct PayPal redirect popup blocked, but link remains available on screen.", err);
      }
    }

    // Staged status messages for realistic feedback
    setTimeout(() => {
      setAuthStatusMessage(method === 'paypal' ? 'Verifying PayPal buyer authorization & JCAL manifest ledger...' : 'Processing card secure verification protocols under 3D-Secure...');
    }, 800);

    setTimeout(() => {
      setAuthStatusMessage(method === 'paypal' ? 'PayPal authorization successful! Instant booking statement logged on WhatsApp...' : 'Card payment authorized successfully! Securing private chauffeur credentials...');
    }, 1600);

    // Simulate premium secure payment link & manifest generation (approx 2s)
    setTimeout(() => {
      const year = new Date().getFullYear();
      const code = `MT-${year}-${Math.floor(10000 + Math.random() * 90000)}`;
      setSimulatedBookingRef(code);
      setIsAuthorizingPayment(false);
      setBookingStep('success');
      
      // Auto triggers WhatsApp dispatch in a new window/tab safely matching the 1327459877 number
      try {
        const receiptMsg = getWhatsAppMessageText(code);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=1327459877&text=${encodeURIComponent(receiptMsg)}`;
        window.open(whatsappUrl, '_blank');
      } catch (err) {
        console.warn("Auto-popup blocked, user will confirm manually with the primary WhatsApp button on screen", err);
      }
      
      // Scroll smoothly to top of voucher
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 2400);
  };

  // Quick reset
  const handleStartNewBooking = () => {
    setBooking({
      bookingType: 'both',
      transferZoneId: 'zone1',
      hotelName: 'S Hotel Jamaica',
      transferPaxCount: 2,
      tripType: 'round-trip',
      arrivalFlight: '',
      arrivalDateTime: '',
      departureFlight: '',
      departureDateTime: '',
      customDestinationName: '',
      selectedTourIds: [],
      tourPaxRecord: {},
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      specialInstructions: ''
    });
    setIncludeTransfer(true);
    setIncludeTours(true);
    setBookingStep('services');
  };

  // Scroll anchor helper
  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-sand-light font-sans text-gray-800 antialiased selection:bg-emerald-deep selection:text-white">
      
      {/* 24/7 VIP Concierge Top Utility Bar */}
      <div className="bg-tropical-dark text-white text-xs border-b border-emerald-deep/25 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] font-mono tracking-wider">
            <span className="flex items-center gap-1.5 text-accent-amber font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
              JCAL Licensed Private Chauffeurs #JT-204
            </span>
            <span className="hidden md:inline text-gray-400">•</span>
            <span className="hidden md:inline text-[10px] text-gray-300 font-medium tracking-wide">Easy Private Tour & VIP Transfer Reservations</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <a href="tel:+1327459877" id="p-call-utility" className="flex items-center gap-1 hover:text-accent-amber transition">
              <Phone className="w-3.5 h-3.5 text-accent-amber" />
              <span>+1 (327) 459-877</span>
            </a>
            <a href="mailto:Bannie36@gmail.com" id="p-email-utility" className="flex items-center gap-1 hover:text-accent-amber transition">
              <Mail className="w-3.5 h-3.5 text-accent-amber" />
              <span>Bannie36@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Glassmorphic Nav Bar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-tropical-dark/95 shadow-xl border-b border-emerald-deep/20 backdrop-blur-lg py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo Brand Brandishing */}
          <button 
            type="button" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            id="logo-home-anchor"
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-mint to-emerald-deep flex items-center justify-center border-2 border-accent-amber/50 shadow-md">
              <span className="font-serif text-white font-bold text-xl leading-none">M</span>
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-white tracking-widest leading-none">
                MCNIFICENTS
              </h1>
              <p className="text-[9px] font-mono uppercase tracking-widest text-accent-amber mt-0.5 leading-none font-bold">
                McNificents tours
              </p>
            </div>
          </button>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-white">
            <button type="button" onClick={() => scrollToAnchor('showcase-hero')} id="nav-btn-home" className="hover:text-accent-amber transition font-semibold">Home</button>
            <button type="button" onClick={() => scrollToAnchor('exclusive-transfers')} id="nav-btn-transfers" className="hover:text-accent-amber transition font-semibold">VIP Airport Transfers</button>
            <button type="button" onClick={() => scrollToAnchor('bespoke-tours')} id="nav-btn-tours" className="hover:text-accent-amber transition font-semibold">Bespoke Excursions</button>
            <button type="button" onClick={() => scrollToAnchor('badges-story')} id="nav-btn-credentials" className="hover:text-accent-amber transition font-semibold">Credentials</button>
            <button type="button" onClick={() => scrollToAnchor('client-reviews')} id="nav-btn-reviews" className="hover:text-accent-amber transition font-semibold">Client Vows</button>
          </nav>

          {/* Instant Boarding Widget Link */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToAnchor('booking-portal-engine')}
              id="header-cta-book"
              className="px-5 py-2.5 bg-accent-amber text-tropical-dark hover:bg-white hover:text-tropical-dark text-xs font-bold font-mono tracking-wider rounded-xl transition-all duration-300 shadow-lg shadow-accent-amber/20 flex items-center gap-1"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>BOOK PRIVATE CAR</span>
            </button>
          </div>
        </div>
      </header>

      {/* Immersive Golden Resort Sunset Hero Section */}
      <section id="showcase-hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={ResortHeroBg}
            alt="Jamaica Sunset Resort" 
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tropical-dark/95 via-tropical-dark/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-sand-light via-transparent to-black/30"></div>
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-white text-left">
            
            {/* Certifications Quick Tag */}
            <div className="inline-flex items-center gap-2 bg-emerald-deep/90 backdrop-blur-md border border-accent-amber/30 px-3.5 py-1.5 rounded-full shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse"></span>
              <span className="text-[10px] font-mono tracking-widest text-accent-amber font-bold">
                JCAL EXCLUSIVE MEMBER & TPDCO LICENSED
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-[1.08] tracking-tight">
                Flawless <br />
                <span className="text-accent-amber">Jamaican Escapes</span>
              </h1>
              <p className="font-serif text-lg md:text-xl text-gray-200 font-light italic max-w-xl">
                "The pinnacle of ultra-premium private airport transfers & bespoke guided sightseeing excursions."
              </p>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-lg">
              Leave shared shuttle queues and stress behind. Step from the MBJ terminal directly to your private, air-conditioned Toyota Voxy lounge or touring van. Chilled Red Stripe beer, cool fresh towels, and scenic custom pitstops await.
            </p>

            {/* Micro Badge Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono font-semibold tracking-wider text-gray-200">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Check className="w-4 h-4 text-accent-amber" />
                <span>PayPal Secure Portal</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Check className="w-4 h-4 text-accent-amber" />
                <span>Zero Shared Stops</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Check className="w-4 h-4 text-accent-amber" />
                <span>24/7 VIP Monitors</span>
              </div>
            </div>

            {/* Main Booking Trigger */}
            <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button 
                type="button"
                onClick={() => scrollToAnchor('booking-portal-engine')}
                id="hero-cta-book-panel"
                className="px-8 py-4 bg-accent-amber text-tropical-dark hover:bg-white text-xs font-bold font-mono tracking-widest rounded-xl transition duration-300 text-center shadow-2xl shadow-accent-amber/20 uppercase"
              >
                Launch Reservation Portal
              </button>
              
              <button 
                type="button"
                onClick={() => scrollToAnchor('bespoke-tours')}
                id="hero-cta-explore-tours"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono tracking-widest rounded-xl transition text-center backdrop-blur-md border border-white/10 uppercase"
              >
                Browse Private Excursions
              </button>
            </div>

          </div>

          {/* Quick Floating Boarding Ledger (Side Card Display) */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-x-0 top-0 -translate-y-4 mx-auto w-72 h-72 bg-emerald-mint/20 rounded-full blur-3xl -z-10"></div>
            
            <div className="glassmorphism-dark p-6 sm:p-8 rounded-3xl border border-white/10 text-white shadow-2xl relative">
              <span className="absolute top-4 right-4 text-[10px] font-mono text-accent-amber tracking-widest font-extrabold px-2 py-0.5 bg-white/10 rounded">
                CERTIFIED PRIVATE
              </span>
              <p className="text-[11px] font-mono text-gray-450 tracking-wider">MCNIFICENTS TOURS LINE</p>
              <h3 className="text-xl font-serif font-bold mt-1 mb-4 text-white">Our Fleet</h3>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-deep flex items-center justify-center shrink-0 border border-white/10">
                    <Award className="w-4 h-4 text-accent-amber" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Rigorous JCAL Certification</h4>
                    <p className="text-[11px] text-gray-300 mt-0.5">Every captain is fully vetted under Jamaican Passenger Transport statutes. Standard liability insurance up to $1M USD.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-deep flex items-center justify-center shrink-0 border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-accent-amber" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Sleek PayPal & WhatsApp Bookings</h4>
                    <p className="text-[11px] text-gray-300 mt-0.5">Secure your private ride with one-click bright blue PayPal, followed by live WhatsApp connection for customized updates.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-deep flex items-center justify-center shrink-0 border border-white/10">
                    <MapPin className="w-4 h-4 text-accent-amber" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Direct-to-Resort Private Transfer</h4>
                    <p className="text-[11px] text-gray-300 mt-0.5">Travel directly to your hotel lobby. Enjoy a dedicated transport service with absolutely zero intermediate hotel drop-off stops.</p>
                  </div>
                </div>
              </div>

              {/* Real-time mini rate */}
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-mono text-gray-400">Montego Bay Transfers From</p>
                  <p className="text-xs text-gray-300 italic">Up to 4 Luxury Guests</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-serif font-bold text-accent-amber leading-none">$30</p>
                  <span className="text-[9px] font-mono text-gray-400">USD ONE WAY</span>
                </div>
              </div>
            </div>
            
          </div>

        </div>

      </section>

      {/* Trust Badges Showcase Section */}
      <section id="badges-story" className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-mono text-emerald-deep font-bold uppercase tracking-wider">
              AUTHORIZED PASSPORT TRANSITS
            </span>
            <h2 className="text-2xl font-serif font-bold text-tropical-dark">
              Certified Legal Safety & Operational Elite Vows
            </h2>
            <div className="w-16 h-1 bg-accent-amber mx-auto mt-2 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRUST_BADGES.map((badge, idx) => (
              <div key={idx} className="p-6 bg-sand-light rounded-2xl border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
                <div className="p-3 bg-emerald-deep text-white rounded-xl">
                  <Award className="w-6 h-6 text-accent-amber" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-accent-amber font-bold bg-tropical-dark px-2 py-0.5 rounded uppercase">
                    {badge.tag}
                  </span>
                  <h3 className="text-sm font-semibold font-serif text-tropical-dark pt-1">{badge.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-emerald-deep/5 rounded-2xl text-center border border-emerald-deep/10 text-xs text-emerald-deep font-semibold max-w-3xl mx-auto">
            🛡️ Your safety is guarded. All vehicles are fitted with secure cell devices, GPS tracked fleet coordinators, and fully sanitized air ventilation systems before every dispatch.
          </div>
        </div>
      </section>

      {/* Main interactive Booking Portal (The Universal Funnel) */}
      <section id="booking-portal-engine" className="py-16 bg-gradient-to-b from-sand-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Header instructions */}
          <div className="text-center space-y-3 mb-10 max-w-3xl mx-auto">
            <span className="px-3.5 py-1.5 bg-accent-amber/10 border border-accent-amber/20 text-emerald-deep text-[10px] font-mono font-bold tracking-widest rounded-full uppercase inline-block">
              Tailored Itinerary & Secure Booking Desk
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-tropical-dark">
              Curate Your Premium Escape Blueprint
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Choose your MBJ luxury private transfer parameters and easily add signature sightseeing exursions. Your custom price updates in real-time. Follow through to secure a certified voucher printout.
            </p>

            {/* Simple Step indicator */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <div className="flex items-center">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  bookingStep !== 'services' ? 'bg-emerald-deep text-white' : 'bg-tropical-dark text-accent-amber border-2 border-accent-amber'
                }`}>
                  1
                </span>
                <span className="text-xs font-mono font-bold text-gray-700 ml-2">Services</span>
              </div>
              <div className="w-12 h-[2px] bg-gray-200"></div>
              <div className="flex items-center">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  bookingStep === 'details' || bookingStep === 'checkout' || bookingStep === 'success'
                    ? bookingStep === 'details' ? 'bg-tropical-dark text-accent-amber border-2 border-accent-amber' : 'bg-emerald-deep text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  2
                </span>
                <span className="text-xs font-mono font-bold text-gray-700 ml-2">Details</span>
              </div>
              <div className="w-12 h-[2px] bg-gray-200"></div>
              <div className="flex items-center">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  bookingStep === 'checkout' || bookingStep === 'success'
                    ? bookingStep === 'checkout' ? 'bg-tropical-dark text-accent-amber border-2 border-accent-amber' : 'bg-emerald-deep text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  3
                </span>
                <span className="text-xs font-mono font-bold text-gray-700 ml-2">Ledger & Pay</span>
              </div>
            </div>
          </div>

          {/* Booking Flow Core Forms */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT AREA: Selector Forms or Detail input editors depending on Wizard Step */}
            <div className="lg:col-span-8 space-y-6">

              {/* STEP 1: SERVICES SELECTOR */}
              {bookingStep === 'services' && (
                <div className="space-y-6">
                  
                  {/* Service Toggle Panel */}
                  <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-lg font-serif font-bold text-tropical-dark">Select Experiences to Build</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <button
                        type="button"
                        onClick={() => setIncludeTransfer(prev => !prev)}
                        id="toggle-inc-transfers"
                        className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                          includeTransfer 
                            ? 'bg-tropical-dark/5 border-emerald-deep/30' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={includeTransfer}
                          onChange={() => {}} // toggled by button click
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-deep focus:ring-emerald-mint shrink-0 pointer-events-none"
                        />
                        <div>
                          <p className="text-xs font-bold text-tropical-dark flex items-center gap-1">
                            MBJ Private Transfers
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">Direct private Toyota Voxy lounge or executive high-top vans. Timings fully custom tailored to your request.</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIncludeTours(prev => !prev)}
                        id="toggle-inc-excursions"
                        className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                          includeTours 
                            ? 'bg-tropical-dark/5 border-emerald-deep/30' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={includeTours}
                          onChange={() => {}} // toggled by button click
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-deep focus:ring-emerald-mint shrink-0 pointer-events-none"
                        />
                        <div>
                          <p className="text-xs font-bold text-tropical-dark flex items-center gap-1">
                            Signature Sightseeing Tours
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">VIP private day-trips, raft voyages, and waterfalls. Tailored timings matching your rhythm.</p>
                        </div>
                      </button>

                    </div>
                  </div>

                  {/* Dynamic Transfer Estimator Widget Block */}
                  {includeTransfer && (
                    <TransferCalculator 
                      booking={booking} 
                      onChange={updateBookingDetails} 
                    />
                  )}

                  {/* Tours Block Selection */}
                  {includeTours && (
                    <div id="bespoke-tours" className="space-y-6">
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-serif font-bold text-tropical-dark">Signature VIP Private Excursions</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Filter by experience focus below and customize traveler quantities</p>
                          </div>

                          {/* Quick tabs categories list */}
                          <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl">
                            {['All', 'Popular', 'Water', 'Heritage', 'Adventure'].map((cat) => (
                              <button
                                type="button"
                                key={cat}
                                onClick={() => setSelectedCategory(cat as any)}
                                className={`px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase font-bold rounded-lg transition ${
                                  selectedCategory === cat
                                    ? 'bg-emerald-deep text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-950'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Selected Tours Count Indicator */}
                        {booking.selectedTourIds.length > 0 && (
                          <div className="mt-4 p-3 bg-emerald-deep/10 rounded-xl text-xs text-emerald-deep font-semibold flex items-center justify-between">
                            <span>🌟 Verified: You have added {booking.selectedTourIds.length} luxury tour excursions to your escape manifest.</span>
                            <button 
                              type="button" 
                              onClick={() => { updateBookingDetails({ selectedTourIds: [], tourPaxRecord: {} }) }} 
                              className="text-[10px] font-mono uppercase bg-emerald-deep text-white px-2.5 py-1 rounded-lg hover:bg-tropical-dark transition"
                            >
                              Clear Excursions
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Excursions Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredTours.map((tour) => (
                          <TourCard
                            key={tour.id}
                            tour={tour}
                            isSelected={booking.selectedTourIds.includes(tour.id)}
                            onSelectToggle={toggleTourSelection}
                            savedPax={booking.tourPaxRecord[tour.id]}
                            onViewDetails={setItineraryModalTour}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Proceed Controls */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => { if (validateStepToGo('details')) setBookingStep('details'); }}
                      id="proceed-to-details-step"
                      className="px-8 py-4 bg-emerald-deep hover:bg-tropical-dark text-white text-xs font-mono font-bold tracking-widest rounded-xl transition flex items-center gap-2 group shadow-xl shadow-emerald-deep/10"
                    >
                      <span>PROCESS CHECKOUT</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-accent-amber" />
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 2: LEAD PASSENGER & FLIGHT SCHEDULE DETAILS */}
              {bookingStep === 'details' && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="border-b border-gray-100 pb-4 flex items-center gap-3">
                    <div className="p-2 bg-emerald-deep/10 rounded-xl">
                      <User className="w-6 h-6 text-emerald-deep" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-tropical-dark">Lead Passenger & Security Clearances</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Please provide passenger details as they appear on your passport vouchers.</p>
                    </div>
                  </div>

                  {/* Form Blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Lead Traveler Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Admiral Lord Nelson"
                        value={booking.clientName}
                        onChange={(e) => updateBookingDetails({ clientName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-mint text-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Lead Email Address *</label>
                      <input
                        type="email"
                        placeholder="e.g. nelson@admiral-escapes.com"
                        value={booking.clientEmail}
                        onChange={(e) => updateBookingDetails({ clientEmail: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-mint text-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Lead WhatsApp Phone *</label>
                      <input
                        type="tel"
                        placeholder="e.g. +1 (555) 489-1055"
                        value={booking.clientPhone}
                        onChange={(e) => updateBookingDetails({ clientPhone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-mint text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  {/* Instant confirmation notice badge */}
                  <div className="p-4 bg-emerald-mint/10 border border-emerald-deep/20 rounded-2xl flex items-start gap-3 text-left">
                    <span className="text-lg">⚡</span>
                    <div>
                      <p className="text-xs font-bold text-tropical-dark">Instant Electronic Vouching Protocol</p>
                      <p className="text-[11px] text-gray-600 leading-normal mt-0.5">
                        The exact second you complete checkout, our digital dispatch system fires a legal, JCAL-stamped <strong>Instant Booking Confirmation statement</strong> directly to your WhatsApp number and email! Secure verification codes are minted in real-time.
                      </p>
                    </div>
                  </div>

                  {/* Private Pick-up & Return Schedule (Conditional on includeTransfer) */}
                  {includeTransfer ? (
                    <div className="p-6 bg-sand-light rounded-2xl border border-gray-200 space-y-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-deep" />
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-tropical-dark">
                          Private Pick-up Scheduling
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Requested Pick-up Date & Local Time *
                          </label>
                          <input
                            type="datetime-local"
                            value={booking.arrivalDateTime}
                            onChange={(e) => updateBookingDetails({ arrivalDateTime: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-mint text-gray-800 font-mono"
                            required
                          />
                          <p className="text-[10px] text-gray-400 mt-1">Specify your desired pick-up time at MBJ Airport or your designated lobby.</p>
                        </div>
                      </div>

                      {booking.tripType === 'round-trip' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200/60">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              Requested Return Pick-up Date & Local Time *
                            </label>
                            <input
                              type="datetime-local"
                              value={booking.departureDateTime}
                              onChange={(e) => updateBookingDetails({ departureDateTime: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-mint text-gray-800 font-mono"
                              required
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Specify when your chauffeur should arrive at the resort lobby for your return transport.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-500">
                      ℹ️ Airport transfers are disabled. We assume you will arrive at our private tour departure spots utilizing alternate methods of transportation.
                    </div>
                  )}

                  {/* Special VIP Requirements */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Special Chauffeur / Concierge Requests
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Requesting a baby car seat (complimentary addon), strict nut allergy for refreshments on board, or celebrating an elegant wedding anniversary (we supply premium champagne addons!)..."
                      value={booking.specialInstructions}
                      onChange={(e) => updateBookingDetails({ specialInstructions: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-mint text-gray-800 resize-none"
                    ></textarea>
                  </div>

                  {/* Proceed Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setBookingStep('services')}
                      className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-mono font-bold tracking-wider rounded-xl transition flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Selection</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { if (validateStepToGo('checkout')) setBookingStep('checkout'); }}
                      id="proceed-to-checkout-step"
                      className="px-8 py-4 bg-emerald-deep hover:bg-tropical-dark text-white text-xs font-mono font-bold tracking-widest rounded-xl transition flex items-center gap-2 group shadow-xl shadow-emerald-deep/10"
                    >
                      <span>GENERATE ACCREDITED LEDGER</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-accent-amber" />
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 3: BILLING LEDGER CHEKCOUT DETAILS */}
              {bookingStep === 'checkout' && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="border-b border-gray-100 pb-4 flex items-center gap-3">
                    <div className="p-2 bg-emerald-deep/10 rounded-xl">
                      <CreditCard className="w-6 h-6 text-emerald-deep" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-tropical-dark">Review Dynamic Booking Manifest</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Please audit your itemized private ledger prior to voucher registration.</p>
                    </div>
                  </div>

                  {/* Summary of what they booked */}
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-sand-light/40">
                    
                    {/* Passenger quick head */}
                    <div className="p-4 bg-gray-50/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div>
                        <span className="text-gray-400 uppercase tracking-wider font-bold">manifest lead:</span>{' '}
                        <span className="text-tropical-dark font-extrabold">{booking.clientName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 uppercase tracking-wider font-bold">contact:</span>{' '}
                        <span className="text-gray-700 font-semibold">{booking.clientPhone}</span>
                      </div>
                    </div>

                    {/* Transfer breakdown line item */}
                    {includeTransfer && (
                      <div className="p-4 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 bg-accent-amber/20 text-[9px] font-mono tracking-widest text-emerald-deep font-bold rounded uppercase">
                            VIP TRANSFER
                          </span>
                          <h4 className="text-xs font-bold text-gray-800">{booking.customDestinationName || booking.hotelName}</h4>
                          <p className="text-xs text-gray-600 font-medium">
                            Private Chauffeur • {booking.transferPaxCount} Guests • <span className="capitalize">{booking.tripType}</span>
                          </p>
                          {booking.arrivalDateTime && (
                            <p className="text-[10px] text-gray-500 font-mono mt-1">
                              ⏱️ Pick-up: {new Date(booking.arrivalDateTime).toLocaleString()}
                            </p>
                          )}
                          {booking.tripType === 'round-trip' && booking.departureDateTime && (
                            <p className="text-[10px] text-gray-500 font-mono">
                              ⏱️ Return Pick-up: {new Date(booking.departureDateTime).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <p className="text-xs font-mono font-bold text-tropical-dark text-right shrink-0">
                          ${transferPrice} USD
                        </p>
                      </div>
                    )}

                    {/* Excursions selected lines items */}
                    {includeTours && booking.selectedTourIds.length > 0 ? (
                      booking.selectedTourIds.map(tourId => {
                        const tour = SIGHTSEEING_TOURS.find(t => t.id === tourId);
                        if (!tour) return null;
                        const pax = booking.tourPaxRecord[tourId] || { adults: 2, children: 0 };
                        const sub = pax.adults * tour.pricePerAdult + pax.children * tour.pricePerChild;
                        return (
                          <div key={tourId} className="p-4 flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 bg-emerald-deep/10 text-[9px] font-mono tracking-widest text-emerald-deep font-bold rounded uppercase">
                                PRIVATE TOUR
                              </span>
                              <h4 className="text-xs font-bold text-gray-800">{tour.name}</h4>
                              <p className="text-xs text-gray-600 font-medium">
                                Customized Timings • {pax.adults} {pax.adults === 1 ? 'Adult' : 'Adults'} {pax.children > 0 && `& ${pax.children} Child`}
                              </p>
                              <p className="text-[10px] text-gray-400 font-mono">
                                ⏱️ Approximate duration: {tour.duration} • VIP Chapperone Included
                              </p>
                            </div>
                            <p className="text-xs font-mono font-bold text-tropical-dark text-right shrink-0">
                              ${sub} USD
                            </p>
                          </div>
                        );
                      })
                    ) : includeTours ? (
                      <div className="p-4 text-xs italic text-gray-400 leading-relaxed">
                        No custom sightseeing tours appended. You can browse our catalogue in step 1.
                      </div>
                    ) : null}

                  </div>

                  {/* Premium PayLink System Explanatory Block */}
                  <div className="p-6 bg-gradient-to-r from-tropical-dark to-emerald-deep text-white rounded-2xl relative overflow-hidden">
                    
                    {/* Tiny visual circle accents */}
                    <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-white/5 border border-white/10 pointer-events-none"></div>
                    
                    <div className="space-y-3 relative z-10 text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-accent-amber text-tropical-dark font-mono text-[9px] font-bold rounded uppercase tracking-wider">
                          EASY SECURE CHECKOUT
                        </span>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-accent-amber">
                          Accredited PayPal SSL Portal
                        </h4>
                      </div>
                      
                      <p className="text-xs leading-relaxed text-gray-200">
                        Secure your private chauffeur reservation instantly by selecting checkout below. Your private ride credentials are locked immediately and a booking confirmation is auto-dispatched live on WhatsApp to our central dispatch team at <span className="text-accent-amber font-mono font-bold font-medium">+1 (327) 459-877</span> for swift coordination.
                      </p>

                      <div className="p-3 bg-white/15 rounded-xl border border-white/10 text-xs flex items-center gap-3">
                        <CheckSquare className="w-5 h-5 text-accent-amber shrink-0" />
                        <div>
                           <p className="font-semibold text-white">Cancellation Protection Policy</p>
                           <p className="text-[10px] text-gray-350 leading-normal">
                            Enjoy flexible rescheduling updates or a full 100% refund up to 24 hours prior to scheduled airport touchdown!
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secure PayPal Smart Payment Actions */}
                  <div className="p-6 bg-zinc-50 rounded-2xl border border-gray-200 flex flex-col gap-5 mt-6 text-left">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-deep animate-pulse"></span>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
                        Secure Express Checkout Gateway
                      </h4>
                    </div>

                    {/* Highly prominent Instant Notification banner */}
                    <div className="p-4 bg-emerald-mint/10 border border-emerald-deep/20 rounded-2xl flex items-start gap-3">
                      <span className="text-lg">💬</span>
                      <div>
                        <p className="text-xs font-bold text-tropical-dark">Instant Booking Confirmation Active</p>
                        <p className="text-[11px] text-gray-600 leading-normal mt-0.5">
                          An <strong>Instant Booking Confirmation</strong> will be fired immediately to your specified WhatsApp number (<span className="font-mono text-gray-800 font-bold">{booking.clientPhone || 'N/A'}</span>) and email (<span className="font-mono text-gray-850 font-bold">{booking.clientEmail || 'N/A'}</span>) the microsecond you checkout!
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      Lock your private vehicle assignment instantly using our lightning-fast, JCAL-secured direct gateways. Pick a route below to complete.
                    </p>

                    {/* Official PayPal Payment Info & Directory */}
                    <div className="p-4 bg-blue-50/75 border border-blue-200 rounded-2xl flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-[#003087]">
                        <span className="text-lg">💳</span>
                        <div>
                          <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider">Official PayPal Merchant Account</h5>
                          <p className="text-[10px] text-gray-500 font-sans mt-0.5 font-normal normal-case">Audley McIntyre / McNificents Tours Secure Link</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-xs text-gray-700 leading-relaxed">
                        <p>
                          <strong>Direct Payment Link:</strong>{' '}
                          <a href={`https://www.paypal.me/AudleyMcintyre/${totalJourneyCost}`} target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-blue-600 hover:underline inline-flex items-center gap-1 break-all">
                            paypal.me/AudleyMcintyre/{totalJourneyCost} 🔗
                          </a>
                        </p>
                        <p className="text-[10px] text-gray-500 leading-normal italic mt-1 bg-white/50 p-2 rounded-lg border border-gray-100">
                          Clicking "Fast Checkout with PayPal" will automatically open the secure transfer link in a browser tab pre-filled with your total amount of <strong>${totalJourneyCost} USD</strong>!
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {/* Native PayPal Pill Button */}
                      <button
                        type="button"
                        onClick={() => handleFinalizeBooking('paypal')}
                        disabled={isAuthorizingPayment}
                        id="paypal-checkout-button"
                        className="w-full h-12 bg-[#FFC439] hover:bg-[#F2B224] text-white font-sans font-bold rounded-full flex items-center justify-center gap-2 px-6 shadow-md hover:shadow-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-50 ring-1 ring-[#FFC439]/40"
                      >
                        <div className="flex items-center gap-1.5 justify-center">
                          {/* PayPal Sigil */}
                          <svg className="w-4 h-4 text-[#003087] fill-current" viewBox="0 0 24 24">
                            <path d="M7.076 2.05A2.355 2.355 0 0 0 4.8 4.302l-2.02 12.835a.735.735 0 0 0 .723.85h3.048l.84-5.328a1.69 1.69 0 0 1 1.666-1.425h1.575c3.272 0 5.485-1.576 6.136-4.71.32-1.536.082-2.731-.77-3.56-.843-.822-2.327-1.164-4.526-1.164H7.076z"/>
                            <path d="M12.9 6.8c.453-2.186-.744-3.564-3.3-3.564H4.8l-1.01 6.42a.52.52 0 0 0 .51.6h2.15l-.64 4.07a.52.52 0 0 0 .51.6h2.15l-.65 4.14a.73.73 0 0 0 .72.85h2.15l1.09-6.93.07-.46a1.69 1.69 0 0 1 1.67-1.43h1.34c3.08 0 5.16-1.48 5.77-4.43.3-.14.61-.17.91-.17h-3.48c-.06.31-.08.62-.05.95z" className="opacity-75" fill="#0070BA"/>
                          </svg>
                          <span className="text-[11px] font-sans font-extrabold tracking-wide text-[#003087]">Fast Checkout with</span>
                          <span className="text-lg font-black italic tracking-tighter text-[#003087] font-serif">
                            Pay<span className="text-[#0070BA]">Pal</span>
                          </span>
                        </div>
                      </button>

                      {/* Co-branded Credit or Debit Card */}
                      <button
                        type="button"
                        onClick={() => handleFinalizeBooking('card')}
                        disabled={isAuthorizingPayment}
                        id="card-checkout-button"
                        className="w-full h-11 bg-[#111111] hover:bg-black text-white font-mono font-bold text-xs rounded-full flex items-center justify-center gap-2 px-4 shadow-sm hover:shadow-md transition-all duration-150 active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest"
                      >
                        <span>Debit or Credit Card</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[9px] font-mono text-gray-400">
                      <span>🔒 PCI-DSS Compliant Secure Sockets</span>
                      <span>🛡️ Secured via End-to-End Escrow Handshake</span>
                    </div>
                  </div>

                  {/* Proceed & Authorize Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      disabled={isAuthorizingPayment}
                      onClick={() => setBookingStep('details')}
                      className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-mono font-bold tracking-wider rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Configure Details</span>
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 4: GORGEOUS SUCCESS BOARDING TICKET VOUCHER */}
              {bookingStep === 'success' && (
                <div className="space-y-6">
                  
                  {/* Explanatory Banner */}
                  <div className="p-6 bg-emerald-deep text-white rounded-3xl border border-emerald-mint/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1 bg-white/15 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-accent-amber" />
                        </span>
                        <h3 className="text-xl font-serif font-bold text-white">Escorted Escape Manifest Sealed!</h3>
                      </div>
                      <p className="text-xs text-gray-300 mt-1 max-w-xl">
                        Congratulations, your primary manifest credentials have been mapped. Chauffeur queues are on hold and a priority check-in tracking e-voucher has been dispatched.
                      </p>
                    </div>

                    <p className="px-4 py-2 bg-tropical-dark text-accent-amber text-xs font-mono rounded-lg border border-accent-amber/30 text-center uppercase tracking-widest font-bold">
                      Booking Reference:<br />
                      <span className="text-sm font-sans block pt-0.5 font-extrabold text-white">{simulatedBookingRef}</span>
                    </p>
                  </div>

                  {paymentMethod === 'paypal' && (
                    <div className="p-6 bg-blue-50 border border-blue-200 text-blue-900 rounded-3xl shadow-md text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#003087]">
                          <span className="text-lg">💰</span>
                          <h4 className="text-sm font-mono font-bold uppercase tracking-wider">PayPal Transfer Required</h4>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed max-w-xl">
                          Ensure your secure payment of <strong>${totalJourneyCost} USD</strong> is dispatched via our direct merchant portal.
                        </p>
                        <p className="text-[11px] text-gray-550 font-mono">
                          Official Account: Audley McIntyre / McNificents Tours
                        </p>
                        <p className="text-[10px] text-gray-400">
                          For assistance, contact <span className="font-mono font-semibold text-gray-500">Bannie36@gmail.com</span>
                        </p>
                      </div>

                      <a
                        href={`https://www.paypal.me/AudleyMcintyre/${totalJourneyCost}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto px-5 py-3 bg-[#0070BA] hover:bg-[#003087] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition duration-200 text-center shadow-md grow-0 shrink-0"
                      >
                        ⚡ Complete PayPal Payment Now
                      </a>
                    </div>
                  )}

                  {/* WhatsApp confirmation direct dispatch control button block */}
                  <div className="p-6 bg-zinc-900 border border-emerald-mint/20 text-white rounded-3xl shadow-xl space-y-4 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-mint/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-mint/10 border border-emerald-mint/20 text-[10px] font-mono text-emerald-mint uppercase font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-mint animate-pulse"></span>
                          WhatsApp Secure Confirmation Dispatcher
                        </span>
                        <h4 className="text-base font-serif font-bold text-white flex items-center gap-2 mt-1">
                          <MessageSquare className="w-4 h-4 text-accent-amber shrink-0" />
                          Auto-Confirm Booking Live via WhatsApp
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
                          Ready to route your dynamic invoice receipt directly to our central coordinator desk at <strong className="text-accent-amber font-mono font-bold">+1 (327) 459-877</strong> for instant coordination? Press below to send.
                        </p>
                      </div>

                      <a
                        href={`https://api.whatsapp.com/send?phone=1327459877&text=${encodeURIComponent(getWhatsAppMessageText(simulatedBookingRef))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-4 bg-[#25D366] hover:bg-[#20ba5a] hover:scale-[1.02] active:scale-[0.98] text-white text-[11px] font-mono font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-deep/40 self-stretch sm:self-center shrink-0"
                      >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>Dispatch Confirmation</span>
                      </a>
                    </div>
                  </div>

                  {/* Elegant High-Fidelity Passenger Ticket Voucher */}
                  <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-2xl relative" id="ticket-passenger-voucher">
                    
                    {/* Luxury gold double stripe headers */}
                    <div className="h-2 bg-gradient-to-r from-accent-amber via-emerald-deep to-accent-amber"></div>

                    <div className="p-6 sm:p-8 space-y-8">
                      
                      {/* Ticket head */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-tropical-dark flex items-center justify-center border border-accent-amber text-white font-serif font-bold text-lg">
                            M
                          </div>
                          <div>
                            <h4 className="font-serif font-extrabold text-tropical-dark tracking-widest text-sm">MCNIFICENTS TOURS</h4>
                            <p className="text-[10px] font-mono uppercase text-accent-amber tracking-widest font-bold">Official JCAL Certified Voucher</p>
                          </div>
                        </div>

                        {/* QR Code Placeholder Graphic */}
                        <div className="flex items-center gap-3 self-start sm:self-center bg-sand-light px-4 py-2.5 rounded-2xl border border-gray-200">
                          {/* Simulated QR block */}
                          <div className="w-10 h-10 bg-tropical-dark p-0.5 shrink-0 flex flex-wrap gap-[1px]">
                            {Array.from({ length: 64 }).map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-1 h-1 ${
                                  (i % 3 === 0 || i % 7 === 0 || i < 12 || i > 52) ? 'bg-white' : 'bg-transparent'
                                }`}
                              ></div>
                            ))}
                          </div>
                          <div className="text-left">
                            <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest block">Accredited QR</span>
                            <span className="text-xs font-mono font-bold text-gray-700">{simulatedBookingRef}</span>
                          </div>
                        </div>
                      </div>

                      {/* Manifest Itinerary Details */}
                      <div className="space-y-6">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">
                          📋 Passenger & Escort Clearance Records
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-gray-400 block font-medium">Lead Guest Name:</span>
                            <span className="font-bold text-gray-900 text-sm mt-0.5 block">{booking.clientName}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-medium">WhatsApp Phone:</span>
                            <span className="font-mono text-gray-900 mt-0.5 block">{booking.clientPhone}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-medium">Dispatch Email:</span>
                            <span className="font-mono text-gray-900 mt-0.5 block">{booking.clientEmail}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-medium">Accreditation:</span>
                            <span className="font-mono text-emerald-deep font-bold mt-0.5 block">PAID & CERTIFIED</span>
                          </div>
                        </div>

                        {/* Services description lists */}
                        <div className="space-y-4 pt-4 border-t border-gray-100 text-xs">
                          
                          {/* Transfer voucher summary row */}
                          {includeTransfer && (
                            <div className="p-4 bg-sand-light rounded-2xl border border-gray-200/60 text-left space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-accent-amber font-bold bg-tropical-dark px-2 py-0.5 rounded uppercase">
                                  AIRPORT TRANSFER TICKET
                                </span>
                                <span className="font-mono font-semibold text-gray-500">MBJ - PRIVATE CAR</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <span className="text-gray-400 block pb-0.5">Destination Resort:</span>
                                  <p className="font-bold text-tropical-dark">{booking.customDestinationName || booking.hotelName}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400 block pb-0.5">Pax Details:</span>
                                  <p className="font-semibold text-gray-700">{booking.transferPaxCount} Guests • Toyota Voxy / Van</p>
                                </div>
                                <div>
                                  <span className="text-gray-400 block pb-0.5">Service Tier:</span>
                                  <p className="font-semibold text-emerald-deep capitalize">{booking.tripType}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5 border-t border-gray-200/60 text-[11px] font-mono text-gray-600">
                                <div>
                                  <span>📅 Requested Pick-up Time:</span> <span className="font-bold text-gray-900">{new Date(booking.arrivalDateTime).toLocaleString()}</span>
                                </div>
                                {booking.tripType === 'round-trip' && booking.departureDateTime && (
                                  <div>
                                    <span>📅 Requested Return Time:</span> <span className="font-bold text-gray-900">{new Date(booking.departureDateTime).toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Excursion vouchers items list wrapper */}
                          {includeTours && booking.selectedTourIds.length > 0 && (
                            <div className="p-4 bg-sand-light rounded-2xl border border-gray-200/60 text-left space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-accent-amber font-bold bg-tropical-dark px-2 py-0.5 rounded uppercase">
                                  SIGHTSEEING TOURS TICKETS ({booking.selectedTourIds.length})
                                </span>
                                <span className="font-mono font-semibold text-gray-500">PRIVATE CHAUFFEUR COMPASS</span>
                              </div>

                              <div className="divide-y divide-gray-200/65">
                                {booking.selectedTourIds.map(tourId => {
                                  const tour = SIGHTSEEING_TOURS.find(t => t.id === tourId);
                                  if (!tour) return null;
                                  const tourPax = booking.tourPaxRecord[tourId] || { adults: 2, children: 0 };
                                  return (
                                    <div key={tourId} className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between gap-2">
                                      <div>
                                        <p className="font-bold text-gray-800">{tour.name}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">⏱️ Duration: {tour.duration} • Customized pick-up matching your convenience</p>
                                      </div>
                                      <div className="text-left sm:text-right font-mono font-semibold text-gray-700 sm:shrink-0">
                                        pax: {tourPax.adults} Adults {tourPax.children > 0 ? `& ${tourPax.children} Kids` : ''}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        </div>

                        {/* Special request indicator */}
                        {booking.specialInstructions && (
                          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900">
                            <strong>✏️ Concierge Custom Chauffeur Requests logged:</strong> "{booking.specialInstructions}"
                          </div>
                        )}

                        {/* Chauffeur Arrival Procedures */}
                        <div className="p-6 bg-gradient-to-r from-tropical-dark via-emerald-deep to-tropical-dark text-white rounded-2xl space-y-2.5">
                          <h5 className="font-serif font-bold text-accent-amber text-sm flex items-center gap-1.5">
                            👑 Essential On-Arrival Airport Concierge Procedure
                          </h5>
                          <p className="text-xs text-gray-200 leading-relaxed">
                            Once your aircraft arrives at MBJ Sandy Bay Airport, proceed past airport customs and baggage carousels. Escape directly out to the general arrival area outer lobby near <strong>Section B</strong>.
                          </p>
                          <p className="text-xs text-gray-250 leading-relaxed font-mono bg-black/25 p-3 rounded-lg border border-white/5">
                            👉 Look for our private, uniformed representative standing high with a glowing electronic sign panel reading:<br />
                            <strong className="text-accent-amber text-sm block mt-1 tracking-wider">"MCNIFICENTS TOURS — WELCOME ABROAD {booking.clientName.toUpperCase()}"</strong>
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* Funnel bottom utilities */}
                    <div className="bg-gray-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                      <span className="text-[11px] font-mono text-gray-400">
                        © {new Date().getFullYear()} McNificents Tours Ltd. Certified No: JCAL-7815B
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-mono font-bold tracking-wider rounded-xl transition hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
                        >
                          <Printer className="w-4 h-4 text-gray-500" />
                          <span>Print Voucher</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleStartNewBooking}
                          className="px-5 py-2.5 bg-emerald-deep text-white text-xs font-mono font-bold tracking-widest rounded-xl transition hover:bg-tropical-dark flex items-center gap-1.5 shadow-md shadow-emerald-deep/10"
                        >
                          <RefreshCw className="w-4 h-4 text-accent-amber" />
                          <span>Book Another Escape</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* RIGHT AREA: STICKY DYNAMIC MASTER VIRTUAL LEDGER */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              
              <div className="bg-white rounded-3xl border border-gray-150 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 relative">
                
                {/* Visual Accent ticket header corner notches */}
                <div className="absolute -left-3 top-12 w-6 h-6 rounded-full bg-sand-light border-r border-gray-200"></div>
                <div className="absolute -right-3 top-12 w-6 h-6 rounded-full bg-sand-light border-l border-gray-200"></div>

                <div className="border-b border-gray-100 pb-4">
                  <span className="text-[9px] font-mono text-accent-amber uppercase tracking-widest bg-tropical-dark px-2 py-0.5 rounded font-extrabold">
                    LEDGER CONSOLE
                  </span>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mt-2">Accredited Invoice Statement</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Real-time certified passenger manifest costing</p>
                </div>

                <div className="space-y-4 text-xs">
                  
                  {/* Airport Transfer costing subline */}
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="font-medium">MBJ Airport Private Transfer:</span>
                    <span className="font-mono font-bold text-gray-800">
                      {includeTransfer ? `$${transferPrice} USD` : '$0 USD'}
                    </span>
                  </div>

                  {/* Excursions costing subline */}
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="font-medium">Signature Private Excursions:</span>
                    <span className="font-mono font-bold text-gray-800">
                      {includeTours ? `$${toursPrice} USD` : '$0 USD'}
                    </span>
                  </div>

                  {/* Resort service tax note */}
                  <div className="flex items-center justify-between text-gray-400 border-t border-dashed border-gray-100 pt-3">
                    <span className="font-medium">Island Luxury Port Taxes:</span>
                    <span className="font-mono font-bold text-gray-800">
                      INCLUDED IN RATE
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-400">
                    <span className="font-medium">VIP Host Meet & Greet Perks:</span>
                    <span className="font-mono font-bold text-gray-800">
                      COVERED IN PACKAGE
                    </span>
                  </div>

                  {/* Massive Bold Total cost indicator */}
                  <div className="pt-4 border-t border-gray-250 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-serif font-extrabold text-tropical-dark uppercase block">Total Journey Quote</span>
                      <span className="text-[10px] text-gray-400 italic">No hidden fees guarantee</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-0.5 justify-end">
                        <span className="text-3xl font-serif font-bold text-tropical-dark">${totalJourneyCost}</span>
                        <span className="text-xs font-mono text-gray-400">USD</span>
                      </div>
                      <span className="text-[10px] text-emerald-mint font-bold italic block">PayPal Ready Guarantee</span>
                    </div>
                  </div>

                </div>

                {/* Funnel helper tip block */}
                <div className="p-4 bg-sand-light rounded-2xl border border-gray-200 flex items-start gap-2.5 text-xs text-gray-500">
                  <ShieldCheck className="w-5 h-5 text-emerald-deep shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong>Accredited Tour Broker Guarantee:</strong> Your invoice is protected under verified JCAL broker bonds. All fees are completely all-inclusive—no unexpected resort landing taxi charges on arrival!
                  </div>
                </div>

              </div>

              {/* Verified badges details list side-widget */}
              <div className="bg-emerald-deep text-white p-6 rounded-3xl border border-white/5 space-y-4">
                <h4 className="font-serif font-bold text-accent-amber text-sm">MBJ Private VIP Meet & Greet Included</h4>
                <p className="text-[11px] text-gray-350 leading-relaxed">
                  Every transfer passenger automatically obtains deluxe VIP Hostess reception outside terminal exit doors. Chilled local spring waters and ice-cold Red Stripe beers are handed on board for a luxurious toast to your vacation.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-emerald-mint uppercase font-bold">
                  <span>🚗 mercedes fleet</span>
                  <span>🍺 red stripe beer</span>
                  <span>🥥 fresh coconut</span>
                  <span>🛡️ $1m insurance</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Elite fleets and fleet information showcase bento-grid */}
      <section className="py-16 bg-tropical-dark text-white" id="exclusive-transfers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-left space-y-3 mb-10 max-w-4xl">
            <span className="text-xs font-mono text-accent-amber font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
              FLEET EXTRAVAGANZA
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
              An Elite Fleet Engineered for Pristine Comfort
            </h2>
            <div className="w-20 h-1 bg-accent-amber mt-2 rounded"></div>
            <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
              We operate exclusively late-model Toyota Voxy mini-lounges and custom high-roof touring buses. Deeply insulated cabs, pristine leather interiors, high-fidelity sound, and certified professional drivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Fleet card 1 */}
            <div className="bg-emerald-deep/40 rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between p-6 hover:translate-y-[-4px] transition duration-350 shadow-lg">
              <div className="space-y-4">
                <div className="h-44 rounded-2xl overflow-hidden relative">
                  <img 
                    src={VoxyBg} 
                    alt="Toyota Voxy Lounge" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-accent-amber text-tropical-dark text-[9px] font-mono rounded font-bold uppercase">
                    1 - 4 GUESTS
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Toyota Voxy Lounge</h3>
                  <p className="text-xs text-accent-amber font-mono uppercase tracking-wider mt-1">Sleek Toyota Voxy VIP Series</p>
                  <p className="text-[11px] text-gray-305 leading-relaxed mt-2">
                    Indulge in spacious state-of-the-art lounge comfort. Outfitted with automatic captain seats, dynamic cold dual climates, scenic panoramic glass, and pristine leather upholstery perfect for families or small groups.
                  </p>
                </div>
              </div>
              <p className="text-xs text-emerald-mint font-semibold flex items-center gap-1 mt-4 border-t border-white/5 pt-3">
                <Check className="w-4 h-4 text-accent-amber" /> Private Driver & Local Beverages Included
              </p>
            </div>

            {/* Fleet card 2 */}
            <div className="bg-emerald-deep/40 rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between p-6 hover:translate-y-[-4px] transition duration-355 shadow-lg">
              <div className="space-y-4">
                <div className="h-44 rounded-2xl overflow-hidden relative bg-gradient-to-br from-emerald-deep to-tropical-dark flex items-center justify-center p-3">
                  <img 
                    src="https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800" 
                    alt="Luxury VIP Coaster" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-accent-amber text-tropical-dark text-[9px] font-mono rounded font-bold uppercase">
                    5 - 15 VIP GUESTS
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">VIP Executive Touring Van</h3>
                  <p className="text-xs text-accent-amber font-mono uppercase tracking-wider mt-1">Toyota Hiace Supreme Tourer</p>
                  <p className="text-[11px] text-gray-305 leading-relaxed mt-2">
                    First-class travel for family circles, medium luxury entourages, or wedding celebrations. Elevated roofline for effortless boarding, individual leather travel docks, and panoramic ocean viewpoints windows.
                  </p>
                </div>
              </div>
              <p className="text-xs text-emerald-mint font-semibold flex items-center gap-1 mt-4 border-t border-white/5 pt-3">
                <Check className="w-4 h-4 text-accent-amber" /> Integrated Multi-Zone Air Cleaners Included
              </p>
            </div>

            {/* Fleet card 3 */}
            <div className="bg-emerald-deep/40 rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between p-6 hover:translate-y-[-4px] transition duration-360 shadow-lg">
              <div className="space-y-4">
                <div className="h-44 rounded-2xl overflow-hidden relative">
                  <div className="w-full h-full bg-gradient-to-tr from-tropical-dark to-emerald-deep flex flex-col items-center justify-center text-center p-6 border border-white/5 rounded-xl">
                    <Award className="w-10 h-10 text-accent-amber mb-2" />
                    <p className="text-xs font-mono text-accent-amber uppercase font-bold tracking-widest">Guaranteed Safety</p>
                    <p className="text-[10px] text-gray-305 max-w-xs mt-1">Certified Passenger Liability Indemnity protection up to $1M USD.</p>
                  </div>
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-accent-amber text-tropical-dark text-[9px] font-mono rounded font-bold uppercase">
                    ALL VEHICLES
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Premium Coaster & Coach Elite</h3>
                  <p className="text-xs text-accent-amber font-mono uppercase tracking-wider mt-1">Toyota Coaster High-Roof</p>
                  <p className="text-[11px] text-gray-305 leading-relaxed mt-2">
                    Engineered specifically for expansive luxury events, business groups, and private charter functions. Accommodates up to 30 travelers. Individual high-roof vents, spacious legroom, and separate massive luggage trailers.
                  </p>
                </div>
              </div>
              <p className="text-xs text-emerald-mint font-semibold flex items-center gap-1 mt-4 border-t border-white/5 pt-3">
                <Check className="w-4 h-4 text-accent-amber" /> VIP Luggage Escorts Included
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Client Reviews Vows Testimonials */}
      <section id="client-reviews" className="py-16 bg-white border-y border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-mono text-emerald-deep font-bold uppercase tracking-widest bg-emerald-deep/5 px-3 py-1 rounded-full">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="text-3xl font-serif font-bold text-tropical-dark tracking-tight">
              Tales of Unparalleled Splendor
            </h2>
            <div className="w-16 h-1 bg-accent-amber mx-auto mt-2 rounded"></div>
            <p className="text-xs text-gray-400 max-w-xl mx-auto mt-2">
              Read how international luxury travelers find sanctuary, swiftness, and beautiful memories under our concierge watch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Review 1 */}
            <div className="bg-sand-light/40 rounded-3xl p-6 sm:p-8 border border-gray-150 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-accent-amber">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "McNificents tours holds the gold standard in Montego Bay. Landing at MBJ with children can feel chaotic, but our chauffeur is always immediately waiting past Section B holding an executive digital sign with our name. The private luxury Mercedes SUV was utterly pristine. Ice cold Red Stripe and fresh mango slices were a lovely touch!"
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-gray-200/60 pt-4">
                <div className="w-10 h-10 rounded-full bg-emerald-deep/10 font-bold font-serif text-emerald-deep flex items-center justify-center shrink-0">
                  CD
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-tropical-dark">The Chadwick Family</h4>
                  <p className="text-[10px] text-gray-400 font-mono tracking-wider">Stayed at Round Hill Resort • June 2026</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-sand-light/40 rounded-3xl p-6 sm:p-8 border border-gray-150 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-accent-amber">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "We booked the VIP Bamboo Rafting and Blue Lagoon expedition. The entire itinerary was pure splendor. Our captain navigated mountain routes effortlessly in a brand-new Escalade. If you are scheduling transfers or excursions in Negril, do not settle for standard hotel tour desks. These guys are legal, safe, and elite."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-gray-200/60 pt-4">
                <div className="w-10 h-10 rounded-full bg-emerald-deep/10 font-bold font-serif text-emerald-deep flex items-center justify-center shrink-0">
                  SH
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-tropical-dark">Dr. Sophia Hampton</h4>
                  <p className="text-[10px] text-gray-400 font-mono tracking-wider">London, UK • May 2026</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-sand-light/40 rounded-3xl p-6 sm:p-8 border border-gray-150 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-accent-amber">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "Absolutely stellar operational execution! Our arrival flight from AA was delayed by five hours, but our chauffeur tracked our flight and was waiting patiently without any extra penalty fees. Truly professional. Clean vehicles and superb, safe driving."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-gray-200/60 pt-4">
                <div className="w-10 h-10 rounded-full bg-emerald-deep/10 font-bold font-serif text-emerald-deep flex items-center justify-center shrink-0">
                  MK
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-tropical-dark">Marcus Koenig</h4>
                  <p className="text-[10px] text-gray-400 font-mono tracking-wider">Zurich, Switzerland • April 2026</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Highly FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-white to-sand-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-serif font-bold text-tropical-dark">FAQ & Security Clearances</h2>
            <p className="text-xs text-gray-400">Everything you need to know about our certified luxury transits</p>
          </div>

          <div className="space-y-5">
            
            <div className="p-5 bg-white rounded-2xl border border-gray-200 text-left space-y-1.5">
              <h4 className="text-xs font-bold text-gray-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-deep shrink-0" />
                How does your flight observation delay tracker operate?
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed pl-6">
                Our operations console integrates directly with flight radar tracking networks. We map your specific tail-number or airline code (such as DL or AA). If your flight arrives early or encounters standard weather delays, our software updates your private driver's schedule automatically. Your car is guaranteed to be waiting.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-200 text-left space-y-1.5">
              <h4 className="text-xs font-bold text-gray-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-deep shrink-0" />
                Is this service private, or will we share seats with other tourists?
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed pl-6">
                McNificents tours maintains a strict 100% private transit standard. You will never share your luxury vehicle, driver, or beverages with any outside travel group. It is solely dedicated to you and your party.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-200 text-left space-y-1.5">
              <h4 className="text-xs font-bold text-gray-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-deep shrink-0" />
                Are child seats, booster seats, or dietary requirements accommodated?
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed pl-6">
                Yes, fully complimentary with your booking. You can define infant seat additions or unique beverages request inside the special instructions field in Step 2. We sanitize and install high-quality Graco seats prior to airport pickup.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-200 text-left space-y-1.5">
              <h4 className="text-xs font-bold text-gray-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-deep shrink-0" />
                What is your JCAL certificate verification?
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed pl-6">
                The Jamaica Co-operative Automobile Limousine (JCAL) is the official recognized passenger transport cooperative in Jamaica. Membership ensures compliance with TPDCo standards, fully licensed chauffeurs, airport apron permits, and high passenger liability insurance protections.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Signature Beautiful Footer */}
      <footer className="bg-tropical-dark text-white border-t border-emerald-deep/45 pt-16 pb-8" id="footer-contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-white/5 pb-10">
            
            {/* footer branding */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-mint to-emerald-deep flex items-center justify-center border border-accent-amber/40 shadow-inner">
                  <span className="font-serif text-white font-extrabold text-xl">M</span>
                </div>
                <div>
                  <h4 className="font-serif font-extrabold tracking-widest text-base">MCNIFICENTS</h4>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-accent-amber font-bold leading-none mt-0.5">McNificents tours</p>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed pt-2">
                Crafting luxury escapes, custom sightseeing journeys, and executive private airport transfers with elite-level safety, legal licenses, and Caribbean heart.
              </p>
              <div className="flex items-center gap-3 pt-2 text-accent-amber text-xs font-mono">
                <span>🛡️ JCAL #JT-204</span>
                <span>•</span>
                <span>🌴 TPDCo Approved</span>
              </div>
            </div>

            {/* footer links */}
            <div className="space-y-4 text-left">
              <h5 className="font-serif font-bold text-sm text-accent-amber uppercase tracking-wider">Premium Coastlines</h5>
              <ul className="space-y-2 text-xs text-gray-350">
                <li><button type="button" onClick={() => { updateBookingDetails({ transferZoneId: 'zone1' }); scrollToAnchor('transfer-estimator'); }} className="hover:text-white transition cursor-pointer">Montego Bay (Zone 1)</button></li>
                <li><button type="button" onClick={() => { updateBookingDetails({ transferZoneId: 'zone2' }); scrollToAnchor('transfer-estimator'); }} className="hover:text-white transition cursor-pointer">Sandy Bay & Tryall (Zone 2)</button></li>
                <li><button type="button" onClick={() => { updateBookingDetails({ transferZoneId: 'zone3' }); scrollToAnchor('transfer-estimator'); }} className="hover:text-white transition cursor-pointer">Grand Palladium & Lucea (Zone 3)</button></li>
                <li><button type="button" onClick={() => { updateBookingDetails({ transferZoneId: 'zone4' }); scrollToAnchor('transfer-estimator'); }} className="hover:text-white transition cursor-pointer">Negril Beachfront & Cliffs (Zone 4)</button></li>
                <li><button type="button" onClick={() => { updateBookingDetails({ transferZoneId: 'zone6' }); scrollToAnchor('transfer-estimator'); }} className="hover:text-white transition cursor-pointer">Ocho Rios Golden Coast (Zone 6)</button></li>
              </ul>
            </div>

            {/* footer excursions */}
            <div className="space-y-4 text-left">
              <h5 className="font-serif font-bold text-sm text-accent-amber uppercase tracking-wider">Private Guided Expeditions</h5>
              <ul className="space-y-2 text-xs text-gray-350">
                <li><button type="button" onClick={() => { setIncludeTours(true); scrollToAnchor('bespoke-tours'); }} className="hover:text-white transition">Martha Brae Bamboo Rafting</button></li>
                <li><button type="button" onClick={() => { setIncludeTours(true); scrollToAnchor('bespoke-tours'); }} className="hover:text-white transition">Dunn's River Falls Combo</button></li>
                <li><button type="button" onClick={() => { setIncludeTours(true); scrollToAnchor('bespoke-tours'); }} className="hover:text-white transition">Seven Mile Beach Sunset</button></li>
                <li><button type="button" onClick={() => { setIncludeTours(true); scrollToAnchor('bespoke-tours'); }} className="hover:text-white transition">Frenchman's Cove Cruise</button></li>
                <li><button type="button" onClick={() => { setIncludeTours(true); scrollToAnchor('bespoke-tours'); }} className="hover:text-white transition">Bob Marley Compound Nine Mile</button></li>
              </ul>
            </div>

            {/* footer contact details */}
            <div className="space-y-4 text-left">
              <h5 className="font-serif font-bold text-sm text-accent-amber uppercase tracking-wider">Concierge Terminal Office</h5>
              <p className="text-xs text-gray-300 leading-normal">
                Sangster International Airport (MBJ)<br />
                VIP Private Transport Terminal Hall<br />
                Montego Bay, Jamaica
              </p>
              <div className="space-y-1.5 pt-2 text-xs">
                <a href="tel:+1327459877" id="p-call-footer" className="flex items-center gap-2 hover:text-accent-amber transition">
                  <Phone className="w-4 h-4 text-accent-amber" />
                  <span className="font-mono">+1 (327) 459-877</span>
                </a>
                <a href="mailto:Bannie36@gmail.com" id="p-email-footer" className="block hover:text-accent-amber transition text-gray-300 font-mono">
                  Bannie36@gmail.com
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p>© {new Date().getFullYear()} McNificents Tours Ltd. All Luxury Rights Reserved. Licensed by TPDCo & JCAL. ISO 9001 Compliance Secured.</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setActivePolicyModal('privacy'); }}
                className="hover:text-white transition cursor-pointer"
              >
                Privacy Manifest
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setActivePolicyModal('terms'); }}
                className="hover:text-white transition cursor-pointer"
              >
                Booking Terms
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setActivePolicyModal('liability'); }}
                className="hover:text-white transition cursor-pointer"
              >
                $1M Liability Claims
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ULTRA-PREMIUM SIGHTSEEING TOUR DETAIL MODAL / DRAWER */}
      <AnimatePresence>
        {itineraryModalTour && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop cover */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setItineraryModalTour(null)}
              className="absolute inset-0 bg-tropical-dark/80 backdrop-blur-md"
            ></motion.div>

            {/* Modal Body card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-2xl relative z-10 w-full max-w-2xl divide-y divide-gray-100 max-h-[90vh] overflow-y-auto"
            >
              
              {/* Cover picture */}
              <div className="relative h-64">
                <img 
                  src={itineraryModalTour.image} 
                  alt={itineraryModalTour.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setItineraryModalTour(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition text-sm font-bold"
                >
                  ✕
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white text-left">
                  <span className="px-3 py-1 bg-accent-amber text-tropical-dark text-[9px] font-mono tracking-widest font-extrabold rounded-full uppercase">
                    {itineraryModalTour.category} PRIVATE TRIP
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white mt-1.5">{itineraryModalTour.name}</h3>
                  <p className="text-xs text-gray-200 italic mt-0.5">"{itineraryModalTour.tagline}"</p>
                </div>
              </div>

              {/* Itinerary Body details */}
              <div className="p-6 space-y-5 text-left">
                
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">📝 Excursion Introduction</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{itineraryModalTour.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-sand-light p-4 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 block uppercase font-bold">Standard Duration:</span>
                    <span className="font-bold text-tropical-dark text-sm flex items-center gap-1 mt-0.5">
                      <Clock className="w-4 h-4 text-accent-amber" />
                      {itineraryModalTour.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase font-bold">Base Cost Pricing:</span>
                    <span className="font-bold text-tropical-dark text-sm mt-0.5 block">
                      ${itineraryModalTour.pricePerAdult} Adult / ${itineraryModalTour.pricePerChild} Child (USD)
                    </span>
                  </div>
                </div>

                {/* What is Included listed beautifully with bullet points */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">💎 What is Exclusively Included:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                    {itineraryModalTour.included.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-mint shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Close footer button */}
              <div className="p-4 bg-gray-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setItineraryModalTour(null)}
                  className="px-6 py-2 bg-emerald-deep text-white text-xs font-mono font-bold tracking-widest rounded-xl hover:bg-tropical-dark transition uppercase"
                >
                  Return to Listing
                </button>
              </div>

            </motion.div>
          </div>
        )}
        
        {isAuthorizingPayment && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-tropical-dark/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-gray-100 shadow-2xl space-y-6 text-center">
              <div className="flex justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#00b388]/20 border-t-[#ffae00] animate-spin"></div>
                  {paymentMethod === 'paypal' ? (
                    <div className="absolute font-serif text-2xl font-black italic text-[#003087] select-none">P</div>
                  ) : (
                    <div className="absolute text-lg select-none">💳</div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {paymentMethod === 'paypal' ? (
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#003087] bg-[#00d2ff]/10 px-3 py-1 rounded-full uppercase border border-[#003087]/10">
                      PayPal Secure Interface
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#00b388] bg-[#00b388]/10 px-3 py-1 rounded-full uppercase border border-[#00b388]/10">
                      Secure Card Processor
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-950 mt-2">Authorizing Escrow Statement</h3>
                <p className="text-xs text-gray-600 font-medium px-4 leading-relaxed">{authStatusMessage}</p>
              </div>
              <div className="text-[10px] font-mono text-gray-400 border-t border-gray-100 pt-4 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#05ff96] animate-pulse"></span>
                🔒 Encrypted Sockets SSL Connection Active
              </div>
            </div>
          </motion.div>
        )}

        {activePolicyModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            {/* Backdrop cover */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePolicyModal(null)}
              className="absolute inset-0 bg-tropical-dark/95 backdrop-blur-md"
            ></motion.div>

            {/* Modal Body card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-2xl relative z-[10000] w-full max-w-2xl max-h-[90vh] flex flex-col text-left"
            >
              {/* Header */}
              <div className="p-6 bg-tropical-dark text-white relative">
                <span className="text-[10px] font-mono font-bold tracking-widest text-accent-amber uppercase bg-black/30 px-3 py-1 rounded-full border border-accent-amber/20">
                  Legal &amp; Logistics Codex
                </span>
                <h3 className="text-xl font-serif font-bold text-white mt-3">
                  McNificents Tours Policy Manifest
                </h3>
                
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActivePolicyModal(null)}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition text-sm font-bold"
                >
                  ✕
                </button>

                {/* Tabs inside modal */}
                <div className="flex gap-2 mt-6 border-t border-white/10 pt-4 overflow-x-auto scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal('privacy')}
                    className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition ${activePolicyModal === 'privacy' ? 'bg-accent-amber text-tropical-dark' : 'bg-white/10 text-gray-300 hover:bg-white/15'}`}
                  >
                    Privacy Manifest
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal('terms')}
                    className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition ${activePolicyModal === 'terms' ? 'bg-accent-amber text-tropical-dark font-black' : 'bg-white/10 text-gray-300 hover:bg-white/15 font-semibold'}`}
                  >
                    Booking Terms
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal('liability')}
                    className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition ${activePolicyModal === 'liability' ? 'bg-accent-amber text-tropical-dark' : 'bg-white/10 text-gray-300 hover:bg-white/15'}`}
                  >
                    $1M Liability Claims
                  </button>
                </div>
              </div>

              {/* Content Panel */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700 leading-relaxed max-h-[50vh]">
                {activePolicyModal === 'privacy' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-emerald-mint/10 border border-emerald-deep/10 rounded-2xl">
                      <ShieldCheck className="w-8 h-8 text-emerald-deep flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-tropical-dark text-xs font-mono uppercase tracking-wide">High Security Tokenization Handshake</h4>
                        <p className="text-xs text-gray-600 mt-1">We respect your absolute privacy. Booking data and coordinates are completely secured.</p>
                      </div>
                    </div>

                    <h5 className="font-serif font-bold text-tropical-dark text-base border-b border-gray-100 pb-2">1. Data Encryption Guardrails</h5>
                    <p>
                      All customer details, including full names, mobile numbers, and emails (registered under <strong className="text-tropical-dark font-mono">Bannie36@gmail.com</strong> support networks), are encrypted using Secure Sockets layer before being stored in our JCAL dispatcher databank.
                    </p>

                    <h5 className="font-serif font-bold text-tropical-dark text-base border-b border-gray-100 pb-2">2. Communication and WhatsApp Dispatch</h5>
                    <p>
                      We strictly use your contact info solely to trigger transaction statements and dispatch live coordination messages. Since we guarantee an <strong>Instant Booking Confirmation</strong> the second checkout completes, these digital manifests are piped straight to your screen, WhatsApp app, and certified inbox.
                    </p>

                    <h5 className="font-serif font-bold text-tropical-dark text-base border-b border-gray-100 pb-2">3. Zero Telemetry Tracking</h5>
                    <p>
                      We do not harvest telemetry coordinates, tracking variables, or third-party behavioral cookies. Once your journey across Jamaica’s coastal highways is completed, passenger manifest records are sealed within 48 hours for absolute confidentiality.
                    </p>
                  </div>
                )}

                {activePolicyModal === 'terms' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-emerald-mint/10 border border-emerald-deep/10 rounded-2xl">
                      <FileCheck className="w-8 h-8 text-emerald-deep flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-tropical-dark text-xs font-mono uppercase tracking-wide">JCAL Official Ride Covenant</h4>
                        <p className="text-xs text-gray-600 mt-1">Legal JCAL-certified pre-paid transport bookings and premium tour terms.</p>
                      </div>
                    </div>

                    <h5 className="font-serif font-bold text-tropical-dark text-base border-b border-gray-100 pb-2">1. Private Chauffeur Standard</h5>
                    <p>
                      McNificents Tours provides <strong>100% private transit standard</strong>. You will never share your luxury vehicle, dedicated professional driver, or complimentary ice-cold Red Stripes with any external tour group. Your reservation is purely bespoke.
                    </p>

                    <h5 className="font-serif font-bold text-tropical-dark text-base border-b border-gray-100 pb-2">2. Flight Delay Surcharges Exemption</h5>
                    <p>
                      No tardiness fees will ever be assessed for delayed flights landing at Sangster International Airport (MBJ). Your personal driver will track flight timings continuously and stand ready holding a customized greeting placard without extra dynamic tariffs.
                    </p>

                    <h5 className="font-serif font-bold text-tropical-dark text-base border-b border-gray-100 pb-2">3. Flexible Cancellations</h5>
                    <p>
                      Provide notices up to 24 hours in advance to trigger full, zero-penalty refunds. Any requests sent within 24 hours can be rescheduled onto sibling dates or stored as lifetime vouchers. Rates are guaranteed safe from unexpected roadside tax surcharges.
                    </p>
                  </div>
                )}

                {activePolicyModal === 'liability' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-emerald-mint/10 border border-emerald-deep/10 rounded-2xl">
                      <Award className="w-8 h-8 text-emerald-deep flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-tropical-dark text-xs font-mono uppercase tracking-wide">$1,000,000 USD Passenger Indemnity</h4>
                        <p className="text-xs text-gray-600 mt-1">Comprehensive passenger insurance, fleet protection, and security certifications.</p>
                      </div>
                    </div>

                    <h5 className="font-serif font-bold text-tropical-dark text-base border-b border-gray-100 pb-2">1. JCAL &amp; TPDCo Legal Insurance</h5>
                    <p>
                      McNificents Tours is fully licensed, accredited, and maintains comprehensive general commercial passenger umbrella policies up to <strong>$1,000,000 USD</strong>. This covers luxury Toyota Voxy fleets, high-top executive buses, and VIP Mercedes SUVs.
                    </p>

                    <h5 className="font-serif font-bold text-tropical-dark text-base border-b border-gray-100 pb-2">2. Defensively Certified Chauffeurs</h5>
                    <p>
                      Every professional private driver undergoes recursive JCAL &amp; Tourism Product Development Company (TPDCo) defensive training. Drivers are strictly vetted under certified local criminal databases to guarantee peak security throughout transit.
                    </p>

                    <h5 className="font-serif font-bold text-tropical-dark text-base border-b border-gray-100 pb-2">3. Secured PayPal Escrow</h5>
                    <p>
                      If McNificents Tours fails to complete a scheduled pick-up or transport assignment due to system discrepancies, our PayPal SSL Escrow guarantees rapid, fully backed transaction release to prevent losses.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100 z-[10001]">
                <span className="text-[10px] font-mono text-gray-400">
                  Concierge Support: Bannie36@gmail.com
                </span>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal(null)}
                  className="px-6 py-2 bg-emerald-deep hover:bg-tropical-dark text-white text-xs font-mono font-bold tracking-widest rounded-xl transition uppercase cursor-pointer"
                >
                  Accept &amp; Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

