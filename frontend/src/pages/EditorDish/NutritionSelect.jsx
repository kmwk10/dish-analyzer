import { Select, Box, Flex, Text, Input, InputGroup, InputRightElement } from "@chakra-ui/react";

export default function NutritionSelect({
  mode,
  setMode,
  calories,
  setCalories,
  protein,
  setProtein,
  fat,
  setFat,
  carbs,
  setCarbs,
}) {
  return (
    <>
      <Select
        size="sm"
        mb="0.5rem"
        width="fit-content"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="per_100g">На 100 грамм</option>
        <option value="per_serving">На порцию</option>
        <option value="total">На всё блюдо</option>
      </Select>

      <Box fontSize="sm" m="0 1.5rem" mb="1rem">
        <Flex mb="0.5rem" justifyContent="space-between">
          <Text>Калорийность</Text>
          <InputGroup size="xs" width="65%">
            <Input
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              pr="2.5rem"
            />
            <InputRightElement children="ккал" m="0 0.5rem" />
          </InputGroup>
        </Flex>

        <Flex mb="0.5rem" justifyContent="space-between">
          <Text>Белки</Text>
          <InputGroup size="xs" width="65%">
            <Input
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              pr="2.5rem"
            />
            <InputRightElement children="г" m="0 1.1rem" />
          </InputGroup>
        </Flex>

        <Flex mb="0.5rem" justifyContent="space-between">
          <Text>Жиры</Text>
          <InputGroup size="xs" width="65%">
            <Input
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              pr="2.5rem"
            />
            <InputRightElement children="г" m="0 1.1rem" />
          </InputGroup>
        </Flex>

        <Flex mb="0.5rem" justifyContent="space-between">
          <Text>Углеводы</Text>
          <InputGroup size="xs" width="65%">
            <Input
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              pr="2.5rem"
            />
            <InputRightElement children="г" m="0 1.1rem" />
          </InputGroup>
        </Flex>
      </Box>
    </>
  );
}
