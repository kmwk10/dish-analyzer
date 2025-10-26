import { Box, Card, Flex, Text, IconButton } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

export default function ProductItem({ product, setSelectedProduct }) {
  return (
    <Box
      onClick={() => setSelectedProduct(product)}
    >
      <Card marginBottom="0.5rem">
        <Flex alignItems="center" padding="0.8rem 1.5rem">
          <Text>{product.name}</Text>
          <Text width="11vw" ml="auto">{product.nutrition_per_100g}</Text>
          <Text width="28vw">{product.used_in_dishes}</Text>
          <IconButton
            icon={<EditIcon />}
            variant="ghost"
          />
        </Flex>
      </Card>
    </Box>
  );
}
