import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box, Button, Stack, useToast,Text } from '@chakra-ui/react';
import { IoIosAdd } from "react-icons/io";
import ChatLoading from './ChatLoading'
import {getSender} from '../config/ChatLogics'
import GroutChatModel from './miscellaneous/GroutChatModel';
import axios from 'axios';

const MyChats = ({ fetchAgain }) => {
    const [ loggedUser, setLoggedUser] =  useState();
    const { user, selectedChat,setSelectedChat, chats, setChats } = ChatState();
    // console.log(user);
    const toast = useToast();
    
    const fetchChats = async() => {
        try {
            const config = {
                headers : {
                    authorization: `Bearer ${user.token}`,
                }
            };
            const  {data}  = await axios.get(`${window.location.origin}/api/chat`, config);
            setChats(data);
            // console.log(data);
    
        } catch (error) {
            toast({
                title: 'Error occurred',
                description: "Failed to load chats",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:'bottom-left'
              });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    },[fetchAgain]);

  return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md:"flex"} }
            flexDir={"column"}
            alignItems={"center"}
            p={3}
            bg={"white"}
            w={{base:"100%", md:"31%"}}
            borderRadius={"lg"}
            borderWidth={"1px"}
        >
            <Box 
                pb={3}
                px={3}
                fontSize={{ base:"28px" , md:"30px"}}
                display={"flex"}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >My Chats
            <GroutChatModel>
              <Button
                display={"flex"}
                fontSize={{base:"17px" , md:"10px" , lg:"17px"}}
                rightIcon={<IoIosAdd />}
                >
                New Group Chat
              </Button>
            </GroutChatModel>
            </Box>

            <Box
                display={"flex"}
                flexDir={"cloumn"}
                p={3}
                bg={"F8F8F8"}
                w={"100%"}
                h={"100%"}
                borderRadius={"lg"}
                overflowY={"hidden"}
            >
                { chats ? (
                    <Stack width={"100%"} overflowY={"scroll"}>
                        {
                            chats.map((chat) => (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    cursor={"pointer"}
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius={"lg"}
                                    key={chat._id}
                                >
                                    <Text>
                                        {!chat.isGroupChat ? (getSender(loggedUser, chat.users)) : (chat.chatName)}
                                    </Text>
                                </Box>
                            ))
                        }
                    </Stack>
                ) : (
                    <ChatLoading></ChatLoading>
                )}
            </Box>
        </Box>
  )
}

export default MyChats;
