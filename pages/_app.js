import { ChakraProvider, Center, Spinner } from "@chakra-ui/react"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebaseconfig";
import Login from "../components/Login";
import '../styles/globals.scss';
import { ThemeProvider } from "../components/ThemeProvider";

function MyApp({ Component, pageProps }) {
  const [user, loading, error] = useAuthState(auth);

  if(loading) {
    return (
      <ChakraProvider>
        <ThemeProvider>
          <Center h = "100vh">
            <Spinner size = "xl" />
          </Center>
        </ThemeProvider>
      </ChakraProvider>
    )
  }

  if(!user) {
    return (
      <ChakraProvider>
        <ThemeProvider>
          <Login />
        </ThemeProvider>
      </ChakraProvider>
    )
  }

  return (
    <ChakraProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </ChakraProvider>
  )
}

export default MyApp