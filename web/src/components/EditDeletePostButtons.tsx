import { Button, IconButton } from "@chakra-ui/core";
import {
  Box,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import router from "next/router";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (meData?.me?.id !== creatorId) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this post? This action is
            irreversible
          </ModalBody>

          <ModalFooter>
            <Button
              variantColor="red"
              onClick={() => {
                deletePost({ id });
                router.push("/");
              }}
            >
              Yes, delete it
            </Button>
            <Button ml={3} onClick={onClose}>
              No, take me back
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box>
        <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
          <IconButton as={Link} aria-label="edit post" icon="edit" />
        </NextLink>

        <IconButton
          aria-label="delete post"
          icon="delete"
          ml={2}
          onClick={() => {
            onOpen();
            console.log("Event Fired 🚀");
          }}
        />
      </Box>
    </>
  );
};
