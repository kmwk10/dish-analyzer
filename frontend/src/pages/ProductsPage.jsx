import { Card, Box, Input, Button, useOutsideClick } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useState, useRef  } from "react";

import ToggleCards from "../components/ToggleCards";
import ProductsList from "../components/ProductsList";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const [selectedSection, setSelectedSection] = useState("Мои продукты");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const cardRef = useRef()

  useOutsideClick({
    ref: cardRef,
    handler: () => setSelectedProduct(null),
  });

  // Для тестирования
  const product = {
    "name": "Творог 0,5% (Село зелёное)",
    "nutrition_per_100g": "74/18/0,5/3,3",
    "used_in_dishes": "Творожная запеканка, сырники, ватрушки"
  }

  const myProducts = []
  const allProducts = [product]
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
