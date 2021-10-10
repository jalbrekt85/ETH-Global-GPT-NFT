import CreateLoot from "../components/CreateLoot";
import MarketPlace from "../components/MarketPlace";
import MyCollection from "../components/MyCollection";
import { useState } from "react";
import { Container } from "../components/Container";
import Header from "../components/Header";
import { ethers } from "ethers";
import { useUser } from "../context/UserContext";
import useETHBalance from "../hooks/useETHBalance";
import useNetwork from "../hooks/useNetwork";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from "@chakra-ui/react";


const NewHome = () => {
  const user = useUser();
  const [userBalance] = useETHBalance(user);
  const [network] = useNetwork(user);
  const [deployedContract, setDeployedContract] = useState();
  const [deployedColor, setDeployedColor] = useState();
  const [itemHistory, setItemHistory] = useState([]);

  const [items, setItems] = useState({
    theme: "",
    weapons: [],
    armor: [],
    accessories: [],
    colorTheme: "",
  });

  return(
  !user ? (
    <Text
          fontSize={"4xl"}
          fontWeight={"bold"}>
            Switch to the Polygon Network
          </Text>
  ) : (

    <div>
      <Header
        account={
          user
            ? user.address.substring(0, 3) +
              "..." +
              user.address.substring(
                user.address.length - 3,
                user.address.length
              )
            : "Wrong Network"
        }
        network={network}
        balance={ethers.utils
          .formatUnits(userBalance)
          .toString()
          .substring(0, 6)}
      />

      <Container height="100vh">
        <Tabs variant="unstyled" align="center">
          <TabList>
            <Tab
              _selected={{
                color: "white",
                bgGradient: "linear(to-b, orange.100, purple.300)",
              }}
            >
              Create Loot
            </Tab>
            <Tab
              _selected={{
                color: "white",
                bgGradient: "linear(to-b, orange.100, purple.300)",
              }}
            >
              Marketplace
            </Tab>
            <Tab
              _selected={{
                color: "white",
                bgGradient: "linear(to-b, orange.100, purple.300)",
              }}
            >
              My Collection
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <CreateLoot
                items={items}
                setItems={setItems}
                setDeployedContract={setDeployedContract}
                setDeployedColor={setDeployedColor}
                itemHistory={itemHistory}
                setItemHistory={setItemHistory}
              />
            </TabPanel>

            <TabPanel>
              <MarketPlace
                itemHistory={itemHistory}
              />
            </TabPanel>
            <TabPanel>
              <MyCollection
                deployedContract={deployedContract}
                deployedColor={deployedColor}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </div>
  )
  )

  


};

export default NewHome;
