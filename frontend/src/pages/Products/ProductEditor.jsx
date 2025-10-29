import { Card, Box, Text, CardBody, Flex, Button, Input, InputRightElement, InputGroup } from "@chakra-ui/react";
import { forwardRef, useState } from "react";

const ProductEditor = forwardRef(({ product, onSave }, ref) => {
  const [name, setName] = useState(product?.name || "");
  const [calories, setCalories] = useState(
    product?.calories != null ? String(product.calories).replaceAll('.', ',') : ""
  );
  const [protein, setProtein] = useState(
    product?.protein != null ? String(product.protein).replaceAll('.', ',') : ""
  );
  const [fat, setFat] = useState(
    product?.fat != null ? String(product.fat).replaceAll('.', ',') : ""
  );
  const [carbs, setCarbs] = useState(
    product?.carbs != null ? String(product.carbs).replaceAll('.', ',') : ""
  );


  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      backgroundColor="rgba(0, 0, 0, 0.3)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      zIndex="1000"
    >
      <Card width="30vw" padding="0 1rem" ref={ref}>
        <CardBody>
          <Text mb="0.5rem" fontSize="sm">Название</Text>
          <Input 
            size="sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите название продукта"
            mb="1rem"
          />
          <Text fontSize="sm" mb="0.5rem">На 100 грамм</Text>
          <Box fontSize="sm" m="0 1.5rem" mb="1rem">

            <Flex mb="0.5rem" justifyContent="space-between">
              <Text>Калорийность</Text>
              <InputGroup size="xs" width="65%">
                <Input
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  pr="2.5rem"
                />
                <InputRightElement children="ккал" m="0 0.5rem"/>
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
                  <InputRightElement children="г" m="0 1.1rem"/>
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
                <InputRightElement children="г" m="0 1.1rem"/>
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
                <InputRightElement children="г" m="0 1.1rem"/>
              </InputGroup>
            </Flex>

          </Box>
          {product.used_in_dishes?.length > 0 && (
            <>
              <Text fontSize="sm" mb="0.5rem">Изпользуется в</Text>
              <Card fontSize="sm" backgroundColor="#ECECEC" padding="1rem" mb="1rem">
                {product.used_in_dishes.map((dish) => (
                  <Card marginBottom="0.5rem" padding="0.3rem 0.6rem" _last={{ mb: 0 }}>
                    <Text>{dish}</Text>
                  </Card>
                ))}
              </Card>
            </>
          )}
          <Button size="sm" colorScheme="purple" width="100%" mb="1rem" onClick={onSave}>Сохранить</Button>
          <Button size="sm" colorScheme="red" width="100%">Удалить</Button>
        </CardBody>
      </Card>
    </Box>
  );
});

export default ProductEditor;
