import React, { useEffect, useRef, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, IconButton, Spinner, Text, FormControl, Input, useToast } from '@chakra-ui/react';
import { IoArrowBackOutline } from "react-icons/io5";
import { MdEmojiEmotions } from "react-icons/md";
import { IoDocumentAttach } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import EmojiPicker from 'emoji-picker-react';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModel  from '../components/miscellaneous/ProfileModel';
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel';
import ScrollableChat from './ScrollableChat'
import axios from 'axios';
import './styles.css';
import io from "socket.io-client";
import {baseUrl} from "../url/BaseUrl";

import "../assets/css/chat-loading.css"

const ENDPOINT = `${baseUrl}`;
var socket,selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messageRef =  useRef('')
  const [socketConnected,setSocketConnected] = useState(false);
  const [typing,setTyping] = useState(false);
  const [isTyping,setIsTyping] = useState(false);
  const {user, selectedChat, setSelectedChat } = ChatState();

  const [emojiPicker, setEmojipicker] = useState(false);
  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup",user);
    socket.on('connected',() => setSocketConnected(true));
    socket.on('typing',()=>setIsTyping(true));
    socket.on('stop typing',()=>setIsTyping(false));
  },[])
  const fetchMessages = async() => {
    if(!selectedChat) return;
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const {data} = await axios.get(`${baseUrl}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit('join chat',selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error occurred!',
        description: "Failed to send messages",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      });
    }
  }
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  },[selectedChat]);

  useEffect(() => {
    socket.on('message recieved', (newMessageReceived) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        //give notifiacation
      }
      else {
        setMessages([...messages,newMessageReceived]);
      }
    })
  });

  const sendMessage = async(e) => {

    if(e.key === "Enter" && newMessage) {
      socket.emit('stop typing',selectedChat._id);
      try {
        const config = {
          headers: {
            "Conter-type" : "application/json",
            authorization: `Bearer ${user.token}`,
          },
        };
        setLoading(true);
        setNewMessage("");
        const {data} = await axios.post(`${baseUrl}/api/message`,
          {
            content: newMessage,
            chatId:selectedChat._id,
          },
          config
        );
        setLoading(false);
        setEmojipicker(false);
        socket.emit('new message',data);
        setMessages([...messages,data]);
      } catch (error) {
        setEmojipicker(false);
        toast({
          title: 'Error occurred!',
          description: "Failed to send messages",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        });
      }
    }
  }

  const onEmojiClick = (e) => {
    const emoji = e.emoji;
    const newMsg = messageRef.current.value + emoji;
    setNewMessage(newMsg)
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // typing incidactor logic

    if(!socketConnected) return;

    if(!typing) {
      setTyping(true);
      socket.emit('typing',selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if(timeDiff >= timerLength && typing){
        socket.emit('stop typing',selectedChat._id);
        setTyping(false);
      }
    })

  }
  return (
    <>
    { selectedChat ? (
            <>
            <Text
              fontSize={{ base: "28px", md:"30px" }}
              pb={3}
              px={2}
              w={"100%"}
              display={"flex"}
              color={"#ECDFCC"}
              justifyContent={{base:"space-between"}}
              alignItems={"center"}
            >
              <IconButton 
                display={{base:"flex", md:"none"} } 
                icon={ <IoArrowBackOutline /> } 
                onClick={() => setSelectedChat("")}
              />
              { !selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModel user={getSenderFull(user, selectedChat.users)}
                                isLoggedUser={false}
                        />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  {
                    <UpdateGroupChatModel 
                      fetchAgain={fetchAgain} 
                      setFetchAgain={setFetchAgain} 
                      fetchMessages={fetchMessages}
                    />
                  }
                </>
              )}
            </Text>
            <Box
              display={"flex"}
              flexDir={"column"}
              justifyContent={"flex-end"}
              p={3}
              bg={"#3C3D37"}
              w={"100%"}
              h={"100%"}
              borderRadius={"lg"}
              overflowY={"hidden"}
            >
              {loading ? (
                <Spinner
                  size={'xl'}
                  w={20}
                  h={20}
                  alignSelf={'center'}
                  margin={'auto'}
                />
              ):(
                <div className='messages'>
                  <ScrollableChat messages={messages}/>
                </div>
              )}
              {isTyping ? 
                    <div className="typing">
                      <div className="typing__dot"></div>
                      <div className="typing__dot"></div>
                      <div className="typing__dot"></div>
                  </div>
                 : <></>}
                 { emojiPicker ? (<EmojiPicker onEmojiClick={ onEmojiClick}  width={'100%'} height={'1000'}/>) : (<></>)}
              <FormControl 
                  onKeyDown={sendMessage} 
                  mt={3} 
                  display={'flex'} 
                  alignItems={"center"}
                  position={'relative'}
                  isRequired>
                    
                 { !emojiPicker ? 
                    (<MdEmojiEmotions color='#ECDFCC' size={"30px"} onClick={() => setEmojipicker(!emojiPicker)}/>) 
                      : 
                    (<GiCancel color='#ECDFCC' size={"30px"} onClick={() => setEmojipicker(!emojiPicker)} />)}
                 
                  <Input
                    varient={'filled'}
                    bg={"E0E0E0"}
                    placeholder="Enter text here"
                    ref={messageRef}
                    onChange = {typingHandler}
                    value={newMessage}
                    onFocus={() => setEmojipicker(!emojiPicker)}
                    ml={1}
                  />  

                  {/* file sharing block */}
                  <IoDocumentAttach color='#ECDFCC'  size={"30px"} />
              </FormControl>
            </Box>
            </>

        ):(
            <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                h={"100%"}
            >
              <Text fontSize={'3xl'} pb={3} >
                 Click on a user to start chatting
              </Text>
            </Box>
        )
    }
    </>
  )
}

export default SingleChat
