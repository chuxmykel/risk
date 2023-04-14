import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useWebSocket, { ReadyState } from 'react-use-websocket';

import OrderBookTable from "../../components/order-book-table";
import { Order } from "@/types";


interface OrderBookState {
  bids: Order[];
  asks: Order[];
};

const OrderBook = () => {
  const router = useRouter();
  const baseUrl = "https://api.0x.org/orderbook/v1";
  const baseToken: string = router.query.baseToken as string;
  const quoteToken: string = router.query.quoteToken as string;
  const [orderBook, setOrderBook] = useState<OrderBookState>({
    bids: [],
    asks: [],
  });
  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket("wss://api.0x.org/orderbook/v1");

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
    (async () => {
      const res = await fetch(
        `${baseUrl}?quoteToken=${quoteToken}&baseToken=${baseToken}`
      );
      const data = await res.json();
      const orderMapper = (record: any): Order => {
        const mappedRecord: Order = {
          ...record.order,
          ...record.metaData,
        }

        return mappedRecord;
      };
      setOrderBook({
        asks: data.asks.records.map(orderMapper),
        bids: data.bids.records.map(orderMapper),
      });
    })();
  }, [baseToken, quoteToken, readyState]);

  useEffect(() => {

    if (readyState === ReadyState.OPEN) {
      subscribe();
    }

    console.log(`The websocket is currently : ${connectionStatus}`);
  }, [readyState]);

  return orderBook && (
    <div>
      <OrderBookTable
        orders={orderBook.asks}
        type="ask"
        baseToken={baseToken}
        quoteToken={quoteToken}
      />
      <OrderBookTable
        orders={orderBook.bids}
        type="bid"
        baseToken={baseToken}
        quoteToken={quoteToken}
        reverse
      />
    </div>
  );
}

export default OrderBook;
