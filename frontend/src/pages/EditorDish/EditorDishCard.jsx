import { Card, CardBody, Input, Text, InputGroup, InputRightElement, Textarea, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import ServingSelect from "./ServingSelect";
import NutritionSelect from "./NutritionSelect";

import { formatNumber } from "../../utils/number";

export default function EditorDishCard({ dish }) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");

  const [servingMode, setServingMode] = useState("servings");
  const [servings, setServings] = useState("");
  const [servingWeight, setServingWeight] = useState("");

  const [nutritionMode, setNutritionMode] = useState("per_100g");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");

  const [recipe, setRecipe] = useState("");

  useEffect(() => {
    if (!dish) return;

    setName(dish.name || "");

    setWeight(dish.weight != null ? String(dish.weight).replaceAll(".", ",") : "");
    setServings(dish.servings != null ? String(dish.servings).replaceAll(".", ",") : "");
    
    if (dish.weight != null && dish.servings) {
      const w = parseFloat(dish.weight);
      const s = parseFloat(dish.servings);
      setServingWeight(formatNumber(w / s));
    } else {
      setServingWeight("");
    }
    
    setCalories(dish.calories != null ? String(dish.calories).replaceAll(".", ",") : "");
    setProtein(dish.protein != null ? String(dish.protein).replaceAll(".", ",") : "");
    setFat(dish.fat != null ? String(dish.fat).replaceAll(".", ",") : "");
    setCarbs(dish.carbs != null ? String(dish.carbs).replaceAll(".", ",") : "");

    setRecipe(dish.recipe || "");
  }, [dish]);

  const currentServingValue = servingMode === "servings" ? servings : servingWeight;
  
  const handleServingInputChange = (e) => {
    const value = e.target.value;
    if (servingMode === "servings") {
      setServings(value);
    } else {
      setServingWeight(value);
    }
  };

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

        <Card fontSize="sm" backgroundColor="#ECECEC" padding="1rem" mb="1rem">
          {dish?.products?.length > 0 ? (
            dish.products.map((product) => (
              <Card
                key={product.id}
                marginBottom="0.5rem"
                padding="0.3rem 0.6rem"
                _last={{ mb: 0 }}
              >
                <Text>{product.name}</Text>
              </Card>
            ))
          ) : (
            <Text textAlign="center">
              Здесь будет список продуктов
            </Text>
          )}
        </Card>

        <Text mb="0.5rem" fontSize="sm">Вес в готовом виде</Text>
        <InputGroup size="sm">
          <Input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Введите вес блюда"
            mb="1rem"
          />
          <InputRightElement children="г" ml="1rem"/>
        </InputGroup>

        <ServingSelect
          mode={servingMode}
          setMode={setServingMode}
          currentValue={currentServingValue}
          handleServingInputChange={handleServingInputChange}
        />

        <NutritionSelect
          mode={nutritionMode}
          setMode={setNutritionMode}
          calories={calories}
          setCalories={setCalories}
          protein={protein}
          setProtein={setProtein}
          fat={fat}
          setFat={setFat}
          carbs={carbs}
          setCarbs={setCarbs}
        />

        <Text mb="0.5rem" fontSize="sm">Рецепт</Text>
        <Textarea
          size="sm"
          placeholder="Введите рецепт"
          mb="1rem"
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
        />

        <Button size="sm" colorScheme="purple" width="100%" mb="1rem">Сохранить</Button>
        <Button size="sm" colorScheme="red" width="100%">Удалить</Button>
      </CardBody>
    </Card>
  );
}
