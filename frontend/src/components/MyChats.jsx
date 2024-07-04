import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box, Button, Stack, useToast,Text, Image } from '@chakra-ui/react';
import { IoIosAdd } from "react-icons/io";
import ChatLoading from './ChatLoading'
import {getSender} from '../config/ChatLogics'
import {getSenderImage} from '../config/ChatLogics'
import GroutChatModel from './miscellaneous/GroutChatModel';
import axios from 'axios';
import {baseUrl} from "../url/BaseUrl";

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
            const  {data}  = await axios.get(`${baseUrl}/api/chat`, config);
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
                fontSize={{ base:"20px" , md:"24px",lg:"28px"}}
                fontWeight={"500"}
                display={"flex"}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >Chats
            <GroutChatModel display={"flex"}>
              <Button
                fontSize={{base:"17px" , md:"12px" , lg:"17px"}}
                rightIcon={<IoIosAdd />}
                >
                Create Group
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
                                    display={"flex"}
                                    cursor={"pointer"}
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    fontWeight={"600"}
                                    px={3}
                                    py={2}
                                    borderRadius={"lg"}
                                    key={chat._id}
                                >
                                    <Image
                                        borderRadius={"full"}
                                        boxSize={"30px"}
                                        src={getSenderImage(loggedUser, chat.users)}
                                        alt={getSender(loggedUser, chat.users)}
                                    />
                                    <Text textAlign={"center"} ml={3}>
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
