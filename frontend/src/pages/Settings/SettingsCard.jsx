import { Card, Box, Text, Input, CardBody, Flex, Button, Alert, AlertIcon } from "@chakra-ui/react";
import { useState } from "react";
import { updateUserInfo } from "../../api/user";

export default function SettingsCard({ option, onCancel, userInfo, setUserInfo }) {
  const [value, setValue] = useState(userInfo[option]);
  const [error, setError] = useState(null);

  const fieldMeta = {
    "username": {
      "label": "Новое имя",
      "placeholder": "Введите новое имя"
    },
    "email": {
      "label": "Новая электронная почта",
      "placeholder": "Введите новую электронную почту"
    }
  }

  const handleSave = async () => {
    try {
      const updated = await updateUserInfo({ [option]: value });
      setUserInfo(updated);
      onCancel(); 
    } catch (err) {
      setError("Не удалось обновить данные");
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
          <Text>{fieldMeta[option].label}</Text>
          <Input
            size="sm"
            margin="0.5rem 0 1rem 0"
            placeholder={fieldMeta[option].placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
