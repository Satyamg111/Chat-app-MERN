import { Avatar, Box, Button, Icon, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react';
import {useDisclosure} from '@chakra-ui/hooks'
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react'
import { FaBell, FaChevronCircleDown, FaRegBell, FaSearch } from "react-icons/fa";
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import ProfileModel from '../miscellaneous/ProfileModel';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../../components/ChatLoading';
import UserListItem from '../userAvatar/UserListItem';
import {baseUrl} from "../../url/BaseUrl";

const SideDrawer = () => {
    const [search , setSearch] = useState("");
    const [searchResult , setSearchResult] = useState([]);
    const [loading , setLoading] = useState(false);
    const [loadingChat , setLoadingChat] = useState();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user, setSelectedChat, chats, setChats } = ChatState();
    const history = useHistory();
    const toast = useToast();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    }

    const handleSearch = async() => {
        if(!search) {
            toast({
                title: 'Please Enter name or email',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'top-left'
              });
              return;
        }
        try {
            setLoading(true);
            const config = {
                headers : {
                    authorization: `Bearer ${user.token}`,
                }
            };
            const {data} = await axios.get(`${baseUrl}/api/user?search=${search}`,config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Error occured',
                description:"Failed to load search result",
                status: 'error', 
                duration: 5000,
                isClosable: true, 
                position:'bottom-left'
              });
        }
    };

    const accessChat = async ( userId ) => {
        try {
            setLoadingChat(true);
            const config = {
                headers : {
                    "Content-type": "application/json",
                    authorization: `Bearer ${user.token}`,
                }
            };
            // search result gives us user Id to access the chat 
            // but we are searching in chats 
            const { data } = await axios.post(`${baseUrl}/api/chat`, {userId}, config);
            chats.find((chat) => console.log(chat._id, "===", data._id));
            if(!chats.find((c) => c._id === data._id) )  setChats([data, ...chats]);
                
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: 'Error fetching chats',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:'bottom-left'
              });
        }
    }


  return ( 

    <>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        bg={"white"}
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Search user" hasArrow placement='bottom-end'>
            <Button variant={"ghost"} onClick={onOpen}>
                {/* {SeachIcon} */}
                <Icon as={FaSearch} />
                <Text display={{base:"none", md:"flex"}} px={4}>Search user</Text>
            </Button>
        </Tooltip>

        <Text fontSize={"28px"} fontWeight={"600"}>My Chat App</Text>
        <div>
            <Menu>
                <MenuButton p={1}>
                    <Icon as={FaBell} fontSize={'2xl'} m={1}/>
                </MenuButton>
                {/* <MenuList></MenuList> */}
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<FaChevronCircleDown/>}>
                    <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic}/>
                </MenuButton>
                <MenuList>
                    <ProfileModel user={user}>
                        <MenuItem>My Profile</MenuItem>
                    </ProfileModel>
                    <MenuDivider/> 
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth={"1px"}>Search user</DrawerHeader>
            <DrawerBody>
                <Box display={"flex"} pb={2}>
                    <Input
                        placeholder='Search by name or email'
                        mr={2}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={ handleSearch} > <Icon as={FaSearch} /> </Button>
                    {/* <Button onClick={handleSearch} > Go </Button> */}
                </Box>
                {loading ? 
                    (<ChatLoading/>) :
                    (   
                        searchResult.length > 0 ? 
                        searchResult?.map((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => accessChat(user._id)}
                            />
                        )) :  <Text textAlign={"center"} fontWeight={"600"}>Not Found</Text>
                    )
                }
                {loadingChat && <Spinner ml={"auto"} display={"flex"} /> }
            </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer
