import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { GrView } from 'react-icons/gr';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const {selectedChat, setSelectedChat, user} = ChatState();

    const handleRemove = async (userToRemove) => {
        if(selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id){
            toast({
                title:"Only admin can remove someone",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            });
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers:{
                    authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put(`${window.location.origin}/api/chat/groupremove`,{
                chatId: selectedChat._id,
                userId: userToRemove._id,
            },
            config);

            userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(true);

        } catch (error) {
            toast({
                title:"Error Occured",
                description: error.response,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
            });
            setLoading(false);
        }
    }
    
    const handleAddUser = async (userToAdd) => {
        if(selectedChat.users.find((u) => u._id === userToAdd._id)){
            toast({
                title:"User already in group",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            });
            return;
        }
        if(selectedChat.groupAdmin._id !==  user._id){
            toast({
                title:"Only admin can add to members to group",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers:{
                    authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put(`${window.location.origin}/api/chat/groupadd`,{
                chatId: selectedChat._id,
                userId: userToAdd._id,
            },
            config);
            console.log(data);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(true);


        } catch (error) {
            toast({
                title:"Error Occured",
                description: error.response,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
            });
            setLoading(false);
        }
    }

    const handleRename = async() => {
        if(!groupChatName) return;

        try {
            setRenameLoading(true);

            const config = {
                headers : {
                    authorization: `Bearer ${user.token}`,
                }
            }
            const {data} = await axios.put(`${window.location.origin}/api/chat/rename`,{
                chatId:selectedChat._id, 
                chatName:groupChatName,
            },
            config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);

        } catch (error) {
            toast({
                title:"Error Occured",
                description: error.response,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            });
            setRenameLoading(false);
            setGroupChatName("");
        }
    }

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
            const {data} = await axios.get(`${window.location.origin}/api/user?search=${search}`,config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
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
    return (
        <>
          <IconButton display={{base:"flex"}} icon={<GrView/>} onClick={onOpen}/>
    
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader fontSize={"38px"} display={"flex"} justifyContent={"center"}>{ selectedChat.chatName }</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box width={'100%'} display={"flex"} flexWrap={"wrap"} pb={3}>
                    {
                        selectedChat.users.map((u) => (
                            <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)}></UserBadgeItem>
                        ))
                    }
                </Box>
                <FormControl display={"flex"}>
                    <Input 
                        placeholder='Group Name'
                        mb={3}
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <Button
                        variant={"solid"}
                        colorScheme='teal'
                        ml={1}
                        isLoading={renameLoading}
                        onClick={handleRename}
                    >
                        Update
                    </Button>
                </FormControl>
                <FormControl>
                    <Input 
                        placeholder='Add Users'
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                {loading ? <div>Loading ...</div> : (
                    searchResult?.slice(0,4).map((user) => <UserListItem key={user._id} user={user} handleFunction={()=> handleAddUser(user)} />)
                )}
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
                    Leave Group
                </Button>
            </ModalFooter>
            </ModalContent>
      </Modal>
        </>
      );
}

export default UpdateGroupChatModel
