import { Card, Flex, Text } from "@chakra-ui/react";

import ProductItem from "./ProductItem";

export default function ProductsList({ products,setSelectedProduct }) {
  return (
    <Card backgroundColor="#ECECEC" padding="3vh">
      <Flex alignItems="center" padding="0 4rem 2vh 1.5rem">
          <Text>Название</Text>
          <Text width="11vw" ml="auto">КБЖУ на 100г</Text>
          <Text width="28svw">Используется в</Text>
      </Flex>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} setSelectedProduct={setSelectedProduct}/>
      ))}
    </Card>
  );
}
