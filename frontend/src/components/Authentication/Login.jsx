import { VStack } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button'
import { Input, InputGroup,InputRightElement } from '@chakra-ui/input';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const Login = () => {
    const [show, setShow] = useState(false);
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const history = useHistory();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const handelOnClickShow = () => setShow(!show);

    const submitHandler = async() => {
        setLoading(true);
        if(!email || !password) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom",
              });
              setLoading(false);
              return;
        }
        try {
            console.log(window.location.origin);
            const config = {
                headers: {
                    "Content-type" : "application/json",
                }
            } 
            const {data} = await axios.post(
                // "http://localhost:5000/api/user/login",
                `${window.location.origin}/api/user/login`,
                {email,password}, 
                config
            );  

            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:"bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");
        } 
        catch (error) {
            toast({
                title: 'Login failed',
                description: error.response.data.message,
                status: 'failure',
                duration: 5000,
                isClosable: true,
                position:"bottom",
              });
              setLoading(false);
        }
    }
    return (
        <VStack spacing="5px">
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text': 'password'}
                        placeholder='Enter password'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handelOnClickShow}>
                            { show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme='blue'
                width="100%"
                style={{marginTop:15}}
                onClick={submitHandler}
                isLoading = {loading}
            >Login</Button>
            <Button
                variant="solid"
                colorScheme='red'
                width="100%"
                style={{marginTop:15}}
                onClick={()=>{
                    setEmail("guest@example.com")
                    setPassword("123456")
                }}
            >Get Guest User Credientials</Button>
        </VStack>
      )
}

export default Login;
