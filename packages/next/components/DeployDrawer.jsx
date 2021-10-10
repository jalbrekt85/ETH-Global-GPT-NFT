import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  Stack,
  Box,
  FormLabel,
  useToast,
  Icon,
  Radio,
  RadioGroup,
  Badge,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ImRocket } from "@react-icons/all-files/im/ImRocket";
import { ethers } from "ethers";
import Loot from "../abis/contracts/Loot.json";
import { useUser } from "../context/UserContext";
import { FaFileContract } from "@react-icons/all-files/fa/FaFileContract";

const DeployDrawer = ({
  itemHistory,
  setDeployedContract,
  setDeployedColor,
}) => {
  const user = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();

  const [selectedTheme, setSelectedTheme] = useState();
  const [numTokens, setNumTokens] = useState(10000);
  const [isLoading, setIsLoading] = useState(false);
  const [loadAddress, setLoadAddress] = useState();

  const toast = useToast();

  function ShowAlert() {
    if (!isLoading) {
      return <div></div>;
    }
    return (
      <Alert
        status="info"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="xl">
          {selectedTheme} Loot Is Being Deployed!
        </AlertTitle>
        <AlertDescription maxWidth="md" fontSize="lg">
          Visit "My Collection" to view your contract's NFTs after it is done
          deploying
        </AlertDescription>
      </Alert>
    );
  }

  async function loadLoot() {
    if (!loadAddress) {
      toast({
        title: "No Address",
        description: "Enter an Address To Load Loot From",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    let contract = new ethers.Contract(
      loadAddress,
      Loot.abi,
      user.provider.getSigner()
    );
    setIsLoading(true);
    setDeployedContract(contract);
    setDeployedColor("red");
  }

  async function deployLoot() {
    if (!selectedTheme) {
      toast({
        title: "No Loot Selected",
        description: "Select a Loot Set from the List",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    const selectedItemSet = themeToItemSet(selectedTheme);
    let factory = new ethers.ContractFactory(
      Loot.abi,
      Loot.bytecode,
      user.provider.getSigner()
    );
    let contract = await factory.deploy(
      selectedItemSet.theme,
      selectedItemSet.weapons,
      selectedItemSet.armor,
      selectedItemSet.accessories,
      numTokens
    );
    setIsLoading(true);
    setDeployedContract(contract);
    setDeployedColor(selectedItemSet.colorTheme);
  }

  function themeToItemSet(theme) {
    for (let i = 0; i <= itemHistory.length; i++) {
      if (itemHistory[i].theme === theme) {
        return itemHistory[i];
      }
    }
    return "Not Found";
  }

  return (
    <Stack>
      <Box>
        <Button
          rightIcon={<Icon as={ImRocket} w={5} h={5} />}
          bgGradient={[
            "linear(to-tr, teal.400, yellow.500)",
            "linear(to-t, blue.300, teal.600)",
            "linear(to-b, orange.200, purple.400)",
          ]}
          // isDisabled={!ItemSet.weapons.length}
          onClick={onOpen}
          fontWeight="bold"
        >
          Deploy/Load Loot
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="right"
          initialFocusRef={firstField}
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              Select Loot Set To Deploy
            </DrawerHeader>

            <DrawerBody>
              <Stack spacing="24px">
                <RadioGroup
                  onChange={(val) => setSelectedTheme(val)}
                  value={selectedTheme}
                >
                  <Stack >
                    {itemHistory.map((item) => (
                      <Radio value={item.theme}>
                        <Badge
                          borderRadius="full"
                          px="15"
                          colorScheme={item.colorTheme}
                          alignItems="center"
                        >
                          {item.theme}
                        </Badge>
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>

                <Box>
                  <FormLabel>Set # of NFTs that can be minted</FormLabel>
                  <Slider
                    defaultValue={10000}
                    min={0}
                    max={10000}
                    step={100}
                    onChange={(num) => setNumTokens(num)}
                  >
                    <SliderTrack bg="red.100">
                      <Box position="relative" right={10} />
                      <SliderFilledTrack bg="tomato" />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                  </Slider>
                  <FormLabel>{numTokens}</FormLabel>
                </Box>
                <FormLabel>OR</FormLabel>
                <FormLabel>Load existing Loot Contract from Address</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaFileContract color="gray.300" />}
                  />
                  <Input
                    placeholder="Contract Address"
                    onChange={(e) => setLoadAddress(e.target.value)}
                  />
                </InputGroup>
                <Button onClick={loadLoot}> Load Loot</Button>
              </Stack>
              <ShowAlert />
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <Button
                variant="outline"
                mr={3}
                onClick={() => {
                  setIsLoading(false);
                  onClose();
                }}
              >
                Done
              </Button>
              <Button colorScheme="blue" onClick={deployLoot}>
                Deploy
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
    </Stack>
  );
};

export default DeployDrawer;
