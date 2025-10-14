import { Card, Box, Input, Button } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import ToggleCards from "../components/ToggleCards";
import DishesList from "../components/DishesList";

export default function DishesPage() {
  const [selected, setSelected] = useState("Мои блюда");

  // Для тестирования
  const dish = {
    "name": "Творожная запеканка",
    "weight": "480г",
    "servings": "2 порции",
    "serving_weight": "240г",
    "nutrition_per_100g": "117/15/2,5/10",
    "nutrition_per_serving": "280/37/6,5/24",
    "nutrition_total": "560/74/13/48"
  }

  const myDishes = []
  const allDishes = [dish]
  const currentDishes = (selected === "Мои блюда") ? myDishes : allDishes

  return (
    <Box margin="2vh 10vw">
      <ToggleCards option1={"Мои блюда"} option2={"Все блюда"} onChange={setSelected}/>
      <Input size="lg" placeholder="Введите название блюда" background="white" marginBottom="3vh"/>
      <Button size="md" leftIcon={<SmallAddIcon/>} height="3rem" colorScheme="purple" marginBottom="3vh">
        Добавить блюдо
      </Button>
      {currentDishes.length > 0 ? (
        <DishesList dishes={currentDishes} />
      ) : (
        <Card backgroundColor="#ECECEC" padding="3vh" textAlign="center">
          Здесь пока ничего нет. Нажмите на кнопку, чтобы добавить блюдо.
        </Card>
      )}
    </Box>
  );
}
