import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Language, Translation, TripRecord, User } from '../types';
import { I18N } from '../i18n';
import {
  loadLang,
  loadTrips,
  loadUser,
  saveLang,
  saveTrip,
  saveUser,
} from '../storage';

interface AppState {
  user: User | null;
  language: Language;
  trips: TripRecord[];
  loading: boolean;
  t: Translation;
  isRTL: boolean;
  setUser: (user: User | null) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  addTrip: (trip: TripRecord) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [language, setLangState] = useState<Language>('en');
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [savedUser, savedLang, savedTrips] = await Promise.all([
        loadUser(),
        loadLang(),
        loadTrips(),
      ]);
      if (savedUser) setUserState(savedUser);
      if (savedLang) setLangState(savedLang);
      setTrips(savedTrips);
      setLoading(false);
    })();
  }, []);

  const setUser = async (u: User | null) => {
    setUserState(u);
    if (u) await saveUser(u);
  };

  const setLanguage = async (lang: Language) => {
    setLangState(lang);
    await saveLang(lang);
  };

  const addTrip = async (trip: TripRecord) => {
    setTrips((prev) => [trip, ...prev]);
    await saveTrip(trip);
  };

  const t = I18N[language];
  const isRTL = t.dir === 'rtl';

  return (
    <AppContext.Provider
      value={{ user, language, trips, loading, t, isRTL, setUser, setLanguage, addTrip }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
