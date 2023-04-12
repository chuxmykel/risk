import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const OrderBook = () => {
  const router = useRouter();
  const baseUrl = "https://api.0x.org/orderbook/v1";
  const { quoteToken, baseToken } = router.query;
  const [orderBook, setOrderBook] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${baseUrl}?quoteToken=${quoteToken}&baseToken=${baseToken}`
      );
      const data = await res.json();
      setOrderBook(data);
    })();
  }, []);
  return (
    <div>{JSON.stringify(orderBook)}</div>
  )
}

export default OrderBook;
