import React from 'react';
import { Button, useDisclosure, VStack } from '@chakra-ui/react';
import AddApplication from './AddApplication';
import AddResume from './AddResume';
import ApplicationCard from './ApplicationCard';
import Metrics from './Metrics';
import {Grid, GridItem, Image, Heading, Stack, Center} from '@chakra-ui/react';

export default function Dashboard({ userId }) {
  const [applications, setApplications] = React.useState([]);
  const [resumes, setResumes] = React.useState([]);

  React.useEffect(() => {
    fetchAllApplications();
    fetchAllResumes();
  }, []);

  function fetchAllApplications() {
    fetch(`/dashboard/${userId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`${response.status} ${response.statusText}`);
      })
      .then((data) => {
        setApplications(data);
      })
      .catch((error) => console.log(error));
  }

  function fetchAllResumes() {
    fetch(`/dashboard/${userId}/allresumes`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`${response.status} ${response.statusText}`);
      })
      .then((data) => {
        setResumes(data);
      })
      .catch((error) => console.log(error));
  }

  const applicationCards = [];

  if (applications) {
    applications.forEach((app, index) => {
      const {
        company_name,
        job_post_link,
        resume_id,
        res_name,
        status,
        rating,
        id,
      } = app;
      applicationCards.push(
        <ApplicationCard
          key={id}
          id={id}
          userId={userId}
          company={company_name}
          link={job_post_link}
          rating={rating}
          resumeLabel={res_name}
          status={status}
          fetchAllApplications={fetchAllApplications}
        />
      );
    });
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Center>
      <Heading mt="2">
        <Image id="logo" src="../../assets/rescipelogo.png" alt="Rescipe Logo" htmlWidth={1000}/>
      </Heading>
      </Center>
      <Grid h="auto" templateColumns="repeat(5, 1fr)" gap={4}>
        <GridItem rowSpan="auto" bg="gray.100">
          <Stack direction="column">
          <AddApplication
            userId={userId}
            resumes={resumes}
            fetchAllApplications={fetchAllApplications}
          />
          <Button onClick={onOpen}>Add Resume</Button>
          <AddResume
            userId={userId}
            isOpen={isOpen}
            onClose={onClose}
            fetchAllResumes={fetchAllResumes}
          />
          <Metrics
            applications={applications}
            fetchAllApplications={fetchAllApplications}
          />
          </Stack>
        </GridItem>
        <GridItem rowSpan={2} colSpan={1} >
          <Stack direction={"row"} spacing={8}>
          {applicationCards}
          </Stack>
        </GridItem>
      </Grid>
    </div>
  );
}
