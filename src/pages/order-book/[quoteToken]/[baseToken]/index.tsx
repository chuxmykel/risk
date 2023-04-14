import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useWebSocket, { ReadyState } from 'react-use-websocket';

import OrderBookTable from "../../components/order-book-table";
import { Order } from "@/types";
import { getTokenDetails } from "@/utils";


interface OrderBookState {
  bids: Order[];
  asks: Order[];
};

const OrderBook = () => {
  const router = useRouter();
  const baseURL = "https://api.0x.org/orderbook/v1";
  const websocketURL = "wss://api.0x.org/orderbook/v1";
  const baseToken: string = router.query.baseToken as string;
  const quoteToken: string = router.query.quoteToken as string;
  // const baseToken = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  // const quoteToken = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
  const [orderBook, setOrderBook] = useState<OrderBookState>({
    bids: [],
    asks: [],
  });

  useEffect(() => {
    (async () => {
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

      // Slice the array to make sure the order book is symmetrical.
      const minLength = Math.min(newOrderBook.bids.length, newOrderBook.asks.length);
      newOrderBook.asks = newOrderBook.asks.slice(0, minLength);
      newOrderBook.bids = newOrderBook.bids.slice(0, minLength);
      setOrderBook(newOrderBook);
    })();
  }, [baseToken, quoteToken]);

  const {
    lastJsonMessage,
    readyState,
    sendJsonMessage,
  } = useWebSocket(websocketURL);

  const subscribe = useCallback(() => sendJsonMessage({
    type: "subscribe",
    channel: "orders",
    requestId: `${baseToken}${quoteToken}`,
    payload: {
      takerToken: quoteToken,
      makerToken: baseToken,
    }
  }), [quoteToken, baseToken]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if (lastJsonMessage !== null) {
      // @ts-ignore
      console.log(lastJsonMessage?.payload, "lastMessage =================> ");
      // TODO: Updates are coming in now. How will you update the UI?
    }
  }, [lastJsonMessage, readyState]);


  useEffect(() => {

    if (readyState === ReadyState.OPEN) {
      subscribe();
    }

    console.log(`The websocket is currently : ${connectionStatus}`);
  }, [readyState]);

  return (
    <main className="flex flex-col">
      <div className="flex justify-center py-5">
        <h1>{`${getTokenDetails(quoteToken).symbol}/${getTokenDetails(baseToken).symbol}`}</h1>
      </div>
      {orderBook && (
        <div className="flex flex-1 gap-10 justify-center px-40">
          <OrderBookTable
            orders={orderBook.bids}
            type="bid"
            baseToken={baseToken}
            quoteToken={quoteToken}
            reverse
          />
          <OrderBookTable
            orders={orderBook.asks}
            type="ask"
            baseToken={baseToken}
            quoteToken={quoteToken}
          />
        </div>
      )}
    </main>
  );
}

export default OrderBook;
