import { Box, Badge, Stack, Image } from "@chakra-ui/react";

const CollectionItem = ({ theme, color, image, tokenId }) => {
  return (
    <Stack>
      <Box
        maxW="xl"
        borderWidth="2px"
        borderRadius="xl"
        overflow="hidden"
        alignContent="center"
      >
        <Image src={`data:image/svg+xml;base64,${image}`} />
        <Box p="8">
          <Box alignItems="center">
            <Badge
              borderRadius="full"
              px="6"
              colorScheme={color}
              alignItems="center"
            >
              {theme}
            </Badge>
          </Box>

          <Box
            mt="1"
            fontWeight="Bold"
            as="h1"
            fontSize={30}
            lineHeight="tight"
            isTruncated
            bgGradient={[
              "linear(to-tr, teal.400, yellow.500)",
              "linear(to-t, blue.300, teal.600)",
              "linear(to-b, orange.200, purple.400)",
            ]}
            bgClip="text"
          >
            {"    "}Loot #{tokenId}
            {"    "}
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default CollectionItem;
