import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Spinner from "react-bootstrap/Spinner";

import OrderBookTable from "../../components/order-book-table";
import { getTokenDetails } from "@/utils";
import { useOrderBook } from "@/hooks";
import Link from "next/link";

const OrderBook = () => {
  const router = useRouter();
  const websocketURL = "wss://api.0x.org/orderbook/v1";
  const baseToken: string = router.query.baseToken as string;
  const quoteToken: string = router.query.quoteToken as string;
  const { orderBook, isLoading } = useOrderBook(baseToken, quoteToken);
  const {
    lastJsonMessage,
    readyState,
    sendJsonMessage,
  } = useWebSocket(websocketURL);
  const wsMessage = {
    type: "subscribe",
    channel: "orders",
    requestId: `${baseToken}${quoteToken}`,
    payload: {
      takerToken: quoteToken, makerToken: baseToken,
    }
  };
  const subscribe = useCallback(
    () => sendJsonMessage(wsMessage),
    [quoteToken, baseToken]
  );
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      subscribe();
    }
    // console.log(`The websocket is currently : ${connectionStatus}`);
  }, [readyState]);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      // @ts-ignore
      // console.log(lastJsonMessage?.payload, "lastMessage =================> ");
    }
  }, [lastJsonMessage, readyState]);


  if (!isLoading && orderBook.asks.length < 1) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex justify-center py-5">
          <h1>{quoteToken && `${getTokenDetails(quoteToken).symbol}/${getTokenDetails(baseToken).symbol}`}</h1>
        </div>
        <h4 className="font-bold text-xl">
          No orderbook data for token pair.
        </h4>
        <Link href={"/"}>Go Home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-full w-full">
      {isLoading ?
        (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex justify-center py-5">
              <h1>{`${getTokenDetails(quoteToken).symbol}/${getTokenDetails(baseToken).symbol}`}</h1>
            </div>

            {orderBook && (
              <div className="flex gap-10 justify-between w-3/4">
                <OrderBookTable
                  orders={orderBook.bids}
                  type="bid"
                  baseToken={baseToken}
                  quoteToken={quoteToken}
                />
                <OrderBookTable
                  orders={orderBook.asks}
                  type="ask"
                  baseToken={baseToken}
                  quoteToken={quoteToken}
                />
              </div>
            )}
          </>
        )
      }
    </div>
  );
}

export default OrderBook;
