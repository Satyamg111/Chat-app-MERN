import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  return (
    <div>
      <Stack>
            <Skeleton h={"45px"}/>
            <Skeleton h={"45px"}/>
            <Skeleton h={"45px"}/>
            <Skeleton h={"45px"}/>
            <Skeleton h={"45px"}/>
            <Skeleton h={"45px"}/>
            <Skeleton h={"45px"}/>
            <Skeleton h={"45px"}/>
            <Skeleton h={"45px"}/>
      </Stack>
    </div>
  )
}

export default ChatLoading
