import { Card, CardHeader, Heading, CardBody, Text, Input, Flex, Button } from "@chakra-ui/react";

export default function LoginCard({ onClick }) {
  return (
    <Card width="34vw" padding="1.5rem">
      <CardHeader  padding="0">
        <Heading fontSize="1.5rem" textAlign="center">Добро пожаловать!</Heading>
      </CardHeader>

      <CardBody>
        <Text>Электронная почта</Text>
        <Input size="sm" margin="0.5rem 0 1rem 0" placeholder="Введите электронную почту"/>
        <Text>Пароль</Text>
        <Input size="sm" margin="0.5rem 0 1rem 0" placeholder="Введите пароль"/>
        <Flex direction="column">
          <Button size="sm" marginBottom="1rem" colorScheme="purple">Войти</Button>
          <Button size="sm" onClick={onClick}>Зарегистрироваться</Button>
        </Flex>
      </CardBody>
    </Card>
  );
}
