import React from 'react';
import { Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';

export default function Tags({ content }) {
  return (
    <Tag
      size='md'
      key={content}
      borderRadius='full'
      variant='solid'
      colorScheme='green'
    >
      <TagLabel>{content}</TagLabel>
      <TagCloseButton />
    </Tag>
  );
}
