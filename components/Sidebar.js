import React, { useState } from "react"
// import { CloseIcon } from "@chakra-ui/icons"
import { Avatar, Button, Flex, Text, useDisclosure, Switch, Box } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "../firebaseconfig";
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc } from "firebase/firestore";
import getOtherEmail from "../utils/getOtherEmail";
import {useRouter} from "next/router";
import DialogBox from "./DialogBox.js";
import { useTheme } from "./ThemeProvider";

const Sidebar = () => {
    const [user] = useAuthState(auth);
    const [snapshot] = useCollection(collection(db, 'chats'));
    const chats = snapshot?.docs.map(doc => ({id: doc.id, ...doc.data()}));
    const router = useRouter();
    const { isOpen, onClose, onOpen } = useDisclosure();
    
    // State for sidebar collapse
    const [isCollapsed, setIsCollapsed] = useState(false);
    // Use theme from context instead of local state
    const { darkMode, toggleTheme } = useTheme();

    const redirect = (id) => {
        router.push(`/chat/${id}`);
    }

    const chatList = () => {
        return (
            chats?.filter(chat => chat.users.includes(user.email))
            .map ( 
                chat => 
                    <Flex key = {Math.random()} align = "center" p = {3} _hover = {{bg: darkMode ? "gray.700" : "gray.200", cursor: "pointer"}} 
                    onClick = {() => redirect(chat.id)}>
                        <Avatar src = "" marginEnd = {3} size={isCollapsed ? "sm" : "md"}/>
                        {!isCollapsed && <Text>{getOtherEmail(chat.users, user)}</Text>}
                    </Flex>
            )
        )
    }

    const chatAlreadyExists = (email) => chats?.find(chat => chat.users.includes(email) && chat.users.includes(user.email));

    const newChat = async(input) => {
        if(!chatAlreadyExists(input) && (input != user.email) && (input != null)) {
            await addDoc(collection(db, 'chats'), {users: [user.email, input]});
        }
    }

    return (
        <>
        {<DialogBox isOpen={isOpen} onClose={onClose} newChat={newChat}/>}
        <motion.div
            initial={false}
            animate={{ width: isCollapsed ? "80px" : "330px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
        <Flex 
        h = "100vh"
        borderEnd = "1px solid"
        borderColor = {darkMode ? "gray.700" : "gray.300"}
        direction = "column"
        className = "sidebar"
        bg={darkMode ? "gray.900" : "white"}
        color={darkMode ? "white" : "black"}
        >
            <Flex 
            w = "100%" h = "81px" 
            justifyContent = "space-between" 
            align = "center" p = {3} 
            >
                <Flex align = "center">
                    <Avatar src = {user.photoURL} marginEnd = {isCollapsed ? 0 : 3} size={isCollapsed ? "sm" : "md"}/>
                    {!isCollapsed && <Text fontSize = "lg">{user.displayName}</Text>}
                </Flex>
                <Flex align="center" gap={2}>
                    <Button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        variant="ghost"
                        size="sm"
                        mr={2}
                    >
                        {isCollapsed ? "☰" : "✕"}
                    </Button>
                    <Switch
                        isChecked={darkMode}
                        onChange={toggleTheme}
                        colorScheme="blue"
                        size="sm"
                    />
                </Flex>
            </Flex>

            {!isCollapsed && (
                <Button bg = {darkMode ? "blue.500" : "blue.100"} color = {darkMode ? "white" : "blue.900"} m = {5} p = {4} _hover = {{bg: darkMode ? "blue.600" : "blue.200", cursor: "pointer"}}
                onClick = {() => onOpen()}>
                    New Chat
                </Button>
            )}

            <Flex overflowY = "auto" direction = "column" sx = {{scrollbarWidth: "none"}} flex = {1}>
                {chatList()}
            </Flex>
        </Flex>
        </motion.div>
        </>
    )
}

export default Sidebar