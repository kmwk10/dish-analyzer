import { Box, Card, Flex, Text, IconButton } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

export default function ProductItem({ product, setSelectedProduct, setEditingProduct }) {
  const nutrition_per_100g = `${product.calories}/${product.protein}/${product.fat}/${product.carbs}`.replaceAll('.', ',');
  
  return (
    <Box
      onClick={() => setSelectedProduct(product)}
    >
      <Card marginBottom="0.5rem">
        <Flex alignItems="center" padding="0.8rem 1.5rem">
          <Text>{product.name}</Text>
          <Text width="11vw" ml="auto">{nutrition_per_100g}</Text>
          <Text width="28vw">{product.used_in_dishes.join(", ")}</Text>
          <IconButton
            icon={<EditIcon />}
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation(); // Останавливаем клик, чтобы не сработал Box
              setEditingProduct(product);
            }}
          />
        </Flex>
      </Card>
    </Box>
  );
}
