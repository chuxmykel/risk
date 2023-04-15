import React from 'react'
import Table from 'react-bootstrap/Table';

import { Order, OrderType } from '@/types';
import {
  getParsedOrderBookData,
  getTokenDetails
} from '@/utils';

interface OrderBookTableProps {
  orders: Order[];
  type: OrderType;
  quoteToken: string;
  baseToken: string;
};

const OrderBookTable: React.FC<OrderBookTableProps> = ({
  orders,
  type,
  baseToken,
  quoteToken,
}) => (
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
        {
          getParsedOrderBookData(orders, type)
            .map(order => {
              return (
                <tr key={order.hash}>
                  <td
                    className={`${type === "bid" ? "text-green-600" : "text-red-600"}`}
                  >
                    {order.price}
                  </td>
                  <td>
                    {order.quantity}
                  </td>
                  <td>
                    {order.total}
                  </td>
                </tr>
              );
            })
        }
      </tbody>
    </Table>
  </div>
);

export default OrderBookTable;

