import { supportedTokens } from "@/constants";
import { Order, OrderType, Token } from "@/types";

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

function getPrice(order: Order, orderType: OrderType) {
  const {
    takerAmount,
    makerAmount,
  } = getActualOrderAmount(order);
  let price = 0;

  switch (orderType) {
    // NOTE: price(baseTokenAmount(usdc))
    // baseTokenAmount (usdc) / quoteTokenAmount (weth)
    case 'bid': {
      price = takerAmount / makerAmount;
      break;
    }

    // NOTE: price(baseTokenAmount(usdc))
    // 1 / (quoteTokenAmount (weth) / baseTokenAmount (usdc))
    case 'ask': {
      price = 1 / (takerAmount / makerAmount);
      break;
    }
  }
  return price.toString();
};


function getQuantity(order: Order, orderType: OrderType) {
  const {
    takerAmount,
    makerAmount,
  } = getActualOrderAmount(order);
  const quantity = orderType === "bid" ? makerAmount : takerAmount;
  return quantity.toString();
}

function getCurrentTotal(
  orderIndex: number,
  orders: Order[],
  orderType: OrderType,
) {
  let total = 0;
  for (let i = 0; i <= orderIndex; i++) {
    const order = [...orders].reverse()[i];
    total += parseFloat(getQuantity(order, orderType));
  }
  return total.toString();
}

export function getParsedOrderBookData(orders: Order[], type: OrderType) {
  const orderBookData = orders.map((order, idx) => {
    // FIXME:: if any value is greater than 1 it should be to fixed 2, else it should be to fixed 9
    return {
      price: parseFloat(getPrice(order, type)).toFixed(9),
      quantity: parseFloat(getQuantity(order, type)).toFixed(6),
      total: parseFloat(getCurrentTotal(idx, orders, type)).toFixed(6),
      hash: order.orderHash,
    };
  });

  // Total should be cummulative in the reverse order;
  return orderBookData.map((datum, idx) => {
    return {
      ...datum,
      total: [...orderBookData].reverse()[idx].total,
    };
  }).reverse();
}

