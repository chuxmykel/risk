import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';

import TokenDropdown from './token-dropdown';
import { Token } from '@/types';
import { supportedTokens } from '@/constants';

interface ExchangeFormProps {
  // tokens: Token[];
}

const ExchangeForm: React.FC<ExchangeFormProps> = () => {
  const router = useRouter();
  const [baseToken, setBaseToken] = useState<Token | null>(null);
  const [quoteToken, setQuoteToken] = useState<Token | null>(null);

  function setToken(tokenName: string, type: "to" | "from"): void {
    const [newSelectedToken] = supportedTokens.filter(token => token.name === tokenName);
    type === "to" ? setQuoteToken(newSelectedToken) : setBaseToken(newSelectedToken);
  }
  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!quoteToken || !baseToken) return;
    router.push(`/order-book/${quoteToken?.address}/${baseToken?.address}`);
    return;
  }

  return (
    <div className='border-2 border-red-300'>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Base Token</Form.Label>
          <TokenDropdown
            tokens={supportedTokens}
            selectedToken={baseToken}
            setSelectedToken={(tokenName) => setToken(tokenName, "from")}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Quote Token</Form.Label>
          <TokenDropdown
            tokens={supportedTokens}
            selectedToken={quoteToken}
            setSelectedToken={(tokenName) => setToken(tokenName, "to")}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={!quoteToken || !baseToken}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default ExchangeForm;
