import { Box, Card, CardHeader, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getUserInfo } from "../../api/user";

import SettingsItem from "./SettingsItem";
import SettingsCard from "./SettingsCard";
import PasswordCard from "./PasswordCard";

export default function SettingsPage() {
  const [settingsOpen, setSettingsOpen] = useState(""); // username | email | password
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    }
    fetchUser();
  }, []);

  if (!userInfo) return <Box>Loading...</Box>;

  return (
    <Box margin="2vh 10vw">
      <Card backgroundColor="#ECECEC" padding="3vh" marginTop="3vh">
        <CardHeader padding="0 0 1rem 0">
          <Heading size="md">Привет, {userInfo.username}!</Heading>
        </CardHeader>
        <SettingsItem
          label="Имя"
          user_info={userInfo.username}
          onClick={() => setSettingsOpen("username")}
        />
        <SettingsItem
          label="Электронная почта"
          user_info={userInfo.email}
          onClick={() => setSettingsOpen("email")}
        />
        <SettingsItem 
          label="Пароль" 
          user_info={"*".repeat(12)}
          onClick={() => setSettingsOpen("password")}
        />
      </Card>
      {(settingsOpen === "username" || settingsOpen === "email") && (
        <SettingsCard option={settingsOpen} onCancel={() => setSettingsOpen("")} userInfo={userInfo} setUserInfo={setUserInfo}/>
      )}
      {settingsOpen === "password" && (
        <PasswordCard onCancel={() => setSettingsOpen("")}/>
      )}
    </Box>
  );
}
