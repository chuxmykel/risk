// import { useState, useEffect } from "react";

import ExchangeForm from "@/components/exchange-form";

export default function Home() {
  // TODO: Fetch the supported tokens rather than hard code them???
  // const [tokens, setTokens] = useState([]);
  // useEffect(() => {
  //   const url = "https://tokens.coingecko.com/uniswap/all.json";
  //   (async () => {
  //     const { tokens } = await fetch(url)
  //       .then(res => res.json());
  //     setTokens(tokens);
  //
  //   })();
  // }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <ExchangeForm />
    </main>
  );
}

