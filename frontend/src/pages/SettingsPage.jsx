import { Box, Card, CardHeader, Heading } from "@chakra-ui/react";
import { useState } from "react";

import SettingsItem from "../components/SettingsItem";
import SettingsCard from "../components/SettingsCard";
import PasswordCard from "../components/PasswordCard";

export default function SettingsPage() {
  const [settingsOpen, setSettingsOpen] = useState(""); // name | email | password

  // Для тестирования
  const user_info = {
    "name": "My name",
    "email": "mymail@gmail.com",
    "password_len": 12
  }

  return (
    <Box margin="2vh 10vw">
      <Card backgroundColor="#ECECEC" padding="3vh" marginTop="3vh">
        <CardHeader padding="0 0 1rem 0">
          <Heading size="md">Привет, {user_info.name}!</Heading>
        </CardHeader>
        <SettingsItem
          label="Имя"
          user_info={user_info.name}
          onClick={() => setSettingsOpen("name")}
        />
        <SettingsItem
          label="Электронная почта"
          user_info={user_info.email}
          onClick={() => setSettingsOpen("email")}
        />
        <SettingsItem 
          label="Пароль" 
          user_info={"*".repeat(user_info.password_len)}
          onClick={() => setSettingsOpen("password")}
        />
      </Card>
      {(settingsOpen === "name" || settingsOpen === "email") && (
        <SettingsCard option={settingsOpen} onCancel={() => setSettingsOpen("")}/>
      )}
      {settingsOpen === "password" && (
        <PasswordCard onCancel={() => setSettingsOpen("")} />
      )}
    </Box>
  );
}
