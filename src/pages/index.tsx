import ExchangeForm from "@/components/exchange-form";

export default function Home() {
  return (
    <div>
      <h1 className="text-slate-600 mb-12">Select a token pair to view order book.</h1>
      <div className="px-8 py-20 rounded-xl shadow shadow-black">
        <ExchangeForm />
      </div>
    </div>
  );
}

