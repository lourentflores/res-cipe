import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormErrorMessage,
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
} from '@chakra-ui/react';

export default function Signup({ isOpen, onClose }) {
  const [showPass, setShow] = useState(false);
  const [showConf, setConf] = useState(false);
  const clickPass = () => setShow(!showPass);
  const clickConf = () => setConf(!showConf);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Signup</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            email: '',
            username: '',
            firstName: '',
            lastName: '',
            password: '',
            passwordMatch: '',
          }}
          validate={(values) => {
            const errors = {};
            const {
              email,
              username,
              firstName,
              lastName,
              password,
              passwordMatch,
            } = values;

            if (!email) {
              errors.email = 'Required';
            } else if (email.length < 4 || email.length > 100) {
              errors.email =
                'Email address must be between 4-100 characters long, please try again';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
            ) {
              errors.email = 'Invalid email address';
            }

            if (!username) {
              errors.username = 'Required';
            } else if (username.length < 4 || username.length > 15) {
              errors.username = 'Username must be between 4-15 characters long';
            } else if (!username.match(/^[A-Za-z0-9_-]+$/)) {
              errors.username =
                'Username can only contain letters, numbers, or underscores';
            }

            if (!firstName) errors.firstName = 'Required';

            if (!lastName) errors.lastName = 'Required';

            if (!password) {
              errors.password = 'Required';
            } else if (password.length < 8 || password.length > 100) {
              errors.password =
                'Password must be between 8-100 characters long';
            } else if (
              // !password.match(
              // /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$/
              // )
              !password.match(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/
              )
            ) {
              errors.password =
                'Must include one lowercase character, one uppercase character, a number, and a special character';
            }

            if (!passwordMatch) errors.passwordMatch = 'Required';

            if (passwordMatch !== password)
              errors.passwordMatch = 'Passwords do not match';

            return errors;
          }}
          onSubmit={(values, actions) => {
            const {
              email,
              username,
              firstName,
              lastName,
              password,
              passwordMatch,
            } = values;
            // double check the endpoint, make sure the fetch request is built proper
            fetch('/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username,
                password,
                email,
                firstName,
                lastName,
                passwordMatch,
              }),
            })
              .then((response) => {
                if (response.ok) {
                  actions.setSubmitting(false);
                  onClose();
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          {(props) => (
            <Form>
              <Field name='username'>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.username && form.touched.username}
                  >
                    <FormLabel htmlFor='username'>Username</FormLabel>
                    <Input
                      {...field}
                      id='username'
                      placeholder='4 to 15 characters'
                      required='true'
                    />
                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='email'>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.email && form.touched.email}
                  >
                    <FormLabel htmlFor='email'>Email Address</FormLabel>
                    <Input
                      {...field}
                      id='email'
                      placeholder='email'
                      required='true'
                    />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='firstName'>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.firstName && form.touched.firstName}
                  >
                    <FormLabel htmlFor='firstName'>First Name</FormLabel>
                    <Input
                      {...field}
                      id='firstName'
                      placeholder='required'
                      required='true'
                    />
                    <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='lastName'>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.lastName && form.touched.lastName}
                  >
                    <FormLabel htmlFor='lastName'>Last Name</FormLabel>
                    <Input {...field} id='lastName' placeholder='required' />
                    <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='password'>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.password && form.touched.password}
                  >
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        id='password'
                        required='true'
                        type={showPass ? 'text' : 'password'}
                        placeholder='must include one lowercase character, one uppercase character, a number, and a special character'
                      />
                      <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={clickPass}>
                          {showPass ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='passwordMatch'>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.passwordMatch && form.touched.passwordMatch
                    }
                  >
                    <FormLabel htmlFor='passwordMatch'>
                      Confirm Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        id='passwordMatch'
                        required='true'
                        type={showConf ? 'text' : 'password'}
                        placeholder='Make sure she matches!'
                      />
                      <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={clickConf}>
                          {showConf ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {form.errors.passwordMatch}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={4}
                colorScheme='teal'
                isLoading={props.isSubmitting}
                type='submit'
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
