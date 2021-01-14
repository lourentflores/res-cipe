import React from 'react';
import { Box, Image, Button, Center, useDisclosure } from '@chakra-ui/react';
import Login from '../Login';
import Signup from '../Signup';

export default function LoginContainer({ setState }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Center flexDirection="column">
      <Image src="/assets/rescipelogo.png" />
      <Box
        margin="1rem"
        padding="1rem"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
      >
        <Login setState={setState} />
      </Box>
      <Button onClick={onOpen}>Signup</Button>
      <Signup isOpen={isOpen} onClose={onClose} />
    </Center>
  );
}
