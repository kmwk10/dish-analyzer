import { Card, Flex, Text } from "@chakra-ui/react";

import EditorProductItem from "./EditorProductItem";

export default function EditorProductsList({ products,setSelectedProduct, setEditingProduct }) {
  return (
    <Card backgroundColor="#ECECEC" padding="3vh">
      <Flex alignItems="center" padding="0 4rem 2vh 1.5rem">
          <Text>Название</Text>
          <Text width="9vw" ml="auto" mr="40px">КБЖУ на 100г</Text>
      </Flex>
      {products.map((product) => (
        <EditorProductItem key={product.id} product={product} setSelectedProduct={setSelectedProduct} setEditingProduct={setEditingProduct}/>
      ))}
    </Card>
  );
}
