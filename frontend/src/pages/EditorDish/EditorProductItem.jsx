import { Box, Card, Flex, Text, IconButton } from "@chakra-ui/react";
import { EditIcon, AddIcon } from "@chakra-ui/icons";

export default function EditorProductItem({ product, setEditingProduct }) {
  const nutrition_per_100g = `${product.calories}/${product.protein}/${product.fat}/${product.carbs}`.replaceAll('.', ',');
  
  return (
    <Box>
      <Card marginBottom="0.5rem">
        <Flex alignItems="center" padding="0.4rem 1rem">
          <Text>{product.name}</Text>
          <Text width="9vw" ml="auto">{nutrition_per_100g}</Text>
          <IconButton
            icon={<EditIcon />}
            variant="ghost"
            mr="0.4rem"
            onClick={(e) => {
              e.stopPropagation(); // Останавливаем клик, чтобы не сработал Box
              setEditingProduct(product);
            }}
          />
          <IconButton
            icon={<AddIcon color="purple.500" />}
            variant="ghost"
          />
        </Flex>
      </Card>
    </Box>
  );
}
