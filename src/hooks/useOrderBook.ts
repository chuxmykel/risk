import { useState, useEffect } from 'react';

import { Order } from '@/types';

interface OrderBookState {
  bids: Order[];
  asks: Order[];
};

export default function useOrderBook(baseToken: string, quoteToken: string) {
  const baseURL = "https://api.0x.org/orderbook/v1";
  const [orderBook, setOrderBook] = useState<OrderBookState>({
    bids: [],
    asks: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${baseURL}?quoteToken=${quoteToken}&baseToken=${baseToken}`
        );
        const data = await res.json();
        const orderMapper = (record: any): Order => {
          const mappedRecord: Order = {
            ...record.order,
            ...record.metaData,
          }

          return mappedRecord;
        };
        const newOrderBook = {
          asks: data.asks.records.map(orderMapper),
          bids: data.bids.records.map(orderMapper),
        };

        setOrderBook(newOrderBook);
      } catch (error) {
        // TODO: Handle Error
      } finally {
        setIsLoading(false);
      }
    })();
  }, [baseToken, quoteToken]);

  return { orderBook, isLoading };
}
