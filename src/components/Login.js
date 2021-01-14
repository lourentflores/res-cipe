import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Box,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormErrorMessage,
  useDisclosure,
} from '@chakra-ui/react';
import Signup from './Signup';

export default function Login({ setState }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPass, setShow] = useState(false);
  const clickPass = () => setShow(!showPass);

  return (
    <Box>
      <Formik
        initialValues={{ username: '', password: '' }}
        validate={(values) => {
          const errors = {};
          const { username, password } = values;

          if (!username) {
            errors.username = 'Please enter your username';
          }

          if (!password) {
            errors.password = 'Please enter your password';
          }

          return errors;
        }}
        onSubmit={(values, actions) => {
          const { username, password } = values;
          fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username,
              password,
            }),
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              throw new Error(`${response.status} ${response.statusText}`);
            })
            .then((data) => {
              if (data.userId) {
                actions.setSubmitting(false);
                setState({ userId: data.userId, isLoggedIn: true });
              }
            })
            .catch((err) => console.log(err));
        }}
      >
        {(props) => (
          <Form>
            <Field name="username">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.username && form.touched.username}
                >
                  <Input
                    {...field}
                    id="username"
                    placeholder="Username"
                    required
                  />
                  <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="password">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.password && form.touched.password}
                >
                  <InputGroup>
                    <Input
                      {...field}
                      id="password"
                      required
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={clickPass}>
                        {showPass ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
      <Button onClick={onOpen}>Signup</Button>
      <Signup isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
