export type UserData = {
  memberIds: {
    [key: string]: string;
  };
  cards: Card[];
};

export type Card = {
  id: string;
  uid: string;
  memberId: string;
  club: string;
  alias: string;
  expiry: string;
  qr: string;
};

export type Subscription = {
  alias: string;
  memberId: string;
  expiry: string;
  club: string;
};
