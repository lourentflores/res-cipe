import React from 'react';
import {
  Code,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';

export default function Metrics({ applications }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const resumeData = {};

  function percentEval(success, total) {
    return Math.round((success / total) * 10000) / 100;
  }

  applications.forEach((app) => {
    const { res_name, status } = app;

    if (!resumeData[res_name]) {
      resumeData[res_name] = { success: 0, failure: 0, total: 0 };
    }
    if (status === 'Applied' || status === 'Rejected')
      resumeData[res_name].failure++;
    else if (status !== 'Wishlist') resumeData[res_name].success++;

    if (status !== 'Wishlist') resumeData[res_name].total++;
  });

  const resMetrics = [];
  const workingResumes = Object.keys(resumeData);
  workingResumes.forEach((resume) => {
    const { success, total } = resumeData[resume];
    const percent = percentEval(success, total);
    resMetrics.push(
      <Tr key={resume}>
        <Td>{resume}</Td>
        <Td isNumeric>{percent}%</Td>
      </Tr>
    );
  });

  return (
    <>
      <Button onClick={onOpen}>Metrics</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Metrics</ModalHeader>
          <ModalCloseButton />
          <Table variant='striped' colorScheme='purple'>
            <TableCaption>
              **Interview requests+ vs submitted applications
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Resume Used</Th>
                <Th isNumeric>Success Rate</Th>
              </Tr>
            </Thead>
            <Tbody>{resMetrics}</Tbody>
          </Table>
        </ModalContent>
      </Modal>
    </>
  );
}
