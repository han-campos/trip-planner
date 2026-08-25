import {
  Bed,
  Building2,
  CalendarCheck,
  CalendarDays,
  Car,
  Check,
  ChevronRight,
  Compass,
  Hotel,
  Landmark,
  Languages,
  Map,
  MapPin,
  Mountain,
  Plane,
  Plus,
  Route,
  Ticket,
  UtensilsCrossed,
  Waves,
} from 'lucide-react';

export const iconStroke = 1.75;

export const tabIcons = {
  guide: Compass,
  phrases: Languages,
  bookings: CalendarCheck,
  'add-trip': Plus,
};

const categoryDetails = {
  water: { tone: 'beach', Icon: Waves },
  nature: { tone: 'hiking', Icon: Mountain },
  town: { tone: 'town', Icon: Building2 },
  dining: { tone: 'dining', Icon: UtensilsCrossed },
  history: { tone: 'history', Icon: Landmark },
  activity: { tone: 'tour', Icon: Route },
  other: { tone: 'history', Icon: MapPin },
};

export function categoryMeta(categoryOrId) {
  const id = typeof categoryOrId === 'string' ? categoryOrId : categoryOrId?.id;
  return categoryDetails[id] || categoryDetails.other;
}

export function CategoryIcon({ category, size = 18, ...props }) {
  const { Icon } = categoryMeta(category);
  return <Icon aria-hidden="true" size={size} strokeWidth={iconStroke} {...props} />;
}

export function categoryTone(categoryOrId) {
  return categoryMeta(categoryOrId).tone;
}

const serviceIcons = [
  [/hotel|stay|suite|villa|bnb|apartment|lodg/i, Hotel],
  [/car|rental|transfer|taxi|ride|parking/i, Car],
  [/flight|airline|airport|plane/i, Plane],
  [/restaurant|dinner|lunch|brunch|taverna|food|dining/i, UtensilsCrossed],
  [/tour|ticket|museum|activity|excursion|class/i, Ticket],
];

export function bookingIconFor(name = '') {
  return serviceIcons.find(([match]) => match.test(name))?.[1] || Bed;
}

export {
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Compass,
  Languages,
  Map,
  MapPin,
  Plus,
  Route,
};
