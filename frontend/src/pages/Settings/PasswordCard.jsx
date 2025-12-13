import { Card, Box, Text, Input, CardBody, Flex, Button, Alert, AlertIcon } from "@chakra-ui/react";
import { useState } from "react";
import { updateUserPassword } from "../../api/user";

export default function PasswordCard({ onCancel }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (newPassword !== repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }
    try {
      await updateUserPassword({ old_password: oldPassword, new_password: newPassword });
      onCancel();
    } catch (err) {
      setError("Не удалось обновить пароль");
      console.error(err);
    }
  };

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
      {error && (
        <Alert
          status="error"
          variant='left-accent'
          position="fixed"
          top="1rem"
          left="50%"
          transform="translateX(-50%)"
          zIndex="10"
          width="fit-content"
        >
          <AlertIcon />
          {error}
        </Alert>
      )}
      <Card width="34vw" padding="0 1rem">
        <CardBody>
          <Text>Старый пароль</Text>
          <Input
            size="sm"
            margin="0.5rem 0 1rem 0"
            placeholder="Введите старый пароль"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            type="password"
          />
          <Text>Новый пароль</Text>
          <Input
            size="sm"
            margin="0.5rem 0 0 0"
            placeholder="Введите новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
          />
          <Input
            size="sm"
            margin="0.5rem 0 1rem 0"
            placeholder="Повторите новый пароль"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            type="password"
          />
          <Flex direction="column">
            <Button size="sm" marginBottom="1rem" colorScheme="purple" onClick={handleSave}>
              Сохранить
            </Button>
            <Button size="sm" onClick={onCancel}>Отмена</Button>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
}
