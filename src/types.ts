import firebase from 'firebase/app';

export type MemberData = {
  memberId: string;
  alias: string;
  expiry: string;
  club: string;
};

export type QrData = {
  memberId: string;
  alias: string;
  expiry: string;
  club: string;
};

export type Card = {
  id: string;
  memberId: string;
  alias: string;
  expiry: string;
  club: string;
  qr: string;
};

export type AppContext = {
  user: firebase.User | null;
  setUser: (user: firebase.User | null) => void;
  isFetchingData: boolean;
  setIsFetchingData: (isFetchingData: boolean) => void;
  isMenuActive: boolean;
  setIsMenuActive: (isMenuActive: boolean) => void;
  data: Data;
  setData: (data: Data) => void;
};

export type Data = {
  email?: string;
  syncTimestamp?: Date;
  cards?: Card[];
};
