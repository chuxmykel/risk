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
};

const OrderBookTable: React.FC<OrderBookTableProps> = ({ orders, type, baseToken, quoteToken }) => {
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

  return (
    <div>
      <h1>{type === "bid" ? "BIDS" : "ASKS"}</h1>
      <table>
        <thead>
          <th>{`Price(${getTokenDetails(baseToken).symbol})`}</th>
          <th>{`Quantity(${getTokenDetails(quoteToken).symbol})`}</th>
          <th>{`Total(${getTokenDetails(baseToken).symbol})`}</th>
        </thead>
        <tbody>
          {
            orders
              // To remove weird orders. Wrong way perhaps??
              // .filter(order => parseFloat(getPrice(order)) < 10000000000)
              .map((order) => {
                return (
                  <tr>
                    <td>
                      {getPrice(order)}
                    </td>
                    <td>
                      {getQuantity(order)}
                    </td>
                    <td>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  )
}

export default OrderBookTable;

