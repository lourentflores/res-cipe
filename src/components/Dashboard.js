import React from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import AddApplication from './AddApplication';
import AddResume from './AddResume';
import ApplicationCard from './ApplicationCard';
import Metrics from './Metrics';

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
      {applicationCards}

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
    </div>
  );
}
