import React from "react";
import {
  Flex,
  Icon,
  IconButton,
  useColorMode,
  useColorModeValue,
  Box,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useViewportScroll } from "framer-motion";
import { FaMoon } from "@react-icons/all-files/fa/FaMoon";
import { FaSun } from "@react-icons/all-files/fa/FaSun";
import { FaAddressCard } from "@react-icons/all-files/fa/FaAddressCard";
import { FaNetworkWired } from "@react-icons/all-files/fa/FaNetworkWired";
import { FaEthereum } from "@react-icons/all-files/fa/FaEthereum";
import { AiFillGithub } from "@react-icons/all-files/ai/AiFillGithub";
import { useUser } from "../context/UserContext";

export default function App(props) {
  const user = useUser()
  const { toggleColorMode: toggleMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  const bg = useColorModeValue("white", "gray.800");
  const ref = React.useRef();
  const [y, setY] = React.useState(0);
  const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {};

  const { scrollY } = useViewportScroll();
  React.useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()));
  }, [scrollY]);
  const Web3Component = (text, icon) => {
    return (
      <Box
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        as="a"
        target="_blank"
        rel="noopener noreferrer"
        bg="gray.50"
        borderWidth="1px"
        borderColor="gray.200"
        px="1em"
        minH="36px"
        rounded="md"
        fontSize="sm"
        color="gray.800"
        outline="0"
        transition="all 0.3s"
        white-space="pre-wrap"
        _hover={{
          bg: "gray.100",
          borderColor: "gray.300",
        }}
        _active={{
          borderColor: "gray.200",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        ml={5}
      >
        <Icon as={icon} w="4" h="4" color="red.500" mr="2" />
        <Box as="strong" lineHeight="inherit" fontWeight="semibold">
          {text}
        </Box>
      </Box>
    );
  };

  return (
    <Box pos="relative" alignItems="right ">
      <Flex w="full" h="full" px="16" align="center" justify="space-between">
        <Heading
          fontSize="4xl"
          bgGradient={[
            "linear(to-tr, teal.400, yellow.500)",
            "linear(to-t, blue.300, teal.600)",
            "linear(to-b, orange.200, purple.400)",
          ]}
          bgClip="text"
          fontWeight="bold"
        >
          GPT-LOOT
        </Heading>
        <Text
          fontSize="lg"
          bgGradient={[
            "linear(to-tr, teal.400, yellow.500)",
            "linear(to-t, blue.300, teal.600)",
            "linear(to-b, orange.200, purple.400)",
          ]}
          bgClip="text"
        >
          On-Chain Loot Generation
        </Text>

        <Flex
          justify="flex-end"
          w="full"
          maxW="824px"
          align="center"
          color="gray.400"
        >
          <IconButton
            size="md"
            fontSize="lg"
            aria-label={"Github"}
            variant="ghost"
            color="current"
            ml={{ base: "0", md: "3" }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href='https://github.com/jalbrekt85/ETH-Global-GPT-NFT';
              }}
            icon={<AiFillGithub />}
          />
          <IconButton
            size="md"
            fontSize="lg"
            aria-label={`Switch to ${text} mode`}
            variant="ghost"
            color="current"
            ml={{ base: "0", md: "3" }}
            onClick={toggleMode}
            icon={<SwitchIcon />}
          />
          {!user && (
          <Text
          fontSize={"xl"}
          fontWeight={"bold"}>
            Switch to the Polygon Network
          </Text>
        )}
          {Web3Component(props.account, FaAddressCard)}
          {Web3Component(props.network, FaNetworkWired)}
          {Web3Component(props.balance, FaEthereum)}
          <IconButton
            display={{ base: "flex", md: "none" }}
            aria-label="Open menu"
            fontSize="20px"
            color={useColorModeValue("gray.800", "inherit")}
            variant="ghost"
          />
        </Flex>
      </Flex>
    </Box>
  );
}
