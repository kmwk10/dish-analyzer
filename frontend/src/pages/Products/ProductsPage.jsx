import { Card, Box, Input, Button, useOutsideClick } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef  } from "react";

import ToggleCards from "../../components/ToggleCards";
import ProductsList from "./ProductsList";
import ProductCard from "./ProductCard";

export default function ProductsPage() {
  const [selectedSection, setSelectedSection] = useState("Мои продукты");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const cardRef = useRef()

  useOutsideClick({
    ref: cardRef,
    handler: () => setSelectedProduct(null),
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

  return (
    <Box margin="2vh 10vw">
      <ToggleCards option1={"Мои продукты"} option2={"Все продукты"} onChange={setSelectedSection}/>
      <Input size="lg" placeholder="Введите название продукта" background="white" marginBottom="3vh"/>
      <Button size="md" leftIcon={<SmallAddIcon/>} height="3rem" colorScheme="purple" marginBottom="3vh">
        Добавить продукт
      </Button>
      {currentProducts.length > 0 ? (
        <ProductsList products={currentProducts} setSelectedProduct={setSelectedProduct}/>
      ) : (
        <Card backgroundColor="#ECECEC" padding="3vh" textAlign="center">
          Здесь пока ничего нет. Нажмите на кнопку, чтобы добавить продукт.
        </Card>
      )}
      {selectedProduct && (
        <ProductCard ref={cardRef} product={selectedProduct} />
      )}
    </Box>
  );
}
