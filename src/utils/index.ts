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

function getDecimalLength(property: number): number {
  return property > 1 ? 2 : 9;
}

export function getParsedOrderBookData(orders: Order[], type: OrderType) {
  const orderBookData = orders.map((order, idx) => {
    const price = parseFloat(getPrice(order, type));
    const quantity = parseFloat(getQuantity(order, type));
    const total = parseFloat(getCurrentTotal(idx, orders, type));
    return {
      price: price.toFixed(getDecimalLength(price)),
      quantity: quantity.toFixed(getDecimalLength(quantity)),
      total: total.toFixed(getDecimalLength(total)),
      hash: order.orderHash,
    };
  });

  const orderQuantityTotal = orderBookData[orderBookData.length - 1].total;


  // Total should be cummulative in the reverse order;
  return orderBookData.map((datum, idx) => {
    return {
      ...datum,
      total: [...orderBookData].reverse()[idx].total,
    };
  }).map(datum => {
    const percentage = Math.ceil(((parseFloat(datum.total) / parseFloat(orderQuantityTotal))) * 100);
    return {
      ...datum,
      quantityPercentage: getNearestMultipleOfFive(percentage).toString(),
    };
  }).reverse();
}

function getNearestMultipleOfFive(value: number) {
  if (value >= 100) return 100;
  if (value < 5) return 5;
  const remainder = value % 5;
  if (remainder > 5) {
    return value - remainder;
  } else {
    return value + (10 - remainder);
  }
}
