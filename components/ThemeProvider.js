import React, { createContext, useState, useContext } from "react";
import { Box, Switch } from "@chakra-ui/react";

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <Box bg={darkMode ? "gray.900" : "white"} color={darkMode ? "white" : "black"} minH="100vh">
        {children}
      </Box>
    </ThemeContext.Provider>
  );
};