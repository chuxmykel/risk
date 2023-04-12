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
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromToken, setFromToken] = useState<Token | null>(null);

  function setToken(tokenName: string, type: "to" | "from"): void {
    const [newSelectedToken] = supportedTokens.filter(token => token.name === tokenName);
    type === "to" ? setToToken(newSelectedToken) : setFromToken(newSelectedToken);
  }
  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!toToken || !fromToken) return;
    router.push(`/order-book/${fromToken?.address}/${toToken?.address}`);
    return;
  }

  return (
    <div className='border-2 border-red-300'>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>You pay</Form.Label>
          <TokenDropdown
            tokens={supportedTokens}
            selectedToken={fromToken}
            setSelectedToken={(tokenName) => setToken(tokenName, "from")}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>You receive</Form.Label>
          <TokenDropdown
            tokens={supportedTokens}
            selectedToken={toToken}
            setSelectedToken={(tokenName) => setToken(tokenName, "to")}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={!toToken || !fromToken}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default ExchangeForm;
