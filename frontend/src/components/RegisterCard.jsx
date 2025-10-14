import { Card, IconButton, CardHeader, Heading, CardBody, Text, Input, Button } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

export default function RegisterCard({ onClick }) {
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
        <Input size="sm" margin="0.5rem 0 1rem 0" placeholder="Введите имя"/>              
        <Text>Электронная почта</Text>
        <Input size="sm" margin="0.5rem 0 1rem 0" placeholder="Введите электронную почту"/>
        <Text>Пароль</Text>
        <Input size="sm" margin="0.5rem 0 0 0" placeholder="Введите пароль"/>
        <Input size="sm" margin="0.5rem 0 1rem 0" placeholder="Повторите пароль"/>
        <Button size="sm" colorScheme="purple" width="100%">Зарегистрироваться</Button>
      </CardBody>
    </Card>
  );
}
