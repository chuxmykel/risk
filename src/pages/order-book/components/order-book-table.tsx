import React from 'react'

import { Order } from '@/types';
import {
  getActualOrderAmount,
  getTokenDetails
} from '@/utils';

interface OrderBookTableProps {
  orders: Order[];
  type: "bid" | "ask";
  quoteToken: string;
  baseToken: string;
  reverse?: boolean;
};

const OrderBookTable: React.FC<OrderBookTableProps> = ({
  orders,
  type,
  baseToken,
  quoteToken,
  reverse,
}) => {
  function getPrice(order: Order) {
    const {
      takerAmount,
      makerAmount,
    } = getActualOrderAmount(order);
    let price = 0;

    switch (type) {
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
    return price.toFixed(2);
  };

  function getQuantity(order: Order) {
    const {
      takerAmount,
      makerAmount,
    } = getActualOrderAmount(order);
    const quantity = type === "bid" ? makerAmount : takerAmount;
    return quantity.toFixed(4);
  }

  function getCurrentTotal(order: Order, orderIndex: number) {
    let total = 0;
    for (let i = 0; i <= orderIndex; i++) {
      total += parseFloat(getQuantity(orders[i]));
    }
    return total.toFixed(2);
  }

  function getOrdersUI() {
    const ordersUI = orders
      .filter(order => parseFloat(getQuantity(order)) > 0.00001)
      .map((order, idx) => {

        return (
          <tr>
            <td>
              {getPrice(order)}
            </td>
            <td>
              {getQuantity(order)}
            </td>
            <td>
              {getCurrentTotal(order, idx)}
            </td>
          </tr>
        );
      });
    return reverse ? ordersUI.reverse() : ordersUI;
  }

  return (
    <div>
      {/* BIDS are arranged in DESC */}
      {/* ASKS are arranged in ASC fullscreen, DESC in comparation */}
      {/* for BIDS, the total is cummulative from top to bottom */}
      {/* for ASKS, the total is cummulative from top to bottom on the fullscreen, bottom to top on in comparation */}
      <h1>{type === "bid" ? "BIDS" : "ASKS"}</h1>
      <table className={`${type === "bid" ? "text-green-600" : "text-red-600"}`}>
        <thead>
          <th>{`Price(${getTokenDetails(baseToken).symbol})`}</th>
          <th>{`Quantity(${getTokenDetails(quoteToken).symbol})`}</th>
          <th>{`Total(${getTokenDetails(quoteToken).symbol})`}</th>
        </thead>
        <tbody>
          {getOrdersUI()}
        </tbody>
      </table>
    </div>
  )
}

export default OrderBookTable;

