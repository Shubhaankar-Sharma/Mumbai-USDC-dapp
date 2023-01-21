import React from 'react';
import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import {useTextC} from './theme.js';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, useAccount, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
//import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Box, Button, Center, Flex, Grid, GridItem, Spacer, useToast, Text, Link } from '@chakra-ui/react';
import Navbar from './Navbar';
// import { Br } from '@saas-ui/react';

// import { mode } from '@chakra-ui/theme-tools';

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

const Landing = () => {
  const textC = useTextC();
  return (
    <Box textColor={ textC }>
      <Text>Connect your wallet to get some mumbai testnet USDC</Text>
    </Box>
  )
};

const Faucet = () => { 

  console.log('getUSDC');
  const textC = useTextC();
  const { config, error: prepareError,
    isError: isPrepareError } = usePrepareContractWrite({
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
  const { data,  error, isError, write: request } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  const toast = useToast();
  // const toastIdRef = React.useRef();
  const id = 'err-toast'
  function errToast() {
    if (toast.isActive(id)) {
      return;
    }
    toast({
      id,
      description: 'Something went wrong, most likely you exhausted your faucet limit. See the console for more details.',
    });
    console.log((prepareError || error)?.message);
  }
  return ( 
    <Box>
      {isSuccess ?
        <Center>
          <Box>
            <Link href={`https://mumbai.polygonscan.com/tx/${data?.hash}`} color={ textC } isExternal>Success! View on PolygonScan</Link>
          </Box>
        </Center>
        :
        <Button textColor={textC} disabled={!request || isError || isPrepareError} onClick={() => request?.()}>{isLoading ? 'Requesting...' : 'Request'}</Button>
      }
      {(isPrepareError || isError) ? errToast() : null}
    </Box>
    
  )
};

const App = () => {
  const textC = useTextC();
  const { address, isConnected } = useAccount();

  console.log('address', address);
  console.log('isConnected', isConnected);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="App">
            <Grid
              templateAreas={`"header"
              "main"
              "footer"`}
              gridTemplateRows={'50px 1fr 30px'}
              gridTemplateColumns={'1fr'}
              height='100vh'
              gap='1'
              color='blackAlpha.700'
              fontWeight='bold'
              textColor={textC}
            >
              <GridItem pl='2' bg={"transparent"} area={'header'}>
                <Navbar />
              </GridItem>
              <GridItem pl='2' area={'main'} alignContent='center' alignItems='center'>
              {/* <VStack spacing='2' align='stretch'> */}
              <Flex alignItems='center' justifyContent='center' h='100%' flexDirection='column'>
                <Spacer />
                  <Center>
                    {isConnected ? <Faucet /> : <Landing />}
                </Center>
                <Spacer />
                </Flex>
                {/* </VStack> */}
              </GridItem>
              </Grid>
      </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;