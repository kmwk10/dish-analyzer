import { Box, Card, CardBody, CardHeader, Flex, Heading, CloseButton, Text, Input, Button, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function AuthPage() {
  const [view, setView] = useState("welcome"); // welcome | login | register
  
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      overflow="hidden"
      zIndex="-1"
      bgImage="url('/bg.svg')"
      bgSize="105%"      
      bgPosition="center"
      bgRepeat="no-repeat"
      bgAttachment="fixed"   
    >
      {view === "welcome" && (
        <Flex minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <Card width="46vh" padding="1.5rem" position="relative">
            <CloseButton
              position="absolute"
              top="2"
              right="2"
              size="lg"
              onClick={() => setView("login")}
            />

            <CardHeader  padding="0">
              <Heading fontSize="1.5rem" letterSpacing="widest" textAlign="center">КБЖУшка</Heading>
            </CardHeader>

            <CardBody lineHeight="1.25rem">
              КБЖУшка — это твой удобный помощник для подсчёта калорий и составления блюд.<br />
              <br />
              Забудь про скучные таблицы и вечные калькуляторы: у нас всё просто и красиво.<br />
              <br />
              Добавляй продукты, комбинируй их в блюда и сразу получай точный расчёт калорийности, белков, жиров и углеводов.<br />
              <br />
              Веди свой личный аккаунт, храни любимые рецепты и контролируй питание так, как удобно именно тебе.<br />
              <br />
              С КБЖУшкой ты сможешь есть вкусно и осознанно, не тратя время на лишние подсчёты.
            </CardBody>
          </Card>
        </Flex>
      )}
      {view === "login" && (
        <Flex minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <Card width="46vh" padding="1.5rem">
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
                <Button size="sm" onClick={() => setView("register")}>Зарегистрироваться</Button>
              </Flex>
            </CardBody>
          </Card>
        </Flex>
      )}
      {view === "register" && (
        <Flex minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <Card width="46vh" padding="1.5rem" position="relative">
            <IconButton
              icon={<ArrowBackIcon />}
              position="absolute"
              top="2"
              right="2"
              variant="ghost"
              onClick={() => setView("login")}
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
        </Flex>
      )}
    </Box>
  );
}
