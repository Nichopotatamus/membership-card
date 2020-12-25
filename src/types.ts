import React from 'react';
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
  setUser: React.Dispatch<React.SetStateAction<firebase.User | null>>;
  isFetchingData: boolean;
  setIsFetchingData: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuActive: boolean;
  setIsMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
};

export type Data = {
  email?: string;
  syncTimestamp?: Date;
  cards?: Card[];
};
