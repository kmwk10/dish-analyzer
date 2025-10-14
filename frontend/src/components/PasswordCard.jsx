import { Card, Box, Text, Input, CardBody, Flex, Button } from "@chakra-ui/react";

export default function PasswordCard({ onCancel }) {
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
      <Card width="34vw" padding="0 1rem">
        <CardBody>
          <Text>Старый пароль</Text>
          <Input size="sm" margin="0.5rem 0 1rem 0" placeholder="Введите старый пароль"/>
          <Text>Новый пароль</Text>
          <Input size="sm" margin="0.5rem 0 0 0" placeholder="Введите новый пароль"/>
          <Input size="sm" margin="0.5rem 0 1rem 0" placeholder="Повторите новый пароль"/>
          <Flex direction="column">
            <Button size="sm" marginBottom="1rem" colorScheme="purple">Сохранить</Button>
            <Button size="sm" onClick={onCancel}>Отмена</Button>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
}
