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
  VStack,
  Thead,
  Th,
  List,
  ListItem,
  StackLabel,
  TagCloseButton,
  TagLabel,
  Badge,
  RadioGroup,
  Radio
} from '@chakra-ui/react';
import { useUser } from "../context/UserContext";
import useETHBalance from "../hooks/useETHBalance";
import { ethers } from "ethers";
import CollectionItem from "./CollectionItem";
import { BiRefresh } from "@react-icons/all-files/bi/BiRefresh";
import DeployDrawer from "./DeployDrawer";


const Marketplace = ({
  ItemSet,
  deployedContract,
  setDeployedContract,
  deployedColor,
  itemHistory,
  setItemHistory,
  setDeployedColor
}) => {
  const masterContractAddress = 0x0FeC0373Ce5CCa34Cb710910532A4d9E5E630C6C
  const [tokensOwned, setTokensOwned] = useState(0);
  const [count, setCount] = useState(1);
  const [tokens, setTokens] = useState([]);
  const [theme, setTheme] = useState();
  const user = useUser();
  const [userBalance] = useETHBalance(user);
  // const toast = useToast();
  
  
  
 
  return (
    <Container maxW={'7xl'} p="12">
 
  </Container>
  )

};

export default Marketplace;
