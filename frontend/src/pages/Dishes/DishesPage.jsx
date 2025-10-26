import { Card, Box, Input, Button, useOutsideClick } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef } from "react";

import ToggleCards from "../../components/ToggleCards";
import DishesList from "./DishesList";
import DishCard from "./DishCard";

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
    "weight": 480,
    "calories": 117,
    "protein": 15,
    "fat": 2.5,
    "carbs": 10,
    "servings": 2
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
