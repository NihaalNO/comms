import React, { createContext, useState, useContext } from "react";
import { Box } from "@chakra-ui/react";

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Define theme colors based on dark mode
  const themeColors = {
    background: darkMode ? "gray.900" : "white",
    text: darkMode ? "white" : "black",
    sidebarBg: darkMode ? "gray.900" : "white",
    sidebarBorder: darkMode ? "gray.700" : "gray.300",
    sidebarHover: darkMode ? "gray.700" : "gray.200",
    topbarBorder: darkMode ? "gray.700" : "gray.300",
    messageSenderBg: darkMode ? "gray.700" : "gray.100",
    messageReceiverBg: darkMode ? "blue.500" : "blue.100",
    newChatButtonBg: darkMode ? "blue.500" : "blue.100",
    newChatButtonColor: darkMode ? "white" : "blue.900",
    newChatButtonHover: darkMode ? "blue.600" : "blue.200"
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, themeColors }}>
      <Box 
        bg={themeColors.background} 
        color={themeColors.text} 
        minH="100vh"
      >
        {children}
      </Box>
    </ThemeContext.Provider>
  );
};