import { VStack } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button'
import { Input, InputGroup,InputRightElement } from '@chakra-ui/input';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {baseUrl} from "../../url/BaseUrl";
const SignUp = () => {
    const [show, setShow] = useState(false);
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [confirmPassword,setConfirmPassword] = useState();
    const [pic,setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const handelOnClickShow = () => setShow(!show);
    const history = useHistory();

    const postDetails = (pics) => {
        setLoading(true);
        if( pics === undefined) {
            toast({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom",
              });
              return;
        }

        if( pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "satyamg");
            console.log(data.get("file"));
            fetch("https://api.cloudinary.com/v1_1/satyamg/image/upload" , {
                method: "post",
                body: data,
            }).then((res) => res.json())
            .then((result) => {
                console.log(result);
                setPic(result.url.toString());
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
        }
        else {
            toast({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom",
              });
              setLoading(false);
              return;

        }
    }

    const submitHandler = async() => {
        setLoading(true);
        if(!name || !email || !password || !confirmPassword) {
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
        if(password != confirmPassword) {
            toast({
                title: 'Password do not match',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom",
              });
              setLoading(false);
              return;
        }

        try {
            const config = {
                headers: {
                    "Content-type" : "application/json",
                }
            } 
            const {data} = await axios.post(
                `${baseUrl}/api/user`,
                {name,email,password,pic}, 
                config
            );  

            toast({
                title: 'Registation Successful',
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
                title: 'Registration failed',
                status: 'error',
                description: error.message,
                duration: 5000,
                isClosable: true,
                position:"bottom",
            });
            setLoading(false);
        }
    }

  return (
    <VStack spacing="5px">
        <FormControl id='first-name' isRequired>
            <FormLabel color={"#ECDFCC"}>Name</FormLabel>
            <Input
                placeholder='Enter your name'
                onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel color={"#ECDFCC"}>Email</FormLabel>
            <Input
                placeholder='Enter your email'
                onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel color={"#ECDFCC"}>Password</FormLabel>
            <InputGroup>
                <Input
                    type={show ? 'text': 'password'}
                    placeholder='Enter password'
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handelOnClickShow}>
                        { show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='cpassword' isRequired>
            <FormLabel color={"#ECDFCC"}>Confirm password</FormLabel>
            <InputGroup>
                <Input
                    type={show ? 'text': 'password'}
                    placeholder='Enter password'
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handelOnClickShow}>
                        { show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic' isRequired>
            <FormLabel color={"#ECDFCC"}>Profile Picture</FormLabel>
            <Input
                type='file'
                p={1.5}
                placeholder='Choose image'
                onChange={(e)=> postDetails(e.target.files[0])}
            />
        </FormControl>

        <Button
            colorScheme='blue'
            width="100%"
            style={{marginTop:15}}
            onClick={submitHandler}
            isLoading = {loading}
        >Sign Up</Button>
    </VStack>
  )
}

export default SignUp;
