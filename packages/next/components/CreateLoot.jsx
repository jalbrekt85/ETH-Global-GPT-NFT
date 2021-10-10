import {
  Text,
  Button,
  Textarea,
  SkeletonText,
  useToast,
  Stack,
  SimpleGrid,
  Tooltip
} from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { useUser } from "../context/UserContext";
import Consumer from "../abis/contracts/Consumer.json";
import ItemTable from "./ItemTable";
import DeployDrawer from "./DeployDrawer";
import ExampleNFT from "./ExampleNFT";
import random from "../utils/random";
import colors from "../utils/colors";
import { ImPriceTags } from "@react-icons/all-files/im/ImPriceTags";

const CreateLoot = ({
  items,
  setItems,
  setDeployedContract,
  setDeployedColor,
  itemHistory,
  setItemHistory
}) => {
  const contractAddress = "0x3a2696b585caE58f1F489FEf93513cb8D8886Cba";

  const user = useUser();
  const [userPrompt, setUserPrompt] = useState("");
  const [resize] = useState("vertical");
  const [isLoading, setIsLoading] = useState(false);
  const [colorsList, setColorsList] = useState([
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "cyan",
    "purple",
    "pink",
  ]);

  const toast = useToast();

  async function getResult() {
    const contract = new ethers.Contract(
      contractAddress,
      Consumer.abi,
      user.provider.getSigner()
    );
    const reqItems = await contract.userToItems(user.address);
    const weapons = await reqItems.weapons;
    const armor = await reqItems.armor;
    const accessories = await reqItems.accessories;

    const weaponsList = weapons.split(",");
    const armorList = armor.split(",");
    const accessoriesList = accessories.split(",");
    let newItems = {
      theme: userPrompt,
      weapons: weaponsList,
      armor: armorList,
      accessories: accessoriesList,
      colorTheme: random(colorsList),
    };
    if (colorsList.length > 1) {
      colorsList.pop();
      setColorsList(colorsList);
    } else {
      setColorsList(colors);
    }
    setItems(newItems);
    setItemHistory([...itemHistory, newItems]);

    setIsLoading(false);
  }

  async function requestPrompt() {
    if (!userPrompt) {
      toast({
        title: "Empty Prompt",
        description: "Enter a prompt",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    const contract = new ethers.Contract(
      contractAddress,
      Consumer.abi,
      user.provider.getSigner()
    );
    const fee = await contract.fee();

    contract.on("Response", (Id) => {
      if (Id === requestId) {
        getResult();
      }
    });
    contract.on("ChainlinkFulfilled", (Id) => {
      if (Id === requestId) {
        getResult();
      }
    });

    const tx = await contract.requestBytes(userPrompt, {value: fee});
    await tx.wait();

    const requestId = await contract.userToId(user.address);

    toast({
      title: "Request GPT-3",
      description: "Your Transaction is pending",
      status: "info",
      duration: 9000,
      isClosable: true,
    });
    setIsLoading(true);
  }

  
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={20}>
      <Stack>
        <ExampleNFT ItemSet={items} />
      </Stack>
      <Stack>
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
          Enter Loot Theme:
        </Text>
        <Textarea
          maxW="sm"
          borderWidth="3px"
          borderRadius="lg"
          overflow="hidden"
          p="3"
          fontWeight="semibold"
          variant="outline"
          onChange={(e) => setUserPrompt(e.target.value)}
          value={userPrompt}
          resize={resize}
          mt={4}
        />
<Tooltip label="0.01 MATIC">
        <Button
        leftIcon={<ImPriceTags />}
        mt={4}
        isLoading={isLoading}
        onClick={requestPrompt}
        borderRadius="md"
        bgGradient={[
          "linear(to-tr, teal.400, yellow.500)",
          "linear(to-t, blue.300, teal.600)",
          "linear(to-b, orange.200, purple.400)",
        ]}
        color="white"
      >
        Submit
      </Button>
      </Tooltip>

        <SkeletonText
          isLoaded={!isLoading}
          noOfLines={4}
          spacing="4"
          startColor="pink.500"
          endColor="orange.500"
          height="50px"
          width="400px"
          padding="3"
          mt={3}
        >
          <ItemTable ItemSet={items} />
        </SkeletonText>
      </Stack>
      <Stack>
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
          Select Your Loot Set, Configure your Contract and Deploy! You'll be
          able to view your deployed contract and NFTs from here and OpenSea
        </Text>
        <DeployDrawer
          itemHistory={itemHistory}
          setDeployedContract={setDeployedContract}
          setDeployedColor={setDeployedColor}
        />
      </Stack>
    </SimpleGrid>
  );
};

export default CreateLoot;
