import { Card, Box, Text, CardBody, Flex, Button, Select } from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { formatNumber } from "../../utils/number";

const DishCard = forwardRef(({ dish, isFavorite, onDelete }, ref) => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("per_100g");

  const handleChange = (e) => {
    setMode(e.target.value);
  };

  const getNutrition = () => {
    const weightPerServing = dish.weight / dish.servings;

    switch (mode) {
      case "per_serving":
        return {
          calories: (dish.calories * weightPerServing) / 100,
          protein: (dish.protein * weightPerServing) / 100,
          fat: (dish.fat * weightPerServing) / 100,
          carbs: (dish.carbs * weightPerServing) / 100,
        };
      case "total":
        return {
          calories: (dish.calories * dish.weight) / 100,
          protein: (dish.protein * dish.weight) / 100,
          fat: (dish.fat * dish.weight) / 100,
          carbs: (dish.carbs * dish.weight) / 100,
        };
      default: // per_100g
        return {
          calories: dish.calories,
          protein: dish.protein,
          fat: dish.fat,
          carbs: dish.carbs,
        };
    }
  };

  const nutrition = getNutrition();

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      backgroundColor="rgba(0, 0, 0, 0.3)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      zIndex="1000"
    >
      <Card width="30vw" padding="0 1rem" ref={ref}>
        <CardBody>
          <Text mb="1rem">{dish.name}</Text>

          {dish.products?.length > 0 && (
            <Card fontSize="sm" backgroundColor="#ECECEC" padding="1rem" mb="1rem">
              {dish.products.map((product) => (
                <Card key={product.id} marginBottom="0.5rem" padding="0.3rem 0.6rem" _last={{ mb: 0 }}>
                  <Flex justifyContent="space-between">
                    <Text>{product.name}</Text>
                    <Text>{product.weight}г</Text>
                  </Flex>
                </Card>
              ))}
            </Card>
          )}

          <Flex fontSize="sm" mb="1rem" justifyContent="space-between">
            <Text>Вес в готовом виде</Text>
            <Text>{String(dish.weight).replaceAll('.', ',')}г</Text>
          </Flex>

          <Flex fontSize="sm" mb="1rem" justifyContent="space-between">
            <Text>Количество порций</Text>
            <Text>{String(dish.servings).replaceAll('.', ',')}</Text>
          </Flex>

          <Select size='sm' mb="0.5rem" width="10vw" value={mode} onChange={handleChange}>
            <option value='per_100g'>На 100 грамм</option>
            <option value='per_serving'>На порцию</option>
            <option value='total'>На всё блюдо</option>
          </Select>

          <Box fontSize="sm" m="0 1.5rem" mb="1rem">
            <Flex mb="0.5rem" justifyContent="space-between">
              <Text>Калорийность</Text>
              <Text>{formatNumber(nutrition.calories)} ккал</Text>
            </Flex>
            <Flex mb="0.5rem" justifyContent="space-between">
              <Text>Белки</Text>
              <Text>{formatNumber(nutrition.protein)} г</Text>
            </Flex>
            <Flex mb="0.5rem" justifyContent="space-between">
              <Text>Жиры</Text>
              <Text>{formatNumber(nutrition.fat)} г</Text>
            </Flex>
            <Flex mb="0.5rem" justifyContent="space-between">
              <Text>Углеводы</Text>
              <Text>{formatNumber(nutrition.carbs)} г</Text>
            </Flex>
          </Box>

          {dish.recipe && (
            <Card fontSize="sm" p="1rem" mb="1rem">
              <Text mb="0.5rem">Рецепт</Text>
              <Text whiteSpace="pre-line">{dish.recipe}</Text>
            </Card>
          )}
          {isFavorite && (
            <>
              <Button
                size="sm"
                colorScheme="purple"
                width="100%"
                mb="1rem"
                onClick={() => navigate(`/dishes/editor/${dish.id}`)}
              >
                Изменить
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                width="100%"
                onClick={() => onDelete?.(dish.id)}
              >
                Удалить
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </Box>
  );
});

export default DishCard;
