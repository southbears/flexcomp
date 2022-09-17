import { Button, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { FC } from 'react';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

export const SaveModal: FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Offer saved!</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <Text>
            Are you interested in testing this in your own business to help candidates understand your offer? We have integrations with Gusto and Rippling, or can be used independently. Click the button below or email southbears@proton.me
          </Text>
        </ModalBody>

        <ModalFooter>
          <Link href='mailto:southbears@proton.me'>
            <Button colorScheme='blue' mr={3} variant='solid'>
              {`I'm Interested`}
            </Button>
          </Link>
          <Button onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
