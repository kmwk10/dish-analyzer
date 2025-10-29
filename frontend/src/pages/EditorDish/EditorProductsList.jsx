import { Card, Flex, Text } from "@chakra-ui/react";

import EditorProductItem from "./EditorProductItem";

export default function EditorProductsList({ products,setSelectedProduct, setEditingProduct, onAddProduct }) {
  return (
    <Card backgroundColor="#ECECEC" padding="2.5vh">
      <Flex alignItems="center" padding="0 1.4rem 1vh 1rem">
          <Text>Название</Text>
          <Text width="9vw" ml="auto" mr="80px">КБЖУ на 100г</Text>
      </Flex>
      {products.map((product) => (
        <EditorProductItem
          key={product.id}
          product={product}
          setSelectedProduct={setSelectedProduct}
          setEditingProduct={setEditingProduct}
          onAddProduct={onAddProduct}/>
      ))}
    </Card>
  );
}
