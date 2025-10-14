import { Card, Flex, Text } from "@chakra-ui/react";

import DishItem from "./DishItem";

export default function DishesList({ dishes, setSelectedDish }) {  
  return (
    <Card backgroundColor="#ECECEC" padding="3vh">
      <Flex alignItems="center" padding="0 4rem 2vh 1.5rem">
          <Text>Название</Text>
          <Text width="4vw" marginLeft="auto">Вес</Text>
          <Text width="9vw">Кол-во порций</Text>
          <Text width="7vw">Вес порции</Text>
          <Text width="11vw">КБЖУ на 100г</Text>
          <Text width="11vw">КБЖУ на порцию</Text>
          <Text width="11vw">КБЖУ на всё блюдо</Text>
      </Flex>
      {dishes.map((dish) => (
        <DishItem key={dish.id} dish={dish} setSelectedDish={setSelectedDish}/>
      ))}
    </Card>
  );
}
