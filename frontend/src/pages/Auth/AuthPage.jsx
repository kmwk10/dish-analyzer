import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

import WelcomeCard from "./WelcomeCard";
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";

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
      <Flex minH="100vh" display="flex" alignItems="center" justifyContent="center">
        {view === "welcome" && (
          <WelcomeCard onClick={() => setView("login")} />
        )}
        {view === "login" && (
          <LoginCard onClick={() => setView("register")}/>
        )}
        {view === "register" && (
          <RegisterCard onClick={() => setView("login")}/>
        )}
      </Flex>
    </Box>
  );
}
