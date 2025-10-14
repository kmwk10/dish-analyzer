import { Flex, Card, CardBody, CardHeader, Heading, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
      <Flex minH="92vh" display="flex" alignItems="center" justifyContent="center">
        <Card padding="1rem" minWidth="30vw">
          <CardHeader textAlign="center" paddingBottom="0">
            <Heading>404</Heading>
          </CardHeader>
          <CardBody textAlign="center">  
            <Text marginBottom="2rem">
              Страница не найдена
            </Text>
            <Button size="sm" colorScheme="purple" paddingX="4rem" onClick={() => navigate("/")}>
              На главную
            </Button>
          </CardBody>
        </Card>
      </Flex>
  );
}
