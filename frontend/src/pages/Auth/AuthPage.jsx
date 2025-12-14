import { Box, Flex, Alert, AlertIcon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { login, register } from "../../api/auth";
import WelcomeCard from "./WelcomeCard";
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";

export default function AuthPage() {
  const navigate = useNavigate();

  const [view, setView] = useState("welcome"); // welcome | login | register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const tokens = await login(data)

      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);

      navigate("/"); 
    } catch (e) {
      setError("Неверная почта или пароль");
    } finally {
      setLoading(false);
    }
  };

const handleRegister = async (data) => {
  try {
    setLoading(true);
    setError(null);

    if (data.password !== data.password2) {
      setError("Пароли не совпадают");
      return;
    }

    const payload = {
      username: data.name,
      email: data.email,
      password: data.password,
    };

    const tokens = await register(payload);

    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);

    navigate("/");
  } catch (e) {
    setError("Ошибка регистрации");
  } finally {
    setLoading(false);
  }
};


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

      <Flex minH="100vh" display="flex" alignItems="center" justifyContent="center">
        {view === "welcome" && (
          <WelcomeCard onClick={() => setView("login")} />
        )}
        {view === "login" && (
          <LoginCard
            onClick={() => setView("register")}
            onSubmit={handleLogin}
            loading={loading}
          />
        )}
        {view === "register" && (
          <RegisterCard
            onClick={() => setView("login")}
            onSubmit={handleRegister}
            loading={loading}
          />
        )}
      </Flex>
    </Box>
  );
}
