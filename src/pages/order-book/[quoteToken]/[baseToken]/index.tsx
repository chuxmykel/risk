import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Spinner from "react-bootstrap/Spinner";

import OrderBookTable from "../../components/order-book-table";
import { getParsedOrderBookData, getTokenDetails } from "@/utils";
import { useOrderBook } from "@/hooks";
import Link from "next/link";

const OrderBook = () => {
  const router = useRouter();
  const websocketURL = "wss://api.0x.org/orderbook/v1";
  const baseToken: string = router.query.baseToken as string;
  const quoteToken: string = router.query.quoteToken as string;
  const [tokenSymbols, setTokenSymbols] = useState({
    baseToken: "",
    quoteToken: "",
  });
  const { orderBook, isLoading } = useOrderBook(baseToken, quoteToken);
  const {
    lastJsonMessage,
    readyState,
    sendJsonMessage,
  } = useWebSocket(websocketURL);
  const subscribe = useCallback(
    () => {
      const wsMessage = {
        type: "subscribe",
        channel: "orders",
        requestId: `${baseToken}${quoteToken}`,
        payload: {
          takerToken: quoteToken, makerToken: baseToken,
        }
      };
      sendJsonMessage(wsMessage);
    },
    [sendJsonMessage, baseToken, quoteToken]
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
    setTokenSymbols({
      baseToken: getTokenDetails(baseToken)?.symbol,
      quoteToken: getTokenDetails(quoteToken)?.symbol,
    });
    // console.log(`The websocket is currently : ${connectionStatus}`);
  }, [readyState, subscribe, baseToken, quoteToken]);

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
          <h1>{quoteToken && `${tokenSymbols.quoteToken}/${tokenSymbols.baseToken}`}</h1>
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
              <h1>{`${tokenSymbols.quoteToken}/${tokenSymbols.baseToken}`}</h1>
            </div>

            {orderBook && (
              <div className="flex gap-10 justify-between w-3/4">
                <OrderBookTable
                  orders={getParsedOrderBookData(orderBook.bids, "bid")}
                  type="bid"
                  baseToken={tokenSymbols.baseToken}
                  quoteToken={tokenSymbols.quoteToken}
                />
                <OrderBookTable
                  orders={getParsedOrderBookData(orderBook.asks, "ask")}
                  type="ask"
                  baseToken={tokenSymbols.baseToken}
                  quoteToken={tokenSymbols.quoteToken}
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
