import { supportedTokens } from "@/constants";
import { Order, Token } from "@/types";

export function getTokenDetails(tokenAddress: string): Token {
  // Token will always be found since we have a constant list of supportedTokens
  return supportedTokens
    .find(token => token.address === tokenAddress) as Token;
}

export function getActualOrderAmount(order: Order) {
  const takerTokenDetails = getTokenDetails(order.takerToken);
  const makerTokenDetails = getTokenDetails(order.makerToken);
  const takerAmount = parseFloat(order.takerAmount) / (10 ** takerTokenDetails.decimals);
  const makerAmount = parseFloat(order.makerAmount) / (10 ** makerTokenDetails.decimals);
  return {
    takerAmount,
    makerAmount,
  };
}
