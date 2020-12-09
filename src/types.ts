export type MemberData = {
  cardNumber: string;
  name: string;
  expiry: string;
  club: string;
};

export type QrData = {
  cardNumber: string;
  name: string;
  expiry: string;
  club: string;
};

export type Card = {
  id: string;
  cardNumber: string;
  name: string;
  expiry: string;
  club: string;
  qr: string;
};

export type AppContext = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isFetchingData: boolean;
  setIsFetchingData: (isFetchingData: boolean) => void;
  isMenuActive: boolean;
  setIsMenuActive: (isMenuActive: boolean) => void;
  data: Data;
  setData: (data: Data) => void;
};

export type Data = {
  email?: string;
  cards?: Card[];
};
