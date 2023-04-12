import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import OrderBookTable from "../../components/order-book-table";
import { Order } from "@/types";


interface OrderBookState {
  bids: Order[],
  asks: Order[],
};

const OrderBook = () => {
  const router = useRouter();
  const baseUrl = "https://api.0x.org/orderbook/v1";
  const { quoteToken, baseToken } = router.query;
  const [orderBook, setOrderBook] = useState<OrderBookState>({
    bids: [],
    asks: [],
  });
  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${baseUrl}?quoteToken=${quoteToken}&baseToken=${baseToken}`
      );
      const data = await res.json();
      setOrderBook({
        asks: data.asks.records.map((record: any) => record.order),
        bids: data.bids.records.map((record: any) => record.order),
      });
      console.log(orderBook, "order book ===============> ");
    })();
  }, []);
  // return (<div>{JSON.stringify(orderBook)}</div>)

  return orderBook && (
    <div>
      <OrderBookTable
        orders={orderBook.bids}
        type="bid"
      />
      <OrderBookTable
        orders={orderBook.asks}
        type="ask"
      />
    </div>
  );
}

export default OrderBook;
