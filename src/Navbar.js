import { Box, ButtonGroup, Flex, Heading, Spacer, useColorMode, IconButton } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import './Navbar.css';
import { useTextC } from './theme.js';
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
    var {toggleColorMode, colorMode} = useColorMode();
    var textC = useTextC();
    return (
        <Flex className="navbar" minWidth='max-content' alignItems='center' gap='2' marginTop='10px'>
            <Box p='2'>
                <Heading size='md' color={textC} gap='2'>USDC Faucet</Heading>
            </Box>
            <Spacer />
            <ButtonGroup gap='2' marginEnd='4'>
                <IconButton
                    rounded="full"
                    aria-label="change theme"
                    onClick={toggleColorMode} icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
                />
                <ConnectButton />
            </ButtonGroup>
        </Flex>
    );
};


export default Navbar;