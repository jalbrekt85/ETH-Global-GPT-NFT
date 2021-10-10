import { useState, useEffect } from "react";
import {
  SimpleGrid,
  Box,
  useToast,
  Badge,
  Text,
  Button,
  Center,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Container,
  IconButton,
} from "@chakra-ui/react";
import { useUser } from "../context/UserContext";
import useETHBalance from "../hooks/useETHBalance";
import CollectionItem from "./CollectionItem"
import { HiRefresh } from "@react-icons/all-files/hi/HiRefresh";

const MyCollection = ({ deployedContract, deployedColor }) => {
  const [tokensOwned, setTokensOwned] = useState(0);
  const [count, setCount] = useState(1)
  const [tokens, setTokens] = useState([])
  const [theme, setTheme] = useState("")
  const user = useUser();
  const [userBalance] = useETHBalance(user);
  const toast = useToast()

  async function getTheme() {
    const deployedTheme = await deployedContract.theme()
    setTheme(deployedTheme)
  }

  async function getTokens() {
    getBal()
    let currentTokens = []
    for (let i = 0; i < parseInt(tokensOwned, 10); i++) {
      const tokenID = await deployedContract.tokenOfOwnerByIndex(user.address, i)
      
      const tokenImage = await deployedContract.tokenImage(tokenID)
      
      currentTokens.push({image: tokenImage, id: tokenID.toString()})
    }
    setTokens(currentTokens)
  }

  async function getBal() {
    console.log(deployedContract.address)
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
  }, []);

  console.log(deployedContract)
 
  if (deployedContract) {
    return (
      <Container maxW={'7xl'}>
        <HStack>
        <Text
          fontSize="lg"
          bgGradient={[
            "linear(to-tr, teal.400, yellow.500)",
            "linear(to-t, blue.300, teal.600)",
            "linear(to-b, orange.200, purple.400)",
          ]}
          bgClip="text"
          fontWeight="bold"
        >
          Contract: {deployedContract.address}
        </Text>
        <Badge
              borderRadius="full"
              px="5"
              colorScheme={deployedColor}
              alignItems="center"
            >
              {theme}
            </Badge>
            <Center height="30px" />
            </HStack>
        <Text
          fontSize="lg"
          bgGradient={[
            "linear(to-tr, teal.400, yellow.500)",
            "linear(to-t, blue.300, teal.600)",
            "linear(to-b, orange.200, purple.400)",
          ]}
          bgClip="text"
          fontWeight="bold"
        >
         
          Loot Owned: {tokensOwned}
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
        
        <Center height="40px" />
        <Heading
          bgGradient={[
            "linear(to-tr, teal.400, yellow.500)",
            "linear(to-t, blue.300, teal.600)",
            "linear(to-b, orange.200, purple.400)",
          ]}
          bgClip="text"
          fontWeight="bold">My Loot:</Heading>
           <IconButton icon={<HiRefresh />} onClick={getTokens}/>
        <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }} alignContent="center">
        <SimpleGrid columns={{ base: 2, md: 2 }} spacing={{ base: 2, lg: 8 }}>
        <CollectionList/>
        </SimpleGrid>
        </Box>
      </Container>
    );
  } else {
  return <div>
    <Text
          fontSize="lg"
          bgGradient={[
            "linear(to-tr, teal.400, yellow.500)",
            "linear(to-t, blue.300, teal.600)",
            "linear(to-b, orange.200, purple.400)",
          ]}
          bgClip="text"
          margin="10px"
          noOfLines={[4, 5, 6]}
        >Deploy/Load a Loot Contract and then come back</Text>
  </div>;
  }
};

export default MyCollection;
