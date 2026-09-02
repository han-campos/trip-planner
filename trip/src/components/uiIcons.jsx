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

export const iconStroke = 2.1;

function PhrasesTabIcon({ size = 24, strokeWidth = iconStroke, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 6.5A5.5 5.5 0 0 1 10.5 1h3A5.5 5.5 0 0 1 19 6.5v4A5.5 5.5 0 0 1 13.5 16H11l-4.5 4v-4.6A5.5 5.5 0 0 1 5 11.5z" />
      <path d="M8.25 8.25h3.5" />
      <path d="M8.25 11.25h2" />
      <path d="m13.25 12 1.65-4.5L16.55 12" />
      <path d="M13.75 10.75h2.3" />
    </svg>
  );
}

export const tabIcons = {
  guide: Compass,
  itinerary: CalendarDays,
  phrases: PhrasesTabIcon,
  bookings: CalendarCheck,
  trips: Map,
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
  Map,
  MapPin,
  Plus,
  Route,
};
