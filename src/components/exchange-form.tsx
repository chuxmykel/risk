import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';

import TokenDropdown from './token-dropdown';
import { Token } from '@/types';
import { supportedTokens } from '@/constants';

const ExchangeForm: React.FC = () => {
  const router = useRouter();
  const [baseToken, setBaseToken] = useState<Token | null>(null);
  const [quoteToken, setQuoteToken] = useState<Token | null>(null);

  function setToken(tokenName: string, type: "quote" | "base"): void {
    const [newSelectedToken] = supportedTokens.filter(token => token.name === tokenName);
    type === "quote" ? setQuoteToken(newSelectedToken) : setBaseToken(newSelectedToken);
  }
  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!quoteToken || !baseToken) return;
    router.push(`/order-book/${quoteToken?.address}/${baseToken?.address}`);
    return;
  }

  return (
    <div className='flex justify-center min-w-full text-[#272343] h-96'>
      <Form onSubmit={handleSubmit} className='flex flex-col items-center w-96'>
        <Form.Group className="mb-3 flex flex-col items-center justify-center flex-1">
          <Form.Label className='font-bold text-lg mb-4'>Base Token</Form.Label>
          <TokenDropdown
            selectedToken={baseToken}
            setSelectedToken={(tokenName) => setToken(tokenName, "base")}
          />
        </Form.Group>

        <Form.Group className="mb-3 flex flex-col items-center justify-center flex-1">
          <Form.Label className='font-bold text-lg mb-4'>Quote Token</Form.Label>
          <TokenDropdown
            selectedToken={quoteToken}
            setSelectedToken={(tokenName) => setToken(tokenName, "quote")}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={!quoteToken || !baseToken}
        >
          View Order Book
        </Button>
      </Form>
    </div>
  );
}

export default ExchangeForm;
