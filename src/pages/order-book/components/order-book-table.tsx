import React from 'react'

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
}) => {
  const headers = [
    <TableData value={`Price(${getTokenDetails(baseToken).symbol})`} key={1} />,
    <TableData value={`Quantity(${getTokenDetails(quoteToken).symbol})`} key={2} />,
    <TableData value={`Total(${getTokenDetails(quoteToken).symbol})`} key={3} />,
  ];
  return (
    <div className='relative w-full'>
      <div
        className='flex gap-4 font-bold border border-slate-50 p-2 bg-gradient-to-l'
      >
        {type === "ask" ? headers.reverse() : headers}
      </div>

      <>
        {
          getParsedOrderBookData(orders, type)
            .map(order => {
              const data = [
                <TableData
                  value={order.price}
                  color={`${type === "bid" ? "text-green-600" : "text-red-600"}`}
                  key={1}
                />,
                <TableData value={order.quantity} key={2} />,
                <TableData value={order.total} key={3} />,
              ];
              const bidGradientStyles = `bg-gradient-to-l from-green-300 to-${order.quantityPercentage}% to-transparent`;
              const askGradientStyles = `bg-gradient-to-r from-red-300 to-${order.quantityPercentage}% to-transparent`;
              return (
                <div
                  key={order.hash}
                  className={`flex gap-4 border border-t-0 border-slate-50 p-2 ${type === "bid" ? bidGradientStyles : askGradientStyles}`}
                >
                  {type === "ask" ? data.reverse() : data}
                </div>
              );
            })
        }
      </>
    </div>
  );
};

export default OrderBookTable;

interface TableDataProps {
  color?: string;
  value: string;
};

const TableData: React.FC<TableDataProps> = ({ color, value }) => {
  return (
    <div className={`${color ? color : "text-slate-500"} w-1/3`}>
      {value}
    </div>
  );
}

