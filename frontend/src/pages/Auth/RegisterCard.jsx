import { Card, IconButton, CardHeader, Heading, CardBody, Text, Input, Button } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function RegisterCard({ onClick, onSubmit, loading }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  return (
    <Card width="34vw" padding="1.5rem" position="relative">
      <IconButton
        icon={<ArrowBackIcon />}
        position="absolute"
        top="2"
        right="2"
        variant="ghost"
        onClick={onClick}
      />
      <CardHeader  padding="0">
        <Heading fontSize="1.5rem" textAlign="center">Регистрация</Heading>
      </CardHeader>

      <CardBody>
        <Text>Имя</Text>
        <Input size="sm" margin="0.5rem 0 1rem 0" placeholder="Введите имя" value={name} onChange={e => setName(e.target.value)}/>              
        <Text>Электронная почта</Text>
        <Input size="sm" margin="0.5rem 0 1rem 0" placeholder="Введите электронную почту" value={email} onChange={e => setEmail(e.target.value)}/>
        <Text>Пароль</Text>
        <Input size="sm" margin="0.5rem 0 0 0" placeholder="Введите пароль" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        <Input size="sm" margin="0.5rem 0 1rem 0" placeholder="Повторите пароль" type="password" value={password2} onChange={e => setPassword2(e.target.value)}/>
        <Button size="sm" colorScheme="purple" width="100%" isLoading={loading} onClick={() => onSubmit({ name, email, password, password2 })}>Зарегистрироваться</Button>
      </CardBody>
    </Card>
  );
}
