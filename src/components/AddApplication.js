import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Button,
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  FormErrorMessage,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';

export default function AddApplication({
  userId,
  resumes,
  fetchAllApplications,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentResume, setCurrentResume] = React.useState({});

  function getResumeId(selected) {
    const resumeObj = resumes.filter((r) => r.res_name === selected);
    setCurrentResume(resumeObj[0]);
  }

  const resumeOptions = [];
  if (resumes) {
    resumes.forEach((current) => {
      resumeOptions.push(
        <option id={current.resume_id} key={current.resume_id}>
          {current.res_name}
        </option>
      );
    });
  }

  return (
    <>
      <Button onClick={onOpen}>Add Application</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Application</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              companyName: '',
              jobLink: '',
              techstack: '',
              resume: '',
            }}
            onSubmit={(values, actions) => {
              const { companyName, jobLink, techstack, resume } = values;
              fetch(`/dashboard/${userId}/application`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  companyName,
                  jobPostLink: jobLink,
                  techStack: techstack,
                  resumeId: currentResume.id,
                  status: 'Wishlist',
                  rating: 1,
                  comments: '',
                }),
              })
                .then((response) => {
                  if (response.ok) {
                    actions.setSubmitting(false);
                    onClose();
                    fetchAllApplications();
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          >
            {(props) => (
              <Form>
                <Field name='companyName'>
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <Input
                        {...field}
                        id='companyName'
                        placeholder='Company Name'
                      />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name='jobLink'>
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <Input
                        {...field}
                        id='jobLink'
                        placeholder='Link to job posting'
                      />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name='resume'>
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <Select
                        placeholder='Choose a resumé...'
                        id='resume'
                        onChange={(e) => getResumeId(e.target.value)}
                      >
                        {resumeOptions}
                      </Select>
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name='techstack'>
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <Textarea placeholder='Tech Stack' id='techstack' />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
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
    </>
  );
}
