import { ChatIcon } from "@chakra-ui/icons"
import { Box, Button, Center, Stack, useToast, Flex, Text, Switch } from "@chakra-ui/react"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"
import Head from "next/head"
import { auth } from "../firebaseconfig"
import { useState } from "react"

const Login = () => {
    const toast = useToast();
    const [signInWithGoogle] = useSignInWithGoogle(auth);
    
    // State for theme toggle
    const [darkMode, setDarkMode] = useState(true);

    return (
        <>
        <Head>
            <title>Login to Comms</title>
        </Head>
        <div className = "area" style={{backgroundColor: darkMode ? "#1E293B" : "#B9D0EC"}} >
            <ul className = "circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div >
        <Center h = "100vh" bgColor = {darkMode ? "#1E293B" : "#B9D0EC"}>
            <Flex flexDirection = "column">
                <Text className = "headerText" align = "center" color={darkMode ? "white" : "black"}>Comms</Text>
                <Stack
                align = "center"
                bgColor = {darkMode ? "#1E293B" : "#FFFFFF"}
                p = {20}
                spacing = {20}
                marginBottom = {10}
                boxShadow = "xl"
                rounded = "xl"
                >
                    <Box 
                    bgColor = {darkMode ? "#1E293B" : "#FFFFFF"}
                    w = "fit-content"
                    p = {6}
                    rounded = "3xl"
                    boxShadow = "md"
                    >
                        <ChatIcon w = "100px" h = "100px" color = {darkMode ? "white" : "black"} />
                    </Box>
                    <Button boxShadow = "md" onClick={() => {signInWithGoogle("", {prompt: "select_account"}, toast({title: 'Login in process...', status: 'info', duration: 8000, isClosable: true, position: 'bottom-left'}))}} bg = {darkMode ? "#FFFFFF" : "#1E293B"} color = {darkMode ? "#1E293B" : "#FFFFFF"} _hover = {{bg: darkMode ? "#F5F5F5" : "#333333", cursor: "pointer"}}>
                        Sign in with Google
                    </Button>
                </Stack>
            </Flex>
        </Center>
        <Flex position="absolute" top="20px" right="20px" alignItems="center" gap={2}>
            <Switch
                isChecked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                colorScheme="blue"
                size="sm"
            />
            <Text fontSize="sm" color={darkMode ? "white" : "black"}>{darkMode ? "Dark" : "Light"} Mode</Text>
        </Flex>
        </>
    )
}

export default Login