import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import { GrView } from "react-icons/gr";
import React from 'react'

const ProfileModel = ({ user, children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <div>
        {children ? (
            <span onClick={onOpen}>{children}</span>
            ) : 
            (
                <IconButton
                    display={{ base: "flex"}}
                    icon={<GrView />}
                    onClick={onOpen}
                />
            )
        }

        <Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent h={"410px"} >
                <ModalHeader fontSize={"40px"} display={"flex"} justifyContent={"center"}>{user.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody 
                    display={"flex"}
                    flexDir={"column"}
                    alignSelf={'center'}
                    justifyContent={"space-between"}
                >
                    <Image
                        borderRadius={"full"}
                        boxSize={"150px"}
                        src={user.pic}
                        alt={user.name}
                    />
                    <Text fontSize={{base:"24px", md:"38px"}} >Email: {user.email}</Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
  )
}

export default ProfileModel
