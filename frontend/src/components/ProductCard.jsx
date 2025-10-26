import { Card, Box, Text, CardBody } from "@chakra-ui/react";
import { forwardRef } from "react";

const ProductCard = forwardRef(({ product }, ref) => {
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
      <Card width="34vw" padding="0 1rem" ref={ref}>
        <CardBody>
          <Text>{product.name}</Text>
        </CardBody>
      </Card>
    </Box>
  );
});

export default ProductCard;
