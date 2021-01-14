import React from 'react';
import {
  Box,
  Image,
  Badge,
  Link,
  IconButton,
  FormControl,
  FormLabel,
  Select,
  Flex,
  Spacer,
  Heading,
} from '@chakra-ui/react';
import { StarIcon, DeleteIcon } from '@chakra-ui/icons';

export default function ApplicationCard(props) {
  const [rating, setRating] = React.useState(props.rating);
  const [status, setStatus] = React.useState(props.status);

  function updateApplication(update, value) {
    let updateString = '';
    if (update.rating) updateString = `/dashboard/${props.userId}/rating`;
    else if (update.status) updateString = `/dashboard/${props.userId}/status`;
    fetch(updateString, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    })
      .then((response) => {
        if (response.ok) {
          if (update.rating) setRating(update.rating);
          else if (update.status) setStatus(update.status);
          // Added this back in to make metrics work properly, not terribly efficient, but a workaround for now
          props.fetchAllApplications();
        }
      })
      .catch((error) => console.log(error));
  }

  function deleteApplication() {
    fetch(`/dashboard/${props.userId}/application`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: props.id }),
    }).then((response) => {
      if (response.ok) {
        props.fetchAllApplications();
      }
    });
  }

  return (
    <Box bg="gray.50" boxShadow="base" maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      {/* <Image src={props.imageUrl} alt={props.imageAlt} /> */}

      <Box p='6' padding='1rem' flexDirection='row' minWidth="300px">
        <Flex
          mt='1'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          isTruncated
          d='flex'
        >
          <Heading padding='5px'>{props.company}</Heading>
          <Spacer />
          <IconButton
            icon={<DeleteIcon />}
            background='none'
            key={`delete${props.id}`}
            onClick={() => deleteApplication()}
          />
        </Flex>

        <Flex>
          <Box padding='5px' flexDirection='column'>
            <Link href={props.link} isExternal>
              Original Listing
            </Link>
          </Box>
          <Spacer />
          <Box d='flex' alignItems='baseline'>
            <Badge borderRadius='full' px='2' colorScheme='purple'>
              {props.resumeLabel}
            </Badge>
          </Box>
        </Flex>

        <FormControl id='status'>
          <Select
            size='sm'
            value={status}
            onChange={(e) => {
              updateApplication({ status: e.target.value, id: props.id });
            }}
          >
            <option disabled>{status}</option>
            <option>Wishlist</option>
            <option>Applied</option>
            <option>Interview Scheduled</option>
            <option>Interview</option>
            <option>Take Home</option>
            <option>Offer</option>
            <option>Offer Declined</option>
            <option>Rejected</option>
          </Select>
        </FormControl>

        <Box d='flex' mt='2' alignItems='center'>
          {Array(5)
            .fill('')
            .map((_, i) => (
              <IconButton
                key={`star${i}`}
                color={i < rating ? 'purple.500' : 'gray.300'}
                background='none'
                size='sm'
                icon={<StarIcon />}
                onClick={() => {
                  updateApplication({ rating: i + 1, id: props.id });
                }}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
}
