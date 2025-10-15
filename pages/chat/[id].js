import { ArrowRightIcon } from "@chakra-ui/icons"
import { Avatar, Flex, Heading, IconButton, Input, Button, Text, FormControl, useToast, useColorModeValue } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar"
import Head from "next/head"
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth"
import { auth, db } from "../../firebaseconfig"
import { useRouter } from "next/router"
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query, doc, addDoc, serverTimestamp } from "firebase/firestore"
import getOtherEmail from "../../utils/getOtherEmail";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../components/ThemeProvider";

const Topbar = ({username}) => {
    const toast = useToast();
  const router = useRouter();
  const { themeColors } = useTheme();
    return (
        <Flex align = "center" w = "100%" h = "81px" p = {3} borderBottom = "1px solid" borderColor = {themeColors.topbarBorder} shadow = "base" bg={themeColors.sidebarBg}>
            <Avatar src = "" marginEnd = {3}/>
            <Heading size = "md" flex = {1}>{username}</Heading>
            <Button bg = {themeColors.newChatButtonBg} color = {themeColors.newChatButtonColor} 
            marginEnd = "2" p = {4} shadow = "xl"
            _hover = {{bg: themeColors.newChatButtonHover, cursor: "pointer"}} 
            onClick  = { async () => {
                 console.log('Before redirect'); 
                 router.push('/');
                await signOut(auth);   
                console.log('After redirect');
            toast({status: 'success', title: 'Signed Out!', duration: 3000, isClosable: true, position: 'top-right'})
           
        }}>
               Sign Out
            </Button>
        </Flex>
    )
}

const Bottombar = ({id, user}) => {
    const [input, setInput] = useState("");
    const { themeColors } = useTheme();
    const sendMessage = async(e) => {
        e.preventDefault();
        if(input.length > 0) {
            await addDoc(collection(db, `chats/${id}/messages`), {
                text: input,
                sender: user.email,
                timestamp: serverTimestamp()
            })
            setInput("");
        }
    }

    return (
        <FormControl display = "flex" borderTop = "1px solid" borderTopColor = {themeColors.topbarBorder} p = {3} onSubmit = {sendMessage} as = "form" shadow = "base" bg={themeColors.sidebarBg}>
            <Input placeholder = "Type a message..." marginEnd = {3} autoComplete = "off" shadow = "xl"
            onChange={e => setInput(e.target.value)} value = {input} bgColor = {themeColors.background} color={themeColors.text} />
            <IconButton icon = {<ArrowRightIcon/>} shadow = "xl" size = "md" color = "white" type = "submit" bgColor = "#1E293B" _hover = {{bgColor: "none", color: "none", cursor: "pointer"}}/>
        </FormControl>
    )
}

export default function Chat () {
    const scrollToLatestChat = useRef();
    const [user] = useAuthState(auth);

    const router = useRouter();
    const { id } = router.query;

    const q = query(collection(db, `chats/${id}/messages`), orderBy('timestamp'));
    const [messages] = useCollectionData(q);
    const [chat] = useDocumentData(doc(db, "chats", id));
    
    const { darkMode, themeColors } = useTheme();

    const getMessages = () => messages?.map(msg => {
        const sender = msg.sender === user.email;

        return (
            <Flex key = {Math.random()} shadow = {sender ? "lg" : "xl"} alignSelf = {sender ? "flex-start" : "flex-end"} bg = {sender ? themeColors.messageSenderBg : themeColors.messageReceiverBg} borderRadius = "lg" w = "fit-content" minWidth = "50px" p = {3} m = {1} color = {sender ? themeColors.text : "white"}>
                <Text>{msg.text}</Text>
            </Flex>
        )       
    })

    useEffect(() => {
        setTimeout(() => {
            scrollToLatestChat.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            })
        }, 100)
    }, [messages])

    return (
        <Flex h = "100vh">
            <Head>
                <title>Comms</title>
            </Head>
            <Sidebar/>
            <Flex flex = {1} direction = "column" onClick={() => getMessages()} bgColor = {themeColors.background}>
                <Topbar username = {getOtherEmail(chat?.users, user)}/>
                <Flex flex = {1} direction = "column" pt = {4} px = {4}  overflowY = "auto" sx = {{scrollbarWidth: "none"}}>
                    {getMessages()}
                    <div ref = {scrollToLatestChat}></div>
                </Flex>
                <Bottombar id = {id} user = {user}/>
            </Flex>
        </Flex>
    )
}