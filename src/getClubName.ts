const CLUBS: { [key: string]: string } = {
  aresia: "Are Si'a",
  chains: 'Chains',
  oslobdsm: 'Oslo BDSM',
  rbk: 'Rogaland BDSM Klubb',
  slm: 'Scandinavian Leather Men',
  smb: 'SM Bergen',
  smil: 'SMiL Norge',
  sologmaane: 'Losje Sol & Måne',
  sorlandet: 'Sørlandet BDSM',
  valeyja: 'Val Eyja',
  wish: 'Wish Oslo',
};

const getClubName = (club: string) => CLUBS[club] || club;

export default getClubName;
