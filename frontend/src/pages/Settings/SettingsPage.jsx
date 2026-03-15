import { Box, Card, CardHeader, Flex, Badge, Heading, Button, Avatar, Input, IconButton } from "@chakra-ui/react";
import { EditIcon, CloseIcon } from "@chakra-ui/icons";
import { useState, useEffect, useContext, useRef } from "react";
import { getUserInfo, uploadAvatar, getAvatar, deleteAvatar } from "../../api/user";
import { AuthContext } from "../../context/AuthContext";

import SettingsItem from "./SettingsItem";
import SettingsCard from "./SettingsCard";
import PasswordCard from "./PasswordCard";

export default function SettingsPage() {
  const [settingsOpen, setSettingsOpen] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const fileInputRef = useRef(null);
  const { logout } = useContext(AuthContext);

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

  useEffect(() => {
    async function fetchAvatar() {
      try {
        const url = await getAvatar();
        setAvatarUrl(url);
      } catch {}
    }

    fetchAvatar();
  }, []);

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadAvatar(file);
      const url = await getAvatar();
      setAvatarUrl(url);
    } catch (err) {
      console.error("Avatar upload failed", err);
    }
  }

  async function handleAvatarDelete() {
    try {
      await deleteAvatar();
      setAvatarUrl(null);
    } catch (err) {
      console.error("Avatar delete failed", err);
    }
  }

  if (!userInfo) return <Box>Loading...</Box>;

  return (
    <Box margin="2vh 10vw">
      <Card backgroundColor="#ECECEC" padding="3vh" marginTop="3vh">
        <CardHeader padding="0 0 1rem 0">
          <Flex justify="space-between" align="center">
            <Flex align="stretch" gap="1.5rem">
              <Avatar
                size="xl"
                bg="purple.500"
                name={userInfo.username}
                src={avatarUrl || undefined}
                cursor={!avatarUrl ? "pointer" : "default"}
                onClick={!avatarUrl ? openFileDialog : undefined}
              />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                p="0.2rem 0.5rem"
              >
                <Heading size="lg">
                  {userInfo.username}
                </Heading>
                {avatarUrl && (
                  <Flex gap="0.5rem">
                    <IconButton
                      icon={<EditIcon />}
                      colorScheme="purple"
                      size="sm"
                      onClick={openFileDialog}
                    />
                    <IconButton
                      icon={<CloseIcon />}
                      colorScheme="red"
                      size="sm"
                      onClick={handleAvatarDelete}
                    />
                  </Flex>
                )}
              </Box>
            </Flex>
            {userInfo.role === "admin" && (
              <Badge colorScheme="purple" variant="subtle" fontSize="1em">
                ADMIN
              </Badge>
            )}
          </Flex>
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

      <Flex justify="flex-end" marginTop="1rem">
        <Button
          padding="0.8rem 1.5rem"
          colorScheme="purple"
          width="min"
          onClick={logout}
        >
          Выйти
        </Button>
      </Flex>

      {(settingsOpen === "username" || settingsOpen === "email") && (
        <SettingsCard
          option={settingsOpen}
          onCancel={() => setSettingsOpen("")}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
      )}

      {settingsOpen === "password" && (
        <PasswordCard onCancel={() => setSettingsOpen("")} />
      )}

      <Input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        display="none"
        onChange={handleAvatarUpload}
      />
    </Box>
  );
}
