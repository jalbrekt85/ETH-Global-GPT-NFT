import { useState, useEffect } from "react";
import {
  SimpleGrid,
  Box,
  useToast,
  Flex,
  Text,
  Button,
  Center,
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import { useUser } from "../context/UserContext";
import useETHBalance from "../hooks/useETHBalance";
import Loot from "../abis/contracts/Loot.json";
import { ethers } from "ethers";
import CollectionItem from "./CollectionItem"
import { BiRefresh } from "@react-icons/all-files/bi/BiRefresh";

const MyCollection = ({ ItemSet, deployedContract, setDeployedContract, deployedColor }) => {
  const [tokensOwned, setTokensOwned] = useState(0);
  const [count, setCount] = useState(1)
  const [tokens, setTokens] = useState([])
  const [theme, setTheme] = useState()
  const user = useUser();
  const [userBalance] = useETHBalance(user);
  const toast = useToast()

  async function getTheme() {
    const deployedTheme = await deployedContract.theme()
    setTheme(deployedTheme)
  }

  async function getTokens() {
    let currentTokens = []
    for (let i = 0; i < parseInt(tokensOwned, 10); i++) {
      // try {
      const tokenID = await deployedContract.tokenOfOwnerByIndex(user.address, i)
      
      const tokenImage = await deployedContract.tokenImage(tokenID)
      
      currentTokens.push({image: tokenImage, id: tokenID.toString()})
      // }
      // catch(e) {console.log(e)}
    }
    setTokens(currentTokens)
  }

  async function getBal() {
    const tokenBal = await deployedContract.balanceOf(user.address);
    setTokensOwned(tokenBal.toString());
  }

  async function claimLoot() {

    const tx = await deployedContract.claim(count);
    toast({
      title: "Claiming Loot",
      description: "Your transaction is pending",  
      status: "info",
      duration: 4000,
      isClosable: true,
    });
    await tx.wait();
   
   getBal()
   getTokens()
  }
  

  function CollectionList() {
    if (tokens) {
      return (
    tokens.map((token) => (
      <CollectionItem image={token.image} theme={theme} color={deployedColor} tokenId={token.id}/>
    )) 
    )}
    return <div></div>
  }

  useEffect( () => {
    if (deployedContract) {
       getBal();
       getTokens()
       getTheme()
    }
  }, [deployedContract, userBalance, user]);

  
 
  if (deployedContract) {
    return (
      <Box >
        <Text
          fontSize="2xl"
          bgGradient={[
            "linear(to-tr, teal.400, yellow.500)",
            "linear(to-t, blue.300, teal.600)",
            "linear(to-b, orange.200, purple.400)",
          ]}
          bgClip="text"
          fontWeight="bold"
        >
          Contract: {deployedContract.address + "\n"}
          Balance {
          tokensOwned}
        </Text>
        <Text
          fontSize="xl"
          bgGradient={[
            "linear(to-tr, teal.400, yellow.500)",
            "linear(to-t, blue.300, teal.600)",
            "linear(to-b, orange.200, purple.400)",
          ]}
          bgClip="text"
          fontWeight="bold"
        >
          Token ID
        </Text>
        <NumberInput size="md" maxW={24} defaultValue={1} min={1} max={10000} onChange={(val) => setCount(val)}>
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
        <Button
          mt={4}
          onClick={claimLoot}
          borderRadius="md"
          bgGradient={[
            "linear(to-tr, teal.400, yellow.500)",
            "linear(to-t, blue.300, teal.600)",
            "linear(to-b, orange.200, purple.400)",
          ]}
          color="white"
          px={4}
          h={8}
        >
          Claim
        </Button>
        <Button colorScheme="facebook" leftIcon={<BiRefresh />} onClick={getTokens}/>
        <Center height="50px" />
        <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }} alignContent="center">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>

        <CollectionList/>
        </SimpleGrid>
        </Box>
      </Box>
    );
  }
  return <div></div>;
};

export default MyCollection;
