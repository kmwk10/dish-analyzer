import { Card, CardBody, Input, Text, InputGroup, InputRightElement, Textarea, Button, Flex, IconButton, CloseButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import ServingSelect from "./ServingSelect";
import NutritionSelect from "./NutritionSelect";

import { formatNumber } from "../../utils/number";
import { CloseIcon } from "@chakra-ui/icons";

export default function EditorDishCard({ dish, localProducts, productWeights, handleWeightChange, handleRemoveProduct }) {
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

  // Для тестирования
  const product1 = {
    "id": 1,
    "name": "Творог 0,5% (Село зелёное)",
    "calories": 74,
    "protein": 18,
    "fat": 0.5,
    "carbs": 3.3,
    "used_in_dishes": ["Творожная запеканка", "Сырники", "Ватрушки"]
  }

    const product2 = {
    "id": 2,
    "name": "Манка (Шебекинская)",
    "calories": 350,
    "protein": 13,
    "fat": 1,
    "carbs": 72,
    "used_in_dishes": ["Творожная запеканка"]
  }

  const products = [product1, product2]

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
  
  const handleServingSave = (newValue) => {
    const w = parseFloat(weight.replace(",", "."));
    const val = parseFloat(newValue.replace(",", "."));

    if (!w || !val) return;

    if (servingMode === "servings") {
      const newServingWeight = w / val;
      setServings(newValue);
      setServingWeight(formatNumber(newServingWeight));
    } else {
      const newServings = w / val;
      setServingWeight(newValue);
      setServings(formatNumber(newServings, 2));
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
          {localProducts?.length > 0 ? (
            localProducts.map((product) => (
              <Flex 
                marginBottom="0.5rem"
                alignItems="center"
                _last={{ mb: 0 }}
              >
                <Card
                  key={product.id}
                  padding="0.3rem 0.6rem"
                >
                  <Flex>
                    <Text>{products.find(p => p.id === product.id)?.name}</Text>
                    <InputGroup size="xs" width="20%" ml="auto">
                      <Input
                        value={productWeights[product.id] ?? ""}
                        onChange={(e) => handleWeightChange(product.id, e.target.value)}
                      />
                      <InputRightElement children="г" ml="0.5rem" />
                    </InputGroup>
                  </Flex>
                </Card>
                <IconButton
                  icon={<CloseIcon/>}
                  colorScheme="white"
                  size="xs"
                  variant="ghost"
                  onClick={() => handleRemoveProduct(product.id)}
                />
              </Flex>
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
          onSave={handleServingSave}
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
          weight={weight}
          servings={servings}
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
