import React from 'react'

import { Order } from '@/types';

interface OrderBookTableProps {
  orders: Order[];
  type: "bid" | "ask";
};

const OrderBookTable: React.FC<OrderBookTableProps> = ({ orders, type }) => {
  function getPrice(order: Order) {
    // FIXME: Check if these values need to be multiplied
    // by the decimal parameter provided in the tokens object
    const takerAmount = parseFloat(order.takerAmount);
    const makerAmount = parseFloat(order.makerAmount);
    console.log(takerAmount, "takerAmount ==========> ")
    console.log(makerAmount, "makerAmount ==========> ")
    let price = 0;
    switch (type) {
      case 'bid': {
        price = takerAmount / makerAmount;
        break;
      }
      case 'ask': {
        price = 1 / (takerAmount / makerAmount);
        break;
      }

      default: {
        break;
      }
    }
    return price;
  };
  return (
    <table>
      <thead>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total</th>
      </thead>
      <tbody>
        {orders.map((order) => {
          return (
            <tr>
              <td>{getPrice(order)}</td>
              <td></td>
              <td></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )
}

export default OrderBookTable;
