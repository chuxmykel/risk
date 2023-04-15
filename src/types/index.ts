export type Token = {
  name: string;
  logoURI: string;
  symbol: string;
  address: string;
  decimals: number;
};

export type Order = {
  makerAmount: string;
  takerAmount: string;
  makerToken: string;
  takerToken: string;
  orderHash: string;
};

export type OrderType = "ask" | "bid";

export type ParsedOrderBookData = {
  price: string;
  quantity: string;
  total: string;
  hash: string;
  quantityPercentage: string;
};

