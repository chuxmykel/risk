import React from 'react'
import Table from 'react-bootstrap/Table';

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
    return price.toString();
  };

  function getQuantity(order: Order) {
    const {
      takerAmount,
      makerAmount,
    } = getActualOrderAmount(order);
    const quantity = type === "bid" ? makerAmount : takerAmount;
    return quantity.toString();
  }

  function getCurrentTotal(orderIndex: number) {
    let total = 0;
    for (let i = 0; i <= orderIndex; i++) {
      total += parseFloat(getQuantity(orders[i]));
    }
    return total.toString();
  }

  function getOrdersUI() {
    const ordersUI = orders
      .map((order, idx) => {

        return (
          <tr key={order.orderHash}>
            <td
              className={`${type === "bid" ? "text-green-600" : "text-red-600"} w-full`}
            >
              {parseFloat(getPrice(order)).toFixed(2)}
            </td>
            <td>
              {getQuantity(order)}
            </td>
            <td>
              {getCurrentTotal(idx)}
            </td>
          </tr>
        );
      });
    return reverse ? ordersUI.reverse() : ordersUI;
  }

  // NOTE:
  // BIDS are arranged in DESC
  // ASKS are arranged in ASC fullscreen, DESC in comparison
  // for BIDS, the total is cummulative from top to bottom
  // for ASKS, the total is cummulative from top to bottom on the fullscreen, bottom to top on in comparison

  return (
    <div className='w-full'>
      <Table hover variant="dark">
        <thead>
          <tr>
            <th>
              {`Price(${getTokenDetails(baseToken).symbol})`}
            </th>
            <th>
              {`Quantity(${getTokenDetails(quoteToken).symbol})`}
            </th>
            <th>
              {`Total(${getTokenDetails(quoteToken).symbol})`}
            </th>
          </tr>
        </thead>
        <tbody>
          {getOrdersUI()}
        </tbody>
      </Table>
    </div>
  )
}

export default OrderBookTable;

