import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
    })();
  }, []);

  return orderBook && (
    <div>
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
  );
}

export default OrderBook;
