import { Card, Box, Input, Button, useOutsideClick, Flex } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect  } from "react";
import { useParams } from "react-router-dom";

import EditorDishCard from "./EditorDishCard";
import EditorProductsList from "./EditorProductsList";
import ProductEditor from "../Products/ProductEditor";
import ToggleCards from "../../components/ToggleCards";


export default function EditorPage() {
  const { id } = useParams();

  const isNew = id === "new";
  const [dish, setDish] = useState({});
  const [selectedSection, setSelectedSection] = useState("Мои продукты");
  const [editingProduct, setEditingProduct] = useState(null);

  const editRef = useRef();

  useOutsideClick({
    ref: editRef,
    handler: () => setEditingProduct(null),
  });

  // Для тестирования
  const product1 = {
    "name": "Творог 0,5% (Село зелёное)",
    "calories": 74,
    "protein": 18,
    "fat": 0.5,
    "carbs": 3.3,
    "used_in_dishes": ["Творожная запеканка", "Сырники", "Ватрушки"]
  }

    const product2 = {
    "name": "Манка (Шебекинская)",
    "calories": 350,
    "protein": 13,
    "fat": 1,
    "carbs": 72,
    "used_in_dishes": ["Творожная запеканка"]
  }

  const product3 = {
    "name": "Молоко 2,5% (Станция молочная)",
    "calories": 53,
    "protein": 3,
    "fat": 2.5,
    "carbs": 4.7,
    "used_in_dishes": []
  }

  const myProducts = [product1]
  const allProducts = [product1, product2,  product3]
  const currentProducts = (selectedSection === "Мои продукты") ? myProducts : allProducts

  useEffect(() => {
    if (!isNew) {
      // имитация загрузки существующего блюда
      const fakeDish = {
        "name": "Творожная запеканка",
        "weight": 480,
        "calories": 117,
        "protein": 15,
        "fat": 2.5,
        "carbs": 10,
        "servings": 2,
        "products": [product1, product2, product3],
        "recipe": "Смешайте 2 яйца, творог и муку.\nПерелейте получившееся тесто в форму.\nПоставьте запекаться в духовку при 180 градусах на 45 минут."
      };
      setDish(fakeDish);
    }
  }, [id]);

  return (
    <Flex height="92vh" p="0 3vw">
      <Box flex="1" mr="1.5vw" m="3vh">
        <EditorDishCard dish={dish} />
      </Box>

      <Box flex="2" ml="1.5vw">
        <ToggleCards size="sm" option1={"Мои продукты"} option2={"Все продукты"} onChange={setSelectedSection} />
        <Input size="md" placeholder="Введите название продукта" background="white" marginBottom="3vh"/>
        <Button size="sm" leftIcon={<SmallAddIcon/>} height="2.5rem" colorScheme="purple" marginBottom="3vh" onClick={() => setEditingProduct({})}>
          Добавить продукт
        </Button>
        {currentProducts.length > 0 ? (
          <EditorProductsList products={currentProducts} setEditingProduct={setEditingProduct}/>
        ) : (
          <Card backgroundColor="#ECECEC" padding="3vh" textAlign="center">
            Здесь пока ничего нет. Нажмите на кнопку, чтобы добавить продукт.
          </Card>
        )}
        {editingProduct && (
          <ProductEditor ref={editRef} product={editingProduct} onSave={() => (setEditingProduct(null))} />
        )}
      </Box>
    </Flex>
  );
}
