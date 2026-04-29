import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, TripRecord, User } from '../types';

const KEY_USER = '@adisurc:user';
const KEY_TRIPS = '@adisurc:trips';
const KEY_LANG = '@adisurc:lang';

export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(KEY_USER, JSON.stringify(user));
}

export async function loadUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(KEY_USER);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function removeUser(): Promise<void> {
  await AsyncStorage.removeItem(KEY_USER);
}

export async function saveTrip(trip: TripRecord): Promise<void> {
  const existing = await loadTrips();
  await AsyncStorage.setItem(KEY_TRIPS, JSON.stringify([trip, ...existing]));
}

export async function loadTrips(): Promise<TripRecord[]> {
  const raw = await AsyncStorage.getItem(KEY_TRIPS);
  return raw ? (JSON.parse(raw) as TripRecord[]) : [];
}

export async function saveLang(lang: Language): Promise<void> {
  await AsyncStorage.setItem(KEY_LANG, lang);
}

export async function loadLang(): Promise<Language | null> {
  const raw = await AsyncStorage.getItem(KEY_LANG);
  return raw as Language | null;
}
