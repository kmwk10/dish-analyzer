import { Card, CardBody, Box, Input, Flex, Text, InputGroup, InputRightElement, Select, Textarea, Button } from "@chakra-ui/react";
import { useState } from "react";

export default function EditorDishCard() {
  // Для тестирования
  const product = {"name": "Творог 0,5% (Село зелёное)", "weight": 300}

  const dish = {
    "name": "Творожная запеканка",
    "weight": 480,
    "calories": 117,
    "protein": 15,
    "fat": 2.5,
    "carbs": 10,
    "servings": 2,
    "products": [product, product, product],
    "recipe": "Смешайте 2 яйца, творог и муку.\nПерелейте получившееся тесто в форму.\nПоставьте запекаться в духовку при 180 градусах на 45 минут."
  }

  const [name, setName] = useState(dish?.name || "");
  const [weight, setWeight] = useState(
    dish?.weight != null ? String(dish.weight).replaceAll('.', ',') : ""
  );
  const [calories, setCalories] = useState(
    dish?.calories != null ? String(dish.calories).replaceAll('.', ',') : ""
  );
  const [protein, setProtein] = useState(
    dish?.protein != null ? String(dish.protein).replaceAll('.', ',') : ""
  );
  const [fat, setFat] = useState(
    dish?.fat != null ? String(dish.fat).replaceAll('.', ',') : ""
  );
  const [carbs, setCarbs] = useState(
    dish?.carbs != null ? String(dish.carbs).replaceAll('.', ',') : ""
  );

  return (
    <Card maxHeight="100%" >
      <CardBody overflowY="auto">
        <Text mb="0.5rem" fontSize="sm">Название</Text>
        <Input 
          size="sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите название блюда"
          mb="1rem"Название
        />

        {dish.products?.length > 0 && (
          <Card fontSize="sm" backgroundColor="#ECECEC" padding="1rem" mb="1rem">
            {dish.products.map((product) => (
              <Card marginBottom="0.5rem" padding="0.3rem 0.6rem" _last={{ mb: 0 }}>
                <Text>{product.name}</Text>
              </Card>
            ))}
          </Card>
        )}

        <Text mb="0.5rem" fontSize="sm">Вес в готовом виде</Text>
        <Input 
          size="sm"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Введите название блюда"
          mb="1rem"
        />

        <Select size='sm' mb="0.5rem" width="fit-content" >
          <option value='servings'>Количество порций</option>
          <option value='serving_weight'>Вес порции</option>
        </Select>
        <Input 
          size="sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите "
          mb="1rem"
        />

        <Select size='sm' mb="0.5rem" width="fit-content">
          <option value='per_100g'>На 100 грамм</option>
          <option value='per_serving'>На порцию</option>
          <option value='total'>На всё блюдо</option>
        </Select>

        <Box fontSize="sm" m="0 1.5rem" mb="1rem">
          <Flex mb="0.5rem" justifyContent="space-between">
            <Text>Калорийность</Text>
            <InputGroup size="xs" width="65%">
              <Input
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                pr="2.5rem"
              />
              <InputRightElement children="ккал" m="0 0.5rem"/>
            </InputGroup>
          </Flex>

          <Flex mb="0.5rem" justifyContent="space-between">
            <Text>Белки</Text>
              <InputGroup size="xs" width="65%">
                <Input
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  pr="2.5rem"
                />
                <InputRightElement children="г" m="0 1.1rem"/>
            </InputGroup>
          </Flex>

          <Flex mb="0.5rem" justifyContent="space-between">
            <Text>Жиры</Text>
            <InputGroup size="xs" width="65%">
              <Input
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                pr="2.5rem"
              />
              <InputRightElement children="г" m="0 1.1rem"/>
            </InputGroup>
          </Flex>

          <Flex mb="0.5rem" justifyContent="space-between">
            <Text>Углеводы</Text>
            <InputGroup size="xs" width="65%">
              <Input
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                pr="2.5rem"
              />
              <InputRightElement children="г" m="0 1.1rem"/>
            </InputGroup>
          </Flex>
        </Box>

        <Text mb="0.5rem" fontSize="sm">Рецепт</Text>
        <Textarea size="sm" placeholder="Введите рецепт" mb="1rem"/>

        <Button size="sm" colorScheme="purple" width="100%" mb="1rem">Сохранить</Button>
        <Button size="sm" colorScheme="red" width="100%">Удалить</Button>
      </CardBody>
    </Card>
  );
}
