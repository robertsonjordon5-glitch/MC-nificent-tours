import { AirportTransferZone, SightseeingTour } from './types';

// Let's import the actual generated images so that Vite packages them beautifully
// @ts-ignore
import ResortHeroBg from './assets/images/jamaica_luxury_resort_1781535365414.jpg';
// @ts-ignore
import PrivateSuvBg from './assets/images/luxury_airport_transfer_1781535380808.jpg';
// @ts-ignore
import BambooRaftingBg from './assets/images/jamaica_bamboo_rafting_1781535396981.jpg';
// @ts-ignore
import DoctorsCaveBg from './assets/images/jamaica_doctors_cave_beach_1781536596772.jpg';
// @ts-ignore
import DunnsFallsBg from './assets/images/jamaica_dunns_river_falls_1781536613333.jpg';
// @ts-ignore
import CookingJerkBg from './assets/images/jamaica_cooking_jerk_1781536627980.jpg';
// @ts-ignore
import PartyCatamaranBg from './assets/images/jamaica_party_catamaran_1781536643035.jpg';
// @ts-ignore
import JetCarBg from './assets/images/jamaica_corvette_jetcar_1781536969303.jpg';
// @ts-ignore
import MarleyMuseumBg from './assets/images/marley_museum_kingston_1781537394773.jpg';
// @ts-ignore
import MarleyBirthplaceBg from './assets/images/marley_birthplace_ninemile_1781537411154.jpg';
// @ts-ignore
import HipStripBg from './assets/images/jamaica_hipstrip_shopping_1781538008413.jpg';
// @ts-ignore
import VoxyBg from './assets/images/toyota_voxy_vip_van_1781539706951.jpg';

export { ResortHeroBg, PrivateSuvBg, BambooRaftingBg, DoctorsCaveBg, DunnsFallsBg, CookingJerkBg, PartyCatamaranBg, JetCarBg, MarleyMuseumBg, MarleyBirthplaceBg, HipStripBg, VoxyBg };

