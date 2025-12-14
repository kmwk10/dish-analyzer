import { Box, Card, Flex, Text, IconButton } from "@chakra-ui/react";
import { EditIcon, AddIcon } from "@chakra-ui/icons";
import { addFavoriteProduct } from "../../api/products";
import { useState } from "react";

export default function ProductItem({ product, setSelectedProduct, setEditingProduct, favoriteProducts, setFavoriteProducts }) {
  const [loading, setLoading] = useState(false);

  const isFavorite = favoriteProducts.some(fav => fav.id === product.id);
  const nutrition_per_100g = `${product.calories}/${product.protein}/${product.fat}/${product.carbs}`.replaceAll('.', ',');

  const handleAddFavorite = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await addFavoriteProduct(product.id);
      setFavoriteProducts(prev => [...prev, product]);
    } catch (err) {
      console.error("Не удалось добавить продукт в избранное", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box onClick={() => setSelectedProduct(product)}>
      <Card marginBottom="0.5rem">
        <Flex alignItems="center" padding="0.8rem 1.5rem">
          <Text>{product.name}</Text>
          <Text width="11vw" ml="auto">{nutrition_per_100g}</Text>
          <Text width="28vw">{(product.used_in_dishes || []).join(", ")}</Text>

          {isFavorite ? (
            <IconButton
              icon={<EditIcon />}
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setEditingProduct(product);
              }}
            />
          ) : (
            <IconButton
              icon={<AddIcon color="purple.500" />}
              variant="ghost"
              onClick={handleAddFavorite}
              isLoading={loading}
            />
          )}
        </Flex>
      </Card>
    </Box>
  );
}
