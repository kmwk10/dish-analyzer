import { Card, Flex, Text, IconButton, Box } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

export default function DishItem({ dish, setSelectedDish }) {
  return (
    <Box 
      onClick={() => setSelectedDish(dish)}
    >
      <Card marginBottom="0.5rem">
        <Flex alignItems="center" padding="0.8rem 1.5rem">
          <Text>{dish.name}</Text>
          <Text width="4vw"  ml="auto">{dish.weight}</Text>
          <Text width="9vw">{dish.servings}</Text>
          <Text width="7vw">{dish.serving_weight}</Text>
          <Text width="11vw">{dish.nutrition_per_100g}</Text>
          <Text width="11vw">{dish.nutrition_per_serving}</Text>
          <Text width="11vw">{dish.nutrition_total}</Text>
          <IconButton
            icon={<EditIcon />}
            variant="ghost"
          />
        </Flex>
      </Card>
    </Box>
  );
}
