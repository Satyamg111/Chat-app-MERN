import React, { useEffect } from "react";
import { Container, Box, Text,Tab,Tabs, TabList, TabPanels,TabPanel, Image } from "@chakra-ui/react";
import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'
import { useHistory } from "react-router-dom";

const Homepage = () => {
  const history = useHistory();

  useEffect( () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if(user) {
      history.push('/chats');
    }
  },[history]);
  return (
    <Container  maxW="100%" display={"flex"} flexDir={"row"} >
      <Box w={"100%"} display={"flex"} alignItems={"center"}>
        <Image marginLeft={30} w={"70%"} borderRadius={"100%"} src="./chat-img.jpg"></Image>
      </Box>
      <Box w={"100%"} p={10}>

        
        <Box
          d="flex"
          justifyContent="center"
          p={3}
          bg={"#3C3D37"}
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <center><Image w={150} src='/logo.png' alt='logo'/></center>
          {/* <Text align="center" fontWeight={"600"}>Connectify Chat-app</Text> */}
        </Box>
        <Box bg={"#3C3D37"} w="100%" p={4} borderRadius="lg" borderWidth="1px">
          <Tabs variant="soft-rounded">
            <TabList mb="1em">
              <Tab w="50%" color={"#ECDFCC"}>Login</Tab>
              <Tab w="50%" color={"#ECDFCC"}>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login></Login>
              </TabPanel>
              <TabPanel>
                <SignUp></SignUp>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        </Box>
    </Container>
  );
};

export default Homepage;
