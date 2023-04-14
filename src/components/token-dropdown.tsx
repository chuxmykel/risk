import { useState } from 'react';
import Image from 'next/image'
import Button from 'react-bootstrap/Button';

import { Token } from '@/types';

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
  const [showTokenMenu, setShowTokenMenu] = useState<boolean>(false);
  function handleClick(tokenName: string) {
    setSelectedToken(tokenName);
    setShowTokenMenu(false);
  }

  function toggleTokenMenu() {
    setShowTokenMenu((prev: boolean) => !prev);
  }
  return (
    <div className='relative'>
      <Button onClick={toggleTokenMenu} variant='light'>
        {selectedToken ? (<TokenNameAndLogo token={selectedToken} />) : "Select Token"}
      </Button>

      <>
        {showTokenMenu && (
          <div
            className='absolute -right-1/2 top-12 bg-white border border-slate-50 w-60 z-10 p-4 rounded-lg'
          >
            <div className='flex flex-col gap-3 items-center'>

              {tokens.map(token => {
                return (
                  <div
                    className='hover:bg-slate-100 cursor-pointer w-full flex justify-center'
                    onClick={() => handleClick(token.name)}
                  >
                    <TokenNameAndLogo
                      token={token}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default TokenDropdown;

interface TokenNameAndLogoProps {
  token: Token;
}

const TokenNameAndLogo: React.FC<TokenNameAndLogoProps> = ({ token }) => {
  return (
    <div className='flex w-full gap-2 h-full items-center justify-start p-2'>
      <div>
        <Image
          src={token.logoURI}
          alt={token.name}
          width={20}
          height={20}
        />
      </div>
      <span>{token.symbol}</span>
    </div>
  );
}

