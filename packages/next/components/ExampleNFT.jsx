import { Box, Badge, Stack } from "@chakra-ui/react";
import SvgNft from "./SvgNft";

const ExampleNFT = ({ ItemSet }) => {
  return (
    <Stack>
      <Box maxW="sm" borderWidth="2px" borderRadius="xl" overflow="hidden">
        <SvgNft ItemSet={ItemSet} />

        <Box p="6">
          <Box alignItems="center">
            <Badge
              borderRadius="full"
              px="5"
              colorScheme={ItemSet.colorTheme}
              alignItems="center"
            >
              {ItemSet.weapons.length === 0 ? "None" : ItemSet.theme}
            </Badge>
          </Box>

          <Box
            mt="1"
            fontWeight="Bold"
            as="h1"
            fontSize={25}
            lineHeight="tight"
            isTruncated
            bgGradient={[
              "linear(to-tr, teal.400, yellow.500)",
              "linear(to-t, blue.300, teal.600)",
              "linear(to-b, orange.200, purple.400)",
            ]}
            bgClip="text"
          >
            Sample Loot #1
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default ExampleNFT;
