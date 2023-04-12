export type Token = {
  name: string;
  // value: string;
  logoURI: string;
  // about: string;
  symbol: string;
  address: string;
};

export type Order = {
  makerAmount: string;
  takerAmount: string;
  makerToken: string;
  takerToken: string;
};

