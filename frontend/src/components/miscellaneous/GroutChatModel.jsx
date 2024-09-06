import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import {baseUrl} from "../../url/BaseUrl";

const GroutChatModel = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchresult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const { user, chats, setChats} = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if(!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers : {
                    authorization: `Bearer ${user.token}`,
                }
            }
            const {data} = await axios.get(`${baseUrl}/api/user?search=${search}`,config);
            setLoading(false);
            setSearchresult(data);
        } catch (error) {
            toast({
                title:"Error Occured",
                description:"Failed to load search results",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
            });
        }

    }
    const handleSubmit = async() => {
        if(!groupChatName || !selectedUsers) {
            toast({
                title:"Please fill all the fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            });
            return;
        }

        try {
            const config = {
                headers : {
                    authorization: `Bearer ${user.token}`,
                }
            };

            const {data} = await axios.post(`${baseUrl}/api/chat/group`,
                {
                    name:groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id))
                },
                config,
            );
            setChats([data, ...chats]);
            onClose();
            toast({
                title:"New Group created",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom"
            });
            
        } catch (error) {
            toast({
                title:"Failed to Create the Group",
                description: error.response,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            });
            
        }
    }
    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)) {
            toast({
                title:"User Already Exists",
                status:"warning",
                duration:5000,
                position:"top"
            });
            return;
        }
        
        setSelectedUsers([...selectedUsers,userToAdd]);
    }
    const handleDelete = (userToRemove) => {
        setSelectedUsers(selectedUsers.filter((selUser) => selUser._id !== userToRemove._id ));
    }
    return (
        <>
          <Button onClick={onOpen}>{ children }</Button>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize={"35px"}
                display={"flex"}
                justifyContent={"center"}
              >Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody
                display={"flex"}
                flexDir={"column"}
                alignItems={"center"}
              >
                <FormControl>
                    <Input 
                        placeholder='Enter Group Name'
                        mb={3}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <Input 
                        placeholder='Add Users'
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                <Box  
                    w={"100%"}
                    display={'flex'}
                    flexWrap={"wrap"}
                    >
                    {selectedUsers.map((u) => <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)}></UserBadgeItem> )}
                </Box>
                {/* render search result */}
                {loading ? <div>Loading ...</div> : (
                    searchResult?.slice(0,4).map((user) => <UserListItem key={user._id} user={user} handleFunction={()=> handleGroup(user)} />)
                )}
              </ModalBody> 
    
              <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                  Create Chat
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      );
    
}

export default GroutChatModel;