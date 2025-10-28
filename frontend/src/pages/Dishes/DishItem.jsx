import { Card, Flex, Text, IconButton, Box } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

export default function DishItem({ dish, setSelectedDish }) {
  const navigate = useNavigate();

  const formatNumber = (num) =>
  parseFloat(num.toFixed(1)).toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 1 });

  const serving_weight = `${formatNumber(dish.weight / dish.servings)}`

  const nutrition_per_100g = `${formatNumber(dish.calories)}/` +
    `${formatNumber(dish.protein)}/` +
    `${formatNumber(dish.fat)}/` +
    `${formatNumber(dish.carbs)}`;

  const nutrition_per_serving = `${formatNumber((dish.calories * (dish.weight / dish.servings)) / 100)}/` +
    `${formatNumber((dish.protein * (dish.weight / dish.servings)) / 100)}/` +
    `${formatNumber((dish.fat * (dish.weight / dish.servings)) / 100)}/` +
    `${formatNumber((dish.carbs * (dish.weight / dish.servings)) / 100)}`;

  const nutrition_total = `${formatNumber((dish.calories * dish.weight) / 100)}/` +
    `${formatNumber((dish.protein * dish.weight) / 100)}/` +
    `${formatNumber((dish.fat * dish.weight) / 100)}/` +
    `${formatNumber((dish.carbs * dish.weight) / 100)}`;


  return (
    <Box 
      onClick={() => setSelectedDish(dish)}
    >
      <Card marginBottom="0.5rem">
        <Flex alignItems="center" padding="0.8rem 1.5rem">
          <Text>{dish.name}</Text>
          <Text width="4vw"  ml="auto">{dish.weight}г</Text>
          <Text width="9vw">{dish.servings} порции</Text>
          <Text width="7vw">{serving_weight}г</Text>
          <Text width="11vw">{nutrition_per_100g}</Text>
          <Text width="11vw">{nutrition_per_serving}</Text>
          <Text width="11vw">{nutrition_total}</Text>
          <IconButton
            icon={<EditIcon />}
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation(); // Останавливаем клик, чтобы не сработал Box
              navigate(`/dishes/editor/${dish.id}`);
            }}
          />
        </Flex>
      </Card>
    </Box>
  );
}
