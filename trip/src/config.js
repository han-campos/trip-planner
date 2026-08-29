const env = import.meta.env;

export const appConfig = {
  passcode: env.VITE_TRIP_PASSCODE || 'bimpeangel2026',
  supabaseUrl: env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY || '',
  aiEndpointUrl: env.VITE_AI_ENDPOINT_URL || '',
  debug: env.VITE_DEBUG === 'true',
};

export const unlockStorageKey = 'trip-planner:v1:unlocked';
export const activeTripStorageKey = 'trip-planner:v1:active-trip';
