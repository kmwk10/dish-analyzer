import { Card, CardHeader, Heading, CardBody, Text, Input, Flex, Button } from "@chakra-ui/react";
import { useState } from "react";

export default function LoginCard({ onClick, onSubmit, loading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card width="34vw" padding="1.5rem">
      <CardHeader  padding="0">
        <Heading fontSize="1.5rem" textAlign="center">Добро пожаловать!</Heading>
      </CardHeader>

      <CardBody>
        <Text>Электронная почта</Text>
        <Input size="sm" margin="0.5rem 0 1rem 0" placeholder="Введите электронную почту" value={email} onChange={e => setEmail(e.target.value)}/>
        <Text>Пароль</Text>
        <Input size="sm" margin="0.5rem 0 1rem 0" placeholder="Введите пароль" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        <Flex direction="column">
          <Button size="sm" marginBottom="1rem" colorScheme="purple" isLoading={loading} onClick={() => onSubmit({ email, password })}>Войти</Button>
          <Button size="sm" onClick={onClick}>Зарегистрироваться</Button>
        </Flex>
      </CardBody>
    </Card>
  );
}
