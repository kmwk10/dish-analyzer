import { Card, Box, Text, CardBody, Flex, Button } from "@chakra-ui/react";
import { forwardRef } from "react";

const ProductCard = forwardRef(({ product, onEdit }, ref) => {
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
          <Text mb="1rem">{product.name}</Text>
          <Text fontSize="sm" mb="0.5rem">На 100 грамм</Text>
          <Box fontSize="sm" m="0 1.5rem" mb="1rem">
            <Flex mb="0.5rem" justifyContent="space-between">
              <Text>Калорийность</Text>
              <Text>{String(product.calories).replaceAll('.', ',')} ккал</Text>
            </Flex>
            <Flex mb="0.5rem" justifyContent="space-between">
              <Text>Белки</Text>
              <Text>{String(product.protein).replaceAll('.', ',')} г</Text>
            </Flex>
            <Flex mb="0.5rem" justifyContent="space-between">
              <Text>Жиры</Text>
              <Text>{String(product.fat).replaceAll('.', ',')} г</Text>
            </Flex>
            <Flex mb="0.5rem" justifyContent="space-between">
              <Text>Углеводы</Text>
              <Text>{String(product.carbs).replaceAll('.', ',')} г</Text>
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
          <Button size="sm" colorScheme="purple" width="100%" mb="1rem" onClick={onEdit}>Изменить</Button>
          <Button size="sm" colorScheme="red" width="100%">Удалить</Button>
        </CardBody>
      </Card>
    </Box>
  );
});

export default ProductCard;
