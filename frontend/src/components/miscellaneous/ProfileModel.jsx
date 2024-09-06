import { Box, Button, FormControl, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { GrView } from "react-icons/gr";
import React, { useState } from 'react'
import axios from 'axios';
import { baseUrl } from '../../url/BaseUrl';
import { CiEdit } from 'react-icons/ci';

const ProfileModel = ({ user,isLoggedUser, children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editNameInput, setEditNameInput] = useState(false);
    const [userName,setUserName] = useState("");
    const [newProfilePic,setNewProfilePic] = useState("");
    const [imageLoading,setImageLoading] = useState(false);
    const [openProfilPicModel,setOpenProfilPicModel] = useState(false);
    const toast = useToast();
   

    const handleOpenProfilePic = () => {
        setOpenProfilPicModel(true);
        onClose()
    }
    const handleCloseProfilePic = () => {
        setOpenProfilPicModel(false);
    }
    const postDetails = (pics) => {
        setImageLoading(true);
        if( pics === undefined) {
            toast({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom",
              });
              setImageLoading(false);
              return;
        }

        if( pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "satyamg");
            fetch("https://api.cloudinary.com/v1_1/satyamg/image/upload" , {
                method: "post",
                body: data,
            }).then((res) => res.json())
            .then((result) => {
                setNewProfilePic(result.url.toString());
            })
            .catch((err) => {
                console.log(err);
            })
            console.log(newProfilePic);
            setImageLoading(false);
        }
        else {
            toast({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom",
              });
              setImageLoading(false);
              return;

        }
    }
    const handleUpdateProfilePic = async() => {
        try {

            const config = {
                headers : {
                    authorization: `Bearer ${user.token}`,
                }
            };
            console.log(newProfilePic)
            const {data} = await axios.post(`${baseUrl}/api/user/update`,
                {
                    userId:user._id, 
                    pic:newProfilePic,
                },config);
            
            user.pic = data.pic;
            localStorage.setItem("userInfo", JSON.stringify(user));
            setNewProfilePic("");
            handleCloseProfilePic();
            toast({
                title: 'Profile Picture Updated',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              });
            
        } catch (error) {
            toast({
                title: 'Error occurred!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              });
        }
    }
    const onClickEditName = async() => {
        try {
            const config = {
                headers : {
                    authorization: `Bearer ${user.token}`,
                }
            };
            const {data} = await axios.post(`${baseUrl}/api/user/update`,
                {
                    userId:user._id, 
                    name:userName,
                },config);
            user.name = data.name;
            localStorage.setItem("userInfo", JSON.stringify(user));
            setEditNameInput(false);
            setUserName("");
            toast({
                title: 'Name Updated',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              });
            
        } catch (error) {
            toast({
                title: 'Error occurred!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:'bottom'
              });
            setEditNameInput(false);
        }
        
    }
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
            <ModalContent h={"450px"} >
                <Box width={'100%'} display={'flex'} flexDir={'row'} justifyContent={"center"} alignItems={'center'}>

                    <Text 
                        fontSize={"36px"} 
                        display={"flex"} 
                        fontWeight={'600'}
                        align={'center'}
                        >
                            {user.name}
                    </Text>
                    {isLoggedUser && 
                        <Button colorScheme='blue' w={'30px'} h={'40px'} 
                        p={0} borderRadius={50} m={'20px '}
                        onClick={() => setEditNameInput(true)}>
                            <CiEdit />
                        </Button>
                    }
                    
                </Box>
                <ModalCloseButton />
                
                {editNameInput ?  (<FormControl display={'flex'} flexDir={'row'} pl={5} pr={5}>
                    <Input 
                        placeholder='Enter name'
                        
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <Button
                        variant={"solid"}
                        colorScheme='teal'
                        ml={1}
                        // isLoading={renameLoading}
                        onClick={onClickEditName}
                    >
                        Update
                    </Button>
                </FormControl>):<></> }
               
                <ModalBody 
                    display={"flex"}
                    flexDir={"column"}
                    alignSelf={'center'}
                    justifyContent={"center"}
                >
                    <Image
                        borderRadius={"full"}
                        boxSize={"180px"}
                        objectFit={"cover"}
                        src={user.pic}
                        alt={user.name}
                        display={"block"}
                        ml={"auto"}
                        mr={"auto"}
                        onClick={handleOpenProfilePic}
                    />
                    <Text mt={5} fontSize={{base:"24px", md:"32px"} } >{user.email}</Text>
                </ModalBody>

                {/* <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter> */}
            </ModalContent>
        </Modal>
        <Modal 
            size={"lg"} 
            isOpen={openProfilPicModel} 
            onClose={handleCloseProfilePic} 
            isCentered>
                        <ModalOverlay/>
                        
                        <ModalContent h={600} display={'flex'}
                                flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
                                
                            <Text fontSize={28} fontWeight={600}
                                
                            >Profile Picture</Text>
                            <Image
                                    boxSize={"400px"}
                                    objectFit={"cover"}
                                    src={user.pic}
                                    alt={user.name}
                                    display={'block'}
                                    ml={"auto"}
                                    mr={"auto"}
                            />
                            {isLoggedUser && 
                                <FormControl display={'flex'} flexDir={'row'} p={5}>
                                    <Input
                                        mb={1}
                                        type='file'
                                        placeholder='Select Image'
                                        onChange={(e) => postDetails(e.target.files[0])}
                                    />
                                    <Button
                                        variant={"solid"}
                                        colorScheme='teal'
                                        ml={1}
                                        onClick={handleUpdateProfilePic}
                                        disabled={imageLoading}
                                    >
                                        Update
                                    </Button>
                                </FormControl>
                            }
                            <ModalCloseButton />
                        </ModalContent>
                        
                        <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={handleCloseProfilePic}>
                            Close
                        </Button>
                    </ModalFooter>
                    </Modal>
    </div>
  )
}

export default ProfileModel
