import { Card, Flex, Text, IconButton, Box, Icon } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { TbHeartPlus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { formatNumber } from "../../utils/number";
import { addFavoriteDish } from "../../api/dishes";

export default function DishItem({ dish, setSelectedDish, favoriteDishes, setFavoriteDishes }) {
  const navigate = useNavigate();
  const isFavorite = favoriteDishes.some(fav => fav.id === dish.id);
  const [loading, setLoading] = useState(false);

  const serving_weight = `${formatNumber(dish.weight / dish.servings)}`;

  const nutrition_per_100g = `${formatNumber(dish.calories)}/` +
    `${formatNumber(dish.protein)}/` +
    `${formatNumber(dish.fat)}/` +
    `${formatNumber(dish.carbs)}`;

  const nutrition_per_serving = `${formatNumber(dish.calories * (dish.weight / dish.servings / 100))}/` +
    `${formatNumber(dish.protein * (dish.weight / dish.servings / 100))}/` +
    `${formatNumber(dish.fat * (dish.weight / dish.servings / 100))}/` +
    `${formatNumber(dish.carbs * (dish.weight / dish.servings / 100))}`;

  const nutrition_total = `${formatNumber(dish.calories * (dish.weight / 100))}/` +
    `${formatNumber(dish.protein * (dish.weight / 100))}/` +
    `${formatNumber(dish.fat * (dish.weight / 100))}/` +
    `${formatNumber(dish.carbs * (dish.weight / 100))}`;

  const handleAddFavorite = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await addFavoriteDish(dish.id);
      setFavoriteDishes(prev => [...prev, dish]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box onClick={() => setSelectedDish(dish)}>
      <Card marginBottom="0.5rem">
        <Flex alignItems="center" padding="0.8rem 1.5rem">
          <Text>{dish.name}</Text>
          <Text width="4vw" ml="auto">{dish.weight}г</Text>
          <Text width="9vw">{dish.servings} порции</Text>
          <Text width="7vw">{serving_weight}г</Text>
          <Text width="11vw">{nutrition_per_100g}</Text>
          <Text width="11vw">{nutrition_per_serving}</Text>
          <Text width="11vw">{nutrition_total}</Text>

          {isFavorite ? (
            <IconButton
              icon={<EditIcon />}
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dishes/editor/${dish.id}`);
              }}
            />
          ) : (
            <IconButton
              icon={<Icon as={TbHeartPlus} color="purple.500" boxSize={5} />}
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