export const AIRPORT_ZONES: AirportTransferZone[] = [
  {
    id: 'zone_hip_strip',
    name: 'Zone: Hip Strips & Sandals Montego Bay',
    region: 'Hip Strips',
    description: 'Private direct transfers to the Montego Bay Hip Strip, Gloucester Avenue beachfront resorts, and Sandals Montego Bay. Comfortable VIP pick-up.',
    hotels: [
      'Sandals Montego Bay',
      'S Hotel Jamaica',
      'Doctor\'s Cave Beach Hotel',
      'Deja Resort',
      'Toby\'s Resort',
      'El Greco Resort',
      'Altamont West Hotel',
      'SeaGarden Beach Resort'
    ],
    oneWayPrice4Pax: 15,
    roundTripPrice4Pax: 30,
    oneWayExtraPax: 4,
    roundTripExtraPax: 8
  },
  {
    id: 'zone_dt_mobay',
    name: 'Zone: Downtown Montego Bay, Sandals Royal & RIU',
    region: 'Downtown Mo-Bay & RIU Coast',
    description: 'Direct comfortable transfer to downtown Montego Bay hotels, Sandals Royal Caribbean, and the popular RIU luxury resort cluster.',
    hotels: [
      'Sandals Royal Caribbean',
      'Riu Montego Bay',
      'Riu Reggae',
      'Riu Palace Jamaica',
      'Ramparts Yacht Club Resort',
      'Downtown Mo-Bay Guest Suites'
    ],
    oneWayPrice4Pax: 20,
    roundTripPrice4Pax: 40,
    oneWayExtraPax: 5,
    roundTripExtraPax: 10
  },
  {
    id: 'zone_zoety',
    name: 'Zone: Zoëtry & Ironshore Residential',
    region: 'Ironshore Area',
    description: 'Elite private transfer to Zoëtry Wellness Resort or upscale luxury villas in the quiet Ironshore residential community.',
    hotels: [
      'Zoëtry Montego Bay',
      'Ironshore Luxury Villas',
      'Whitter Village Luxury Suites',
      'Irwindale Guest Houses'
    ],
    oneWayPrice4Pax: 25,
    roundTripPrice4Pax: 50,
    oneWayExtraPax: 6,
    roundTripExtraPax: 12
  },
  {
    id: 'zone_half_moon',
    name: 'Zone: Holiday Inn, Half Moon & Coral Gardens',
    region: 'Rose Hall West',
    description: 'Chauffeured non-stop airport transfer to legendary Half Moon beachfront luxury estate, Holiday Inn, and prestigious Coral Gardens.',
    hotels: [
      'Half Moon Resort',
      'Holiday Inn Resort',
      'Eclipse at Half Moon',
      'Foundry Luxury Villas Coral Gardens',
      'Seacastles Condos'
    ],
    oneWayPrice4Pax: 30,
    roundTripPrice4Pax: 60,
    oneWayExtraPax: 7,
    roundTripExtraPax: 14
  },
  {
    id: 'zone_hyatt_secrets',
    name: 'Zone: Spring Farm, Jewels, Hyatt, Reading, Secrets & Sunset',
    region: 'Rose Hall & Freeport',
    description: 'Exclusive luxury direct pickup to Hyatt Ziva/Zilara, Secrets, Breathless, Jewel Grande, Hilton Rose Hall, Reading private docks, and Spring Farm VIP villas.',
    hotels: [
      'Hyatt Ziva Rose Hall',
      'Hyatt Zilara Rose Hall',
      'Secrets Wild Orchid',
      'Secrets St. James',
      'Breathless Montego Bay',
      'Jewel Grande Montego Bay',
      'Hilton Rose Hall Resort',
      'Secrets Sunset Resort',
      'Reading Private Ocean Villas',
      'Spring Farm Private Club'
    ],
    oneWayPrice4Pax: 35,
    roundTripPrice4Pax: 70,
    oneWayExtraPax: 9,
    roundTripExtraPax: 18
  },
  {
    id: 'zone_iberostar',
    name: 'Zone: Iberostar Coastal Complex',
    region: 'Iberostar Resorts',
    description: 'Direct door-to-door transfer from Sangster International (MBJ) straight to the stunning Iberostar Grand, Suites, or Beach resorts.',
    hotels: [
      'Iberostar Grand Rose Hall',
      'Iberostar Selection Rose Hall Suites',
      'Iberostar Beach Resort Rose Hall'
    ],
    oneWayPrice4Pax: 40,
    roundTripPrice4Pax: 80,
    oneWayExtraPax: 10,
    roundTripExtraPax: 20
  },
  {
    id: 'zone_round_hill',
    name: 'Zone: Round Hill Resorts',
    region: 'Round Hill',
    description: 'Scenic chauffeured transfer to the award-winning Round Hill Hotel and private luxury oceanfront villas.',
    hotels: [
      'Round Hill Hotel and Villas',
      'Hopewell Seaside Estates'
    ],
    oneWayPrice4Pax: 45,
    roundTripPrice4Pax: 90,
    oneWayExtraPax: 12,
    roundTripExtraPax: 24
  },
  {
    id: 'zone_tryall',
    name: 'Zone: Tryall Club',
    region: 'Tryall & Sandy Bay',
    description: 'Direct high-end transfer to the world-renowned private club villas of Tryall, and Sandy Bay coast properties.',
    hotels: [
      'The Tryall Club',
      'Sandy Bay Oceanfront Villas',
      'Hanover private waterfront estates'
    ],
    oneWayPrice4Pax: 50,
    roundTripPrice4Pax: 100,
    oneWayExtraPax: 13,
    roundTripExtraPax: 26
  },
  {
    id: 'zone_falmouth',
    name: 'Zone: Falmouth, Royalton, Grand Palladium & Lucea',
    region: 'Grand Palladium & Lucea',
    description: 'Long-distance private transfer to Grand Palladium Lady Hamilton/Jamaica, Royalton Blue Waters/White Sands, or scenic Lucea seaside properties.',
    hotels: [
      'Grand Palladium Jamaica (Lucea)',
      'Grand Palladium Lady Hamilton Resort',
      'Royalton Blue Waters Resort',
      'Royalton White Sands Resort',
      'Excellence Oyster Bay (Falmouth)',
      'Ocean Coral Spring Resort',
      'Ocean Eden Bay',
      'Lucea Private Oceanside Cottages'
    ],
    oneWayPrice4Pax: 60,
    roundTripPrice4Pax: 120,
    oneWayExtraPax: 15,
    roundTripExtraPax: 30
  },
  {
    id: 'zone_duncans',
    name: 'Zone: Duncans & Silver Sands',
    region: 'Duncans Bay',
    description: 'Direct secure transfer route to the magnificent white sand private beach community of Silver Sands in Duncans.',
    hotels: [
      'Silver Sands Villas',
      'Duncans Bay Beach Houses',
      'Duncans Seaside Haven'
    ],
    oneWayPrice4Pax: 65,
    roundTripPrice4Pax: 130,
    oneWayExtraPax: 16,
    roundTripExtraPax: 32
  },
  {
    id: 'zone_green_island',
    name: 'Zone: Green Island & Braco',
    region: 'Green Island',
    description: 'Private direct transfers to Green Island coastal estates or scenic old-world Braco properties.',
    hotels: [
      'Braco Private Estate & Stables',
      'Green Island Cabins',
      'Melia Braco Village area'
    ],
    oneWayPrice4Pax: 80,
    roundTripPrice4Pax: 160,
    oneWayExtraPax: 20,
    roundTripExtraPax: 40
  },
  {
    id: 'zone_sav_la_mar',
    name: 'Zone: Sav-la-mar, Discovery Bay & Bluefields',
    region: 'Discovery & Bluefields Bay',
    description: 'Travel in luxury comfort to Sav-la-mar town, beautiful resort properties in Discovery Bay, or Bluefields Bay eco-luxury villas.',
    hotels: [
      'Bluefields Bay Villas',
      'Discovery Bay waterfront villas',
      'Sav-la-mar Local Lodges'
    ],
    oneWayPrice4Pax: 90,
    roundTripPrice4Pax: 180,
    oneWayExtraPax: 22,
    roundTripExtraPax: 44
  },
  {
    id: 'zone_negril_runaway',
    name: 'Zone: Negril, Runaway Bay & New Market',
    region: 'Negril & Runaway Bay',
    description: 'Direct comfortable private travel stretching to magical Seven Mile Beach & Cliffs in Negril, or eastward to golf courses of Runaway Bay.',
    hotels: [
      'Sandals Negril',
      'Royalton Negril',
      'Hideaway at Royalton Negril',
      'Sandy Haven Resort',
      'Skylark Negril Beach Resort',
      'Riu Negril',
      'Riu Palace Tropical Bay',
      'Rockhouse Hotel',
      'The Caves Negril',
      'Couples Swept Away',
      'Couples Negril',
      'Hedonism II Resort',
      'Sunset at the Palms',
      'Bahia Principe Grand Jamaica',
      'Bahia Principe Luxury Runaway Bay',
      'Jewel Paradise Cove Resort',
      'Franklyn D. Resort'
    ],
    oneWayPrice4Pax: 100,
    roundTripPrice4Pax: 200,
    oneWayExtraPax: 25,
    roundTripExtraPax: 50
  },
  {
    id: 'zone_whitehouse',
    name: 'Zone: Whitehouse Coastline',
    region: 'Whitehouse (South Coast)',
    description: 'Private direct southern crossing from MBJ over the hills to Sandals South Coast resort in Whitehouse.',
    hotels: [
      'Sandals South Coast (Whitehouse)',
      'Whitehouse Oceanside Guesthouses'
    ],
    oneWayPrice4Pax: 110,
    roundTripPrice4Pax: 220,
    oneWayExtraPax: 27,
    roundTripExtraPax: 54
  },
  {
    id: 'zone_ocho_rios',
    name: 'Zone: Ocho Rios, Browns Town & Black River',
    region: 'Ocho Rios & Black River',
    description: 'Scenic transfers to the capital of adventure Ocho Rios, traditional Browns Town hub, or Black River south-coast croc safari camps.',
    hotels: [
      'Moon Palace Jamaica',
      'Club Riu Ocho Rios',
      'Sandals Ochi Beach Resort',
      'Sandals Royal Plantation',
      'Sandals Dunn\'s River',
      'Couples Tower Isle',
      'Couples Sans Souci',
      'Hermosa Cove Villa Resort',
      'Beaches Ocho Rios Resort',
      'Jakes Hotel Treasure Beach'
    ],
    oneWayPrice4Pax: 120,
    roundTripPrice4Pax: 240,
    oneWayExtraPax: 30,
    roundTripExtraPax: 60
  },
  {
    id: 'zone_boscobel',
    name: 'Zone: Boscobel Coast',
    region: 'Boscobel',
    description: 'Direct premium transport to the Ian Fleming coastal belt, scenic Boscobel properties, and adjacent private luxury villas.',
    hotels: [
      'GoldenEye Resort',
      'Beaches Boscobel Resort',
      'Ian Fleming International area villas'
    ],
    oneWayPrice4Pax: 130,
    roundTripPrice4Pax: 260,
    oneWayExtraPax: 32,
    roundTripExtraPax: 64
  },
  {
    id: 'zone_oracabessa',
    name: 'Zone: Alexandria & Oracabessa',
    region: 'Oracabessa',
    description: 'Private airport shuttle service directly to coastal Oracabessa properties and mountain retreats of Alexandria.',
    hotels: [
      'Oracabessa private villas',
      'Alexandria mountain viewpoints',
      'James Bond Beach area cottages'
    ],
    oneWayPrice4Pax: 140,
    roundTripPrice4Pax: 280,
    oneWayExtraPax: 35,
    roundTripExtraPax: 70
  },
  {
    id: 'zone_santa_cruz',
    name: 'Zone: Santa Cruz, Claremont & Maggotty',
    region: 'Santa Cruz / Claremont',
    description: 'Comfortable private direct transport to central highlands, Claremont estates, or Maggotty riverside area.',
    hotels: [
      'Santa Cruz Heritage Lodges',
      'Claremont Mountain Manor',
      'Maggotty River Cottages'
    ],
    oneWayPrice4Pax: 150,
    roundTripPrice4Pax: 300,
    oneWayExtraPax: 35,
    roundTripExtraPax: 70
  },
  {
    id: 'zone_port_maria',
    name: 'Zone: Port Maria, Christiana, Treasure Beach & Moneague',
    region: 'Treasure Beach',
    description: 'Chauffeured trip to historic Port Maria seaport on the north, central Christiana or southern bohemian Treasure Beach area.',
    hotels: [
      'Jakes Hotel Treasure Beach',
      'Lashings Boutique Hotel',
      'Treasure Beach Private Villas',
      'Port Maria Oceanfront Lodging',
      'Moneague Lake Cabins'
    ],
    oneWayPrice4Pax: 160,
    roundTripPrice4Pax: 320,
    oneWayExtraPax: 40,
    roundTripExtraPax: 80
  },
  {
    id: 'zone_mandeville',
    name: 'Zone: Mandeville, Ewarton, Southfield & Alligator Pond',
    region: 'Mandeville / Southfield',
    description: 'Chauffeured private transfers to cool high-altitude Mandeville, agricultural Ewarton, or fresh seafood spot Alligator Pond on the shore.',
    hotels: [
      'Mandeville Hotel',
      'Golf View Hotel Mandeville',
      'Alligator Pond Seaside retreats',
      'Southfield guest homes'
    ],
    oneWayPrice4Pax: 170,
    roundTripPrice4Pax: 340,
    oneWayExtraPax: 45,
    roundTripExtraPax: 90
  },
  {
    id: 'zone_porus',
    name: 'Zone: Porus',
    region: 'Porus',
    description: 'Direct custom private airport transfers to Manchester hill town, Porus.',
    hotels: [
      'Porus Heritage Inn',
      'Porus Highway Rest Cabins'
    ],
    oneWayPrice4Pax: 190,
    roundTripPrice4Pax: 380,
    oneWayExtraPax: 45,
    roundTripExtraPax: 90
  },
  {
    id: 'zone_may_pen',
    name: 'Zone: May Pen & Linstead',
    region: 'May Pen / Linstead',
    description: 'Long-distance reliable shuttle service directly to May Pen town or scenic citrus countryside of Linstead.',
    hotels: [
      'May Pen Plaza Hotel',
      'Linstead Countryside Cottages'
    ],
    oneWayPrice4Pax: 220,
    roundTripPrice4Pax: 440,
    oneWayExtraPax: 55,
    roundTripExtraPax: 110
  },
  {
    id: 'zone_spanish_town',
    name: 'Zone: Spanish Town',
    region: 'Spanish Town',
    description: 'Direct comfortable transport to the old capital city Spanish Town, St. Catherine.',
    hotels: [
      'Spanish Town Historic Guest Rooms',
      'St. Catherine Suburban Villas'
    ],
    oneWayPrice4Pax: 240,
    roundTripPrice4Pax: 480,
    oneWayExtraPax: 60,
    roundTripExtraPax: 120
  },
  {
    id: 'zone_kingston',
    name: 'Zone: Kingston & Annotto Bay',
    region: 'Kingston City',
    description: 'Premium cross-island private transfer to the capital metropolis Kingston, or the north coast gateway Annotto Bay.',
    hotels: [
      'The Pegasus Hotel Kingston',
      'S Hotel Kingston',
      'AC Hotel Kingston',
      'Terra Nova All-Suite Hotel',
      'Strawberry Hill Resort',
      'Annotto Bay Oceanside Lodges'
    ],
    oneWayPrice4Pax: 250,
    roundTripPrice4Pax: 500,
    oneWayExtraPax: 60,
    roundTripExtraPax: 120
  },
  {
    id: 'zone_buff_bay',
    name: 'Zone: Buff Bay',
    region: 'Buff Bay',
    description: 'Scenic private crossing to the scenic mouth of Buff Bay river nestled at Portland borders.',
    hotels: [
      'Buff Bay Ocean Cottages',
      'Blue Mountain foothills eco-retreat'
    ],
    oneWayPrice4Pax: 260,
    roundTripPrice4Pax: 520,
    oneWayExtraPax: 50,
    roundTripExtraPax: 100
  },
  {
    id: 'zone_port_antonio',
    name: 'Zone: Port Antonio & Yallahs',
    region: 'Port Antonio & Portland',
    description: 'Glorious long-distance travel to peaceful luxury spots of Portland including Frenchman\'s Cove, Geejam, Trident resort, or southern Yallahs.',
    hotels: [
      'Geejam Hotel',
      'Trident Hotel Port Antonio',
      'Frenchman\'s Cove Resort',
      'Yallahs Beach Cabins'
    ],
    oneWayPrice4Pax: 300,
    roundTripPrice4Pax: 600,
    oneWayExtraPax: 70,
    roundTripExtraPax: 140
  },
  {
    id: 'zone_boston_bay',
    name: 'Zone: Boston & Morant Bay',
    region: 'Boston Jerk Coast',
    description: 'Chauffeured coastal trip to historic Boston Bay (birthplace of authentic Jerk pork) or southern Morant Bay.',
    hotels: [
      'Boston Beach Guest House',
      'Great Huts Resort',
      'Morant Bay Coastal Rooms'
    ],
    oneWayPrice4Pax: 330,
    roundTripPrice4Pax: 660,
    oneWayExtraPax: 75,
    roundTripExtraPax: 150
  },
  {
    id: 'zone_manchoniel',
    name: 'Zone: Manchioneal & Port Morant',
    region: 'Manchioneal East',
    description: 'The ultimate scenic journey to the eastern frontier seaport Manchioneal, Reach Falls and Port Morant.',
    hotels: [
      'Reach Falls area cabins',
      'Port Morant Shore Houses'
    ],
    oneWayPrice4Pax: 350,
    roundTripPrice4Pax: 700,
    oneWayExtraPax: 80,
    roundTripExtraPax: 160
  }
];

