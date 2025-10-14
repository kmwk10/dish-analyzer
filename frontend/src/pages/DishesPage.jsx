import { Card, Box, Input, Button, useOutsideClick } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef } from "react";

import ToggleCards from "../components/ToggleCards";
import DishesList from "../components/DishesList";
import DishCard from "../components/DishCard";

export default function DishesPage() {
  const [selectedSection, setSelectedSection] = useState("Мои блюда");
  const [selectedDish, setSelectedDish] = useState(null);

  const cardRef = useRef()

  useOutsideClick({
    ref: cardRef,
    handler: () => setSelectedDish(null),
  });

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

  const dish2 = {...dish}
  dish2["name"] = "Сырники"

  const myDishes = []
  const allDishes = [dish, dish2]
  const currentDishes = (selectedSection === "Мои блюда") ? myDishes : allDishes

  return (
    <Box margin="2vh 10vw">
      <ToggleCards option1={"Мои блюда"} option2={"Все блюда"} onChange={setSelectedSection}/>
      <Input size="lg" placeholder="Введите название блюда" background="white" marginBottom="3vh"/>
      <Button size="md" leftIcon={<SmallAddIcon/>} height="3rem" colorScheme="purple" marginBottom="3vh">
        Добавить блюдо
      </Button>
      {currentDishes.length > 0 ? (
        <DishesList dishes={currentDishes} setSelectedDish={setSelectedDish}/>
      ) : (
        <Card backgroundColor="#ECECEC" padding="3vh" textAlign="center">
          Здесь пока ничего нет. Нажмите на кнопку, чтобы добавить блюдо.
        </Card>
      )}
      {selectedDish && (
        <DishCard ref={cardRef} dish={selectedDish} />
      )}
    </Box>
  );
}
