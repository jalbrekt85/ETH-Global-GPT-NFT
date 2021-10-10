import {
  Icon,
  Table,
  Thead,
  Th,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
} from "@chakra-ui/react";
import ItemList from "./ItemList";
import { RiSwordFill } from "@react-icons/all-files/ri/RiSwordFill";
import { GiClothes } from "@react-icons/all-files/gi/GiClothes";
import { GiLightBackpack } from "@react-icons/all-files/gi/GiLightBackpack";

const ItemTable = ({ ItemSet }) => {
  return (
    <Container>
      <Tabs variant="soft-rounded" colorScheme="green" align="center">
        <TabList>
          <Tab>
            <Icon as={RiSwordFill} w={6} h={6} />
          </Tab>
          <Tab>
            <Icon as={GiClothes} w={6} h={6} />
          </Tab>
          <Tab>
            <Icon as={GiLightBackpack} w={6} h={6} />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Table colorScheme="" size="xl">
              <Thead>
                <Th>Weapons</Th>
              </Thead>
              <ItemList items={ItemSet.weapons} />
            </Table>
          </TabPanel>

          <TabPanel>
            <Table colorScheme="" size="xl">
              <Thead>
                <Th>Attire</Th>
              </Thead>
              <ItemList items={ItemSet.armor} />
            </Table>
          </TabPanel>

          <TabPanel>
            <Table colorScheme="" size="xl">
              <Thead>
                <Th>Accessories</Th>
              </Thead>
              <ItemList items={ItemSet.accessories} />
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ItemTable;
