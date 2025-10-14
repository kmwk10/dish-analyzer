import { Box, Card, CardHeader, Flex, Heading, Text } from "@chakra-ui/react";
import SettingsItem from "../components/SettingsItem";

export default function SettingsPage() {
  // Для тестирования
  const user_info = {
    "name": "My name",
    "email": "mymail@gmail.com",
    "password_len": 8
  }

  return (
    <Box margin="2vh 10vw">
      <Card backgroundColor="#ECECEC" padding="3vh" marginTop="3vh">
        <CardHeader padding="0 0 1rem 0">
          <Heading size="md">Привет, {user_info.name}!</Heading>
        </CardHeader>
        <SettingsItem label="Имя" user_info={user_info.name}/>
        <SettingsItem label="Электронная почта" user_info={user_info.email}/>
        <SettingsItem label="Пароль" user_info={"*".repeat(user_info.password_len)}/>
      </Card>
    </Box>
  );
}
