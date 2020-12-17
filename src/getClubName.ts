const CLUBS: { [key: string]: string } = {
  oslobdsm: 'Oslo BDSM',
  slm: 'Scandinavian Leather Men',
  smb: 'SM Bergen',
};

const getClubName = (club: string) => CLUBS[club] || club;

export default getClubName;
