import { Box, Card, Flex, Text, IconButton, Icon } from "@chakra-ui/react";
import { EditIcon, AddIcon } from "@chakra-ui/icons";
import { TbHeartPlus } from "react-icons/tb";
import { useState } from "react";
import { addFavoriteProduct } from "../../api/products";

export default function EditorProductItem({
  product,
  setEditingProduct,
  onAddProduct,
  favoriteProducts,
  setFavoriteProducts
}) {
  const [loading, setLoading] = useState(false);

  const isFavorite = favoriteProducts.some(fav => fav.id === product.id);
  const nutrition_per_100g = `${product.calories}/${product.protein}/${product.fat}/${product.carbs}`.replaceAll('.', ',');

  const handleAddFavorite = async (e) => {
    e.stopPropagation();
    if (isFavorite) return;
    setLoading(true);
    try {
      await addFavoriteProduct(product.id);
      setFavoriteProducts(prev => [...prev, product]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card marginBottom="0.5rem">
        <Flex alignItems="center" padding="0.4rem 1rem">
          <Text>{product.name}</Text>
          <Text width="9vw" ml="auto">{nutrition_per_100g}</Text>
          {isFavorite ? (
            <IconButton
              icon={<EditIcon />}
              variant="ghost"
              mr="0.4rem"
              onClick={(e) => {
                e.stopPropagation();
                setEditingProduct(product);
              }}
            />
          ) : (
            <IconButton
              icon={<Icon as={TbHeartPlus} color="purple.500" boxSize={5} />}
              variant="ghost"
              mr="0.4rem"
              onClick={handleAddFavorite}
              isLoading={loading}
            />
          )}
          <IconButton
            icon={<AddIcon color="purple.500" />}
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onAddProduct(product);
            }}
          />
        </Flex>
      </Card>
    </Box>
  );
}