export const SIGHTSEEING_TOURS: SightseeingTour[] = [
  {
    id: 'tour_doctors_cave',
    name: 'Doctor\'s Cave Beach Excursion',
    tagline: 'Soak in world-famous translucent healing mineral waters of Montego Bay',
    description: 'Spend an unhurried, relaxing day at the legendary Doctor\'s Cave Beach on Gloucester Avenue Hip Strip. Renowned for its white powdered sands and crystal-clear turquoise waters fed by natural mineral springs, which are said to possess curative healing powers.',
    pricePerAdult: 20,
    pricePerChild: 20,
    minPax: 1,
    duration: 'Flexible',
    included: [
      'Private round-trip transfer from your hotel',
      'Doctors Cave Beach admission tickets',
      'Access to fully equipped beach bars and food stalls',
      'Full day of beachfront swimming and recreation'
    ],
    image: DoctorsCaveBg,
    category: 'Popular'
  },
  {
    id: 'tour_margaritaville',
    name: 'Margaritaville VIP Night Life Tour',
    tagline: 'Feel the rhythmic Caribbean bass and slide into oceans under neon skies',
    description: 'Immerse in Jamaica\'s world-famous party atmosphere on Montego Bay\'s Hip Strip. Jump down the giant 120-foot waterslide into warm seawater, sip frosty tropical margaritas, and groove to the hottest reggae, dancehall, and global club tunes on the outdoor seaside decks.',
    pricePerAdult: 25,
    pricePerChild: 25,
    minPax: 1,
    duration: '4 Hours',
    included: [
      'VIP private round-trip transportation',
      'Skip-the-line express priority entry pass',
      'Reserved oceanside sunset lounge seating',
      'Chauffeur waiting on standby at your scheduled checkout time'
    ],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    category: 'Popular'
  },
  {
    id: 'tour_pier_one',
    name: 'Pier One Oceanside Night Life Experience',
    tagline: 'Dance on the water at Montego Bay\'s undisputed #1 open-air ocean deck',
    description: 'Taste real oceanfront entertainment. Pier One is Montego Bay\'s premier entertainment hub directly over-water, featuring panoramic marine harbors viewpoints, high-profile club DJs, tropical signature drinks, and incredible local seafood vibes.',
    pricePerAdult: 20,
    pricePerChild: 20,
    minPax: 1,
    duration: '4 Hours',
    included: [
      'Round-trip private air-conditioned vehicle transfers',
      'Fast-track general entry tickets',
      'Premium viewing spots access across the bayside decks',
      'Safe on-call return chauffeur coordination'
    ],
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    category: 'Popular'
  },
  {
    id: 'tour_jet_car',
    name: 'High-Speed Corvette Jet Car Pilot Adventure',
    tagline: 'Tame the tropical waves in a high-performance marine Corvette clone',
    description: 'Bring ultimate adrenaline to your vacation! Take command of a revolutionary high-performance marine aquatic Jet Car shaped exactly like an exotic Corvette sports car. Slicing through Montego Bay\'s turquoise sea at top speeds.',
    pricePerAdult: 150,
    pricePerChild: 150,
    minPax: 1,
    duration: '45 Minutes',
    included: [
      'Personal safety training with certified marine instructors',
      '45 Minutes of high-speed pilot time (self-driven!)',
      'Premium lifejacket and marine distress radio kits',
      'Accommodates up to 2 passengers for a single flat rate'
    ],
    image: JetCarBg,
    category: 'Adventure'
  },
  {
    id: 'tour_bamboo_rafting_martha',
    name: 'Martha Brae Scenic Bamboo Rafting',
    tagline: 'Glide along peaceful tree-canopied emerald waters on handcrafted rafts',
    description: 'The defining therapeutic journey of Jamaica. Peaceful and lush, float along three miles of the canopy-shaded, emerald-green Martha Brae river on a 30-foot handcrafted bamboo raft helmed by highly certified local river captains.',
    pricePerAdult: 100,
    pricePerChild: 100,
    minPax: 1,
    duration: '3 Hours',
    included: [
      'Private luxury round-trip SUV transfer',
      'Private 30-foot authentic bamboo raft for two passengers',
      'Certified river pilot guide sharing local herbal lore',
      'Refreshing tropical organic welcome herbal beverage'
    ],
    image: BambooRaftingBg,
    category: 'Water'
  },
  {
    id: 'tour_dreamer_party',
    name: 'Dreamer Catamaran Cruise Party Boat',
    tagline: 'Sailing, snorkeling, and bottomless rum cocktail open bars',
    description: 'Board the spacious, luxurious Dreamer Catamaran for a legendary 3-hour marine excursion. Snorkel the vibrant marine reef gardens, dance on sun-drenched cargo nets, sip unlimited rum punches from the open bar, and enjoy hot Jamaican jerk kitchen specialties.',
    pricePerAdult: 100,
    pricePerChild: 100,
    minPax: 1,
    duration: '3 Hours',
    included: [
      'Private door-to-door hotel round-trip transfers',
      '3-Hour catamaran sea cruise of marine reserves',
      '3 Hours of premium open bar (cocktails, beer, carbonated juices)',
      'Snorkeling gear outfitted with marine master helper guides',
      'Authentic Jamaican jerk food buffet on-board'
    ],
    image: PartyCatamaranBg,
    category: 'Water'
  },
  {
    id: 'tour_private_boat',
    name: 'Private Yacht & Skippered Boat Booking',
    tagline: 'Charter your own private sea cruiser for groups of up to 15 friends',
    description: 'The ultimate pinnacle of beachfront luxury. Reserve Your own skippered speed boat or luxury yacht. Tailor your coastal itinerary to isolated sandy coves, legendary snorkel reefs, or peaceful offshore sandbars away from standard tourist tracks.',
    pricePerAdult: 800,
    pricePerChild: 800,
    minPax: 1,
    duration: 'Half Day / 4 Hours',
    included: [
      'Entire private motor vessel cruiser with licensed captain and mate',
      'Bespoke customizable sailing itinerary',
      'Fully loaded ice chests containing sodas, beer, water',
      'Ideal for groups of 8 to 15 passengers (flat rate pricing)'
    ],
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800',
    category: 'Water'
  },
  {
    id: 'tour_negril_sunset',
    name: 'Negril Serene: Seven Mile Beach & Rick\'s Cafe',
    tagline: 'Lounge on powder white sands and witness courageous cliff diving thrills',
    description: 'Set out to the scenic western tip of Jamaica where miles of white powder sand meet sparkling seas. Sun-lounge at a premium beach club, and complete your day at Rick\'s Cafe watching world-champion cliff jumpers leap into the sea as a glorious sunset paints the Caribbean sky.',
    pricePerAdult: 130,
    pricePerChild: 130,
    minPax: 1,
    duration: '7 Hours',
    included: [
      'Private luxury round-trip transfer from your resort',
      'Reserved VIP Beach Club lounge area on Seven Mile Beach',
      'Reserved sunset viewing spots on the legendary Rick\'s Cafe decks',
      'Cold local drinks and chilled towels inside private cabin'
    ],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    category: 'Popular'
  },
  {
    id: 'tour_dunns_falls',
    name: 'Dunn\'s River Falls Scenic Climb',
    tagline: 'Ascend the natural limestone terraces of Jamaica\'s most legendary cascades',
    description: 'Climb the majestic 600-foot cascading pools at Dunn\'s River Falls in Ocho Rios. Holding hands in iconic team chains, climb natural limestone steps under the guidance of expert river park rangers.',
    pricePerAdult: 150,
    pricePerChild: 150,
    minPax: 2,
    duration: '6 Hours',
    included: [
      'Private custom round-trip transfers directly from your hotel lobby',
      'Dunn\'s River Falls pre-registered park entrance tickets',
      'Professional certified park climbing guide help',
      'Bypass general booking ticket booths lanes completely'
    ],
    image: DunnsFallsBg,
    category: 'Adventure'
  },
  {
    id: 'tour_ys_falls_atv',
    name: 'YS Falls Oasis & Mountain ATV Tour Combo',
    tagline: 'Race through wild dirt tracks on high-power ATVs and dive in pristine waterfalls',
    description: 'The ultimate dual-thrill vacation package. Embark on a rugged off-road automated ATV ride deep into rainforested mountain trails. Afterward, head to YS Falls\' stunning multi-tiered natural rock gardens to cool off in mineral spring pools and swing on vines.',
    pricePerAdult: 300,
    pricePerChild: 300,
    minPax: 1,
    duration: '7 Hours',
    included: [
      'Private chauffeured round-trip transfer in premium high-roof vehicle',
      'Premium ATV jungle safari rental and protective gear training',
      'Entry tickets and tractor-wagon transfers up to YS Falls pools',
      'Authentic Jamaican cooking lunch platter',
      'Professional certified operations adventure guides'
    ],
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800',
    category: 'Adventure'
  },
  {
    id: 'tour_bob_marley_museum',
    name: 'Kingston Bob Marley Museum Elite Pilgrimage',
    tagline: 'Walk through 56 Hope Road, the home and studio of the reggae icon',
    description: 'Journey to the cultural capital city Kingston. Walk inside 56 Hope Road, the preserved main house and personal recording studio of Bob Marley. View personal treasures, gold records, stage photographs, and the legendary bullet-impact rooms from 1976.',
    pricePerAdult: 250,
    pricePerChild: 250,
    minPax: 1,
    duration: '8 Hours',
    included: [
      'First-class private round-trip transport via scenic toll express highways',
      'Skip-the-line Marley compound VIP museum entry ticket passes',
      'Personal specialist museum guide escort',
      'Sightseeing loops through Emancipation Park and national landmarks'
    ],
    image: MarleyMuseumBg,
    category: 'Heritage'
  },
  {
    id: 'tour_bob_marley_house_st_ann',
    name: 'Bob Marley Birthplace Tour (Nine Mile, St. Ann)',
    tagline: 'A spiritual pilgrimage into the majestic mountains of St. Ann',
    description: 'Travel high into the green rolling hills of St. Ann to Nine Mile, Bob Marley\'s birthplace, childhood home, and ultimate marble tomb mausoleum. Local Rastafarian guides will lead you through where his musical soul was nurtured.',
    pricePerAdult: 150,
    pricePerChild: 150,
    minPax: 1,
    duration: '6 Hours',
    included: [
      'Chauffeured scenic private mountain transfers round-trip',
      'Skip-the-line Nine Mile compound entry tickets',
      'Guided Rastafarian expert review of birth cottage and meditation rock',
      'Organic herbal lemongrass tea taste samples'
    ],
    image: MarleyBirthplaceBg,
    category: 'Heritage'
  },
  {
    id: 'tour_hip_strip_shopping',
    name: 'Montego Bay Hip Strip Shopping & Dining Tour',
    tagline: 'Shop duty-free souvenirs, handcrafted arts, and dine over the sea',
    description: 'Chauffeur back-and-forth transit customized to Gloucester Avenue (the Hip Strip). Wander duty-free boutiques, handpicked artisan markets for Blue Mountain Coffee or Jamaican rum, with stops at major seafood cafes directly on the water.',
    pricePerAdult: 30,
    pricePerChild: 30,
    minPax: 1,
    duration: '4 Hours',
    included: [
      'Dedicated private round-trip door-to-door transfer services',
      'Discounts and coupons at selected premium duty-free gift shops',
      'Standby private chauffeur assisting with luggage bags protection'
    ],
    image: HipStripBg,
    category: 'Popular'
  },
  {
    id: 'tour_cooking_spice_class',
    name: 'Jamaica Spiced Cooking Class & Jerk Tour',
    tagline: 'Learn to cook authentic Jerk Chicken & Curry Chicken from master chefs',
    description: 'A priceless and authentic culinary adventure. Explore a tropical spice orchard botanical garden, and get hands-on at your own cooking station. Learn the secrets of seasoning and grilling Jamaican Jerk Chicken over sweetwood logs, or styling authentic curry chicken.',
    pricePerAdult: 80,
    pricePerChild: 80,
    minPax: 1,
    duration: '4 Hours',
    included: [
      'Private resort round-trip transportation',
      'Spiced orchard estate garden tour walk with botanical expert',
      'Premium private individual kitchen cooking station',
      'Eat Your prepared feast (Jerk, Curry, local sides included)',
      'Complimentary souvenir recipe manuals and tropical cocktails'
    ],
    image: CookingJerkBg,
    category: 'Heritage'
  }
];

export const TRUST_BADGES = [
  {
    title: "Official Transfer Partner",
    desc: "Authorized taxi operations, transparent pre-paid pricing schedules, and VIP pick-up privileges.",
    tag: "MBJ-APPROVED"
  },
  {
    title: "JCAL Member Agency",
    desc: "Officially certified under Jamaica Co-operative Automobile Limousine standards.",
    tag: "LICENSE #JT-204"
  },
  {
    title: "TPDCo Licensed & Bonded",
    desc: "Tourism Product Development Company approved vehicles and elite uniform drivers.",
    tag: "TPDCO CERTIFIED"
  }
];
