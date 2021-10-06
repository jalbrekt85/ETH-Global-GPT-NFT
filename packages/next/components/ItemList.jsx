import { Text, Stack, List, ListItem, Box } from "@chakra-ui/react";

const ItemList = ({ items }) => {
  return (
    <div>
      <Stack spacing={1}>
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
          <List>
            {items.map((item) => (
              <ListItem>{item}</ListItem>
            ))}
          </List>
        </Text>
      </Stack>
    </div>
  );
};

export default ItemList;
