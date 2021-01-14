import React, { useState } from 'react';
import Dropzone from 'react-dropzone-uploader';
import {
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  Input,
} from '@chakra-ui/react';

// preview component for Dropzone
const Preview = ({ meta }) => {
  const { name, percent, status } = meta;
  return (
    <span
      style={{
        alignSelf: 'flex-start',
        margin: '10px 3%',
        fontFamily: 'Helvetica',
      }}
    >
      {name}, {Math.round(percent)}%, {status}
    </span>
  );
};

export default function AddResume({
  isOpen,
  onClose,
  userId,
  fetchAllResumes,
}) {
  // state for resume label
  const [resumeLabel, setResumeLabel] = useState('');

  // upload parameters
  const getUploadParams = ({ file, meta }) => {
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', 'resume');
    return {
      url: 'https://api.cloudinary.com/v1_1/res-cipe/auto/upload',
      body,
    };
  };

  // handles submit for only the file upload, triggered if upload is successful
  const handleSubmit = (files, allFiles) => {
    let { url } = JSON.parse(files[0].xhr.response);
    // because of cloudinary security restrictions, we cannot serve pdf files directly
    // instead, change the extension of the file being requested and cloudinary will
    // automatically transform the pdf file to an image on the fly
    url = url.replace(/\.pdf/, '.png');

    fetch(`/dashboard/${userId}/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resName: resumeLabel, link: url }),
    })
      .then((response) => {
        // clean up
        if (response.ok) {
          // remove all the finals from the dropzone after upload
          allFiles.forEach((f) => f.remove());
          // fetch new resumes
          fetchAllResumes();
          // closes modal
          onClose();
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Resume</ModalHeader>
        <ModalCloseButton />
        <FormControl id='resume-nickname' isRequired>
          <Input
            onChange={(e) => setResumeLabel(e.target.value)}
            placeholder='Resume Nickname'
          />
        </FormControl>

        <Dropzone
          getUploadParams={getUploadParams}
          onSubmit={handleSubmit}
          PreviewComponent={Preview}
          inputContent='Drop Files'
          disabled={(files) =>
            files.some((f) =>
              ['preparing', 'getting_upload_params', 'uploading'].includes(
                f.meta.status
              )
            )
          }
        />
      </ModalContent>
    </Modal>
  );
}
