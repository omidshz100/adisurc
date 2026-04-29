export type Language = 'en' | 'it' | 'fa' | 'ar';
export type Direction = 'ltr' | 'rtl';
export type TripMode = 'exit' | 'return';
export type TripType = 'out' | 'in';
export type HistoryFilter = 'all' | 'exits' | 'returns';

export interface Translation {
  code: Language;
  dir: Direction;
  flag: string;
  name: string;
  short: string;
  date: string;
  hello: string;
  fullName: string;
  room: string;
  roomLabel: string;
  nameLabel: string;
  welcome: string;
  continue: string;
  residents: string;
  inDorm: string;
  outDorm: string;
  needReturnFirst: string;
  needExitFirst: string;
  lastReturn: string;
  lastExitAt: (time: string) => string;
  lastReturnAt: (time: string) => string;
  exit: string;
  return: string;
  exitSub: string;
  returnSub: string;
  myHistory: string;
  pastTrips: string;
  scanTitle: string;
  scanSub: string;
  step1: string;
  step2: string;
  detected: string;
  confirmExit: string;
  confirmReturn: string;
  tapBelow: (mode: string) => string;
  dep: string;
  arr: string;
  resident: string;
  gate: string;
  exitTime: string;
  returnTime: string;
  confirmExitBtn: string;
  confirmReturnBtn: string;
  cancel: string;
  week: string;
  trips: string;
  avgReturn: string;
  avgTime: string;
  all: string;
  exits: string;
  returns: string;
  today: string;
  mon: string;
  sun: string;
  sat: string;
  mainGate: string;
}

export interface User {
  fullName: string;
  roomNumber: string;
}

export interface TripRecord {
  id: string;
  type: TripType;
  gate: string;
  timestamp: number;
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Scan: { mode: TripMode };
  Confirm: { mode: TripMode; gate: string };
  History: undefined;
};
