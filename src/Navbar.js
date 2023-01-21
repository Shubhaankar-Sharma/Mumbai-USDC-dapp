import { Box, ButtonGroup, Flex, Heading, Spacer } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import './Navbar.css';

const Navbar = () => { 
    return (
        <Flex className="navbar" minWidth='max-content' alignItems='center' gap='2' marginTop='10px'>
            <Box p='2'>
                <Heading size='md' color='facebook.100' gap='2'>USDC Faucet</Heading>
            </Box>
            <Spacer />
            <ButtonGroup gap='2' marginEnd='4'>
                <ConnectButton />
            </ButtonGroup>
        </Flex>
    );
};


export default Navbar;