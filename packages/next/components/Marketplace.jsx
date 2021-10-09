import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Link,
  Image,
  Text,
  Divider,
  HStack,
  Tag,
  Wrap,
  WrapItem,
  Table,
  useColorModeValue,
  Container,
  Stack,
  Thead,
  Th,
  List,
  ListItem,
  StackLabel,
  TagCloseButton,
  TagLabel,
  Badge,
  RadioGroup,
  Radio,
  Center,
  IconButton,
  useToast,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup
} from '@chakra-ui/react';
import { useUser } from "../context/UserContext";
import useETHBalance from "../hooks/useETHBalance";
import Loot from "../abis/contracts/Loot.json";
import { ethers } from "ethers";
import CollectionItem from "./CollectionItem";
import { BiRefresh } from "@react-icons/all-files/bi/BiRefresh";
import Master from "../abis/contracts/Master.json";
import { HiRefresh } from "@react-icons/all-files/hi/HiRefresh";

const Marketplace = ({
  ItemSet,
  deployedContract,
  setDeployedContract,
  deployedColor,
  itemHistory,
  setItemHistory,
  setDeployedColor
}) => {
  const masterContractAddress = "0xC862E14Ee25aAf5D1A9F22ECA78E426712edfD7C"
  const [tokensOwned, setTokensOwned] = useState(0);
  const [count, setCount] = useState(1);
  const [tokens, setTokens] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState();
  const user = useUser();
  const [userBalance] = useETHBalance(user);
  const [val, setVal] = useState()
  const [isLoading, setIsLoading] = useState()
  const [itemsAdded, setItemsAdded] = useState(0)
  const [collectedFees, setCollectedFees] = useState(0)
  const toast = useToast();


  async function getBal() {
    let contract = new ethers.Contract(
      masterContractAddress,
      Master.abi,
      user.provider.getSigner()
    );
    const tokenBal = await contract.balanceOf(user.address);
    setTokensOwned(tokenBal.toString());
  }

  async function getFees() {
    let contract = new ethers.Contract(
      masterContractAddress,
      Master.abi,
      user.provider.getSigner()
    );
    const fees = await contract.collectedFees(user.address);
    setCollectedFees(fees.toString());
  }

  function themeToItemSet(theme) {
    for (let i = 0; i <= itemHistory.length; i++) {
      if (itemHistory[i].theme === theme) {
        return itemHistory[i];
      }
    }
    return "Not Found";
  }

  async function addNewItemSet() {
 
    const selectedItemSet = themeToItemSet(selectedTheme);

    let contract = new ethers.Contract(
      masterContractAddress,
      Master.abi,
      user.provider.getSigner()
    );
    const tx = await contract.addItemSet(selectedItemSet.theme, selectedItemSet.weapons, selectedItemSet.armor, selectedItemSet.accessories, {value: ethers.BigNumber.from("50000000000000000")})
    await tx.wait()
    const itemsAdded = await contract.numItemsSets(user.address)
    setItemsAdded(itemsAdded.toString())
    
    getBal()
    getTokens()
    getFees()
  }

  async function claimLoot() {

    let contract = new ethers.Contract(
      masterContractAddress,
      Master.abi,
      user.provider.getSigner()
    );

    contract.on("feeCollected", (user, fee) => {
      if (user === user.address) {
        setCollectedFees(fee);
      }
    });

    const tx = await contract.claim({value: ethers.BigNumber.from("50000000000000000")});
    toast({
      title: "Claiming Random Loot",
      description: "Your transaction is pending",  
      status: "info",
      duration: 4000,
      isClosable: true,
    });
    await tx.wait();

    getBal()
    getTokens()
    getFees()
   
  }

  async function getTokens() {
    
    let contract = new ethers.Contract(
      masterContractAddress,
      Master.abi,
      user.provider.getSigner()
    );
    const bal = await contract.balanceOf(user.address)
    setTokensOwned(bal.toString());
    let currentTokens = []
    for (let i = 0; i < parseInt(bal.toString(), 10); i++) {
      const tokenID = await contract.tokenOfOwnerByIndex(user.address, i)
      const index = await contract.tokenIdToRand(tokenID)
      console.log('index', index.toString())
      const currentItems = await contract.itemSets(index)
      const theme = currentItems.theme
      console.log('theme', theme.toString())
      const tokenImage = await contract.tokenImage(tokenID)
      console.log(tokenID.toString())
      currentTokens.push({image: tokenImage, id: tokenID.toString(), theme: theme.toString()})
    }
    setTokens(currentTokens)
    getFees()
  }
  function ShowItems() {
      return (
    <RadioGroup
              onChange={(val) => setSelectedTheme(val)}
              value={selectedTheme}
                 >
  {itemHistory.map((item) => (
                      <Radio value={item.theme}>
                        <Badge
                          borderRadius="full"
                          px="30"
                          colorScheme={item.colorTheme}
                          alignItems="center"
                        >
                          {item.theme}
                        </Badge>
                        <Box as="span" ml="3"></Box>
                       
                      </Radio>
  ))}
  </RadioGroup>
      )
  }

  function CollectionList() {
    if (tokens) {
      return (
    tokens.map((token) => (
      <CollectionItem image={token.image} theme={token.theme} color={"red"} tokenId={token.id}/>
    )) 
    )}
    return <div></div>
  }
  
 
  return (
    <Container maxW={'7xl'} >
      
    <StatGroup>
  <Stat>
    <StatLabel>Loot Sets Added</StatLabel>
    <StatNumber>{itemsAdded}</StatNumber>
  </Stat>

  <Stat>
    <StatLabel>Collected Fees</StatLabel>
    <StatNumber>{ethers.utils.formatUnits(collectedFees)} MATIC</StatNumber>
  </Stat>

  <Stat>
    <StatLabel>Loot Owned</StatLabel>
    <StatNumber>{tokensOwned}</StatNumber>
  </Stat>
</StatGroup>

    
    <Box
      marginTop={{ base: '1', sm: '5' }}
      display="flex"
      flexDirection={{ base: 'column', sm: 'row' }}
      justifyContent="space-between">
      <Box
        display="flex"
        flex="1"
        marginRight="3"
        position="relative"
        alignItems="center">
      
          <Table size="4xl">
          <Thead>
                <Th>Loot</Th>
              </Thead>
              <HStack>
           <ShowItems/>

</HStack>
<Button
        mt={4}
        borderRadius="md"
        bgGradient={[
          "linear(to-tr, teal.400, yellow.500)",
          "linear(to-t, blue.300, teal.600)",
          "linear(to-b, orange.200, purple.400)",
        ]}
        color="white"
        px={4}
        h={8}
        isDisabled={itemHistory.length < 1}
        onClick={addNewItemSet}
      >
        Add To Global Contract
      </Button>
            </Table>
           
      </Box>
      
      <Box
        display="flex"
        flex="1"
        flexDirection="column"
        justifyContent="center"
        marginTop={{ base: '3', sm: '0' }}>
      
       
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
        >
           By adding your loot, your loot set will included in the global collection - a Loot Contract that holds Loot Sets from any user who decides to add their own. By Adding your set, you'll recieve 50% of the minting fee. Select your Loot set and add!
        </Text>
      </Box>
    </Box>
    <Center height="50px" />
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
          px={12}
          h={12}
          fontWeight={"bold"}
        >
          Claim Random Loot
        </Button>
        <Center height="50px" />
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
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>

        <CollectionList/>
        </SimpleGrid>
        </Box>
  </Container>
  )

};

export default Marketplace;
