import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  Switch,
  Box,
  Flex
} from "@chakra-ui/react";
import { useState } from "react";


function DialogBox({isOpen, onClose, newChat}) {
  
  // State for theme toggle
  const [darkMode, setDarkMode] = useState(true);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={darkMode ? "gray.800" : "white"} color={darkMode ? "white" : "black"} border="1px solid" borderColor={darkMode ? "gray.700" : "gray.300"} >
          <ModalHeader>
            <Flex justifyContent="space-between" alignItems="center">
              <ModalCloseButton />
              <Switch
                isChecked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                colorScheme="blue"
                size="sm"
              />
            </Flex>
          </ModalHeader>

          <ModalBody>
            <form
              id="email-form"
              onSubmit={async (e) => {
                e.preventDefault();
                if(e.target[0].value !== "") {
                    await newChat(e.target[0].value);
                    onClose();
                }
              }}
            >
              <FormControl>
                <FormLabel>Enter email of the recipient</FormLabel>
                <Input type="email" bg={darkMode ? "gray.700" : "white"} color={darkMode ? "white" : "black"} border="1px solid" borderColor={darkMode ? "gray.600" : "gray.300"} />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" form="email-form" bg = {darkMode ? "blue.500" : "blue.100"} color = {darkMode ? "white" : "blue.900"} _hover = {{bg: darkMode ? "blue.600" : "blue.200", cursor: "pointer"}}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default DialogBox;