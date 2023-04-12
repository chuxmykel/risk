import React from 'react'
// import Image from 'next/image'
import Form from "react-bootstrap/Form";

import { Token } from '@/types';
// import { supportedTokens } from '@/constants';

interface TokenDropdownProps {
  selectedToken: Token | null;
  setSelectedToken: (token: string) => void;
  tokens: Token[],
}

const TokenDropdown: React.FC<TokenDropdownProps> = ({
  selectedToken,
  setSelectedToken,
  tokens
}) => {
  function handleChange(e: any) {
    const tokenName = e.target.value;
    setSelectedToken(tokenName);
  }

  return (
    <Form.Select name="tokens" onChange={handleChange}>
      {!selectedToken && <option>Choose Token</option>}
      {tokens.map(token => {
        // return (
        //   <div key={token.name}>
        //
        //     <div className='flex'>
        //       <div>
        //         <Image
        //           src={token.logoURI}
        //           alt={token.name}
        //           width={25}
        //           height={25}
        //         />
        //       </div>
        //
        //       <option value={token.name}>{token.name}</option>
        //     </div>
        //   </div>
        // );
        return (
          <option key={token.name} value={token.name} selected={token.name === selectedToken?.name}>
            {token.symbol}
          </option>
        );
      })}
    </Form.Select>
  );
}

export default TokenDropdown;
