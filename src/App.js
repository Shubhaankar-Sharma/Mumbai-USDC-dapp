import React from 'react';
import './App.css';
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, useAccount, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
//import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectButton } from '@rainbow-me/rainbowkit';



const { chains, provider } = configureChains(
  [polygonMumbai],
  [
//    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Mumbai USDC Faucet',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const Faucet = () => { 

  console.log('getUSDC');
  const { config } = usePrepareContractWrite({
    address: '0x9019a492Cce0CF7c2f1dc04D1B63b6A1bcda285a',
    abi: [
      {
        "inputs": [],
        "name": "request",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    functionName: 'request',
  });
  const { data, write: request } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  return ( 
    <div className="FaucetBtn">
      {isSuccess ?
        <div>
          <p>Success!</p>
          <div>
            <a href={`https://mumbai.polygonscan.com/tx/${data?.hash}`} target="_blank" rel="noreferrer">View on PolygonScan</a>
          </div>
        </div>
        :
        <button disabled={!request} onClick={() => request?.()}>{isLoading ? 'Requesting...' : 'Request'}</button>
      }
    </div>
    
  )
};

const App = () => {
  const { address, isConnected } = useAccount();
  console.log('address', address);
  console.log('isConnected', isConnected);


  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
      <div className="App">
          <h1>Mumbai USDC Faucet</h1>
          <div className="ConnectBtn">
            <ConnectButton />
          </div>
          {isConnected ? <Faucet /> : null}
      </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;