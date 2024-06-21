import { Box, CloseButton, flexbox } from '@chakra-ui/react'
import React from 'react'
import { IoMdCloseCircleOutline } from 'react-icons/io';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
      <Box
          px={2}
          py={1}
          borderRadius={"lg"}
          m={1}
          mb={2}
          variant={"solid"}
          fontSize={12}
          backgroundColor={"purple"}
          color={"white"}
          cursor={"pointer"}
          onClick={handleFunction}
      >{user.name}
      <IoMdCloseCircleOutline/>
      </Box>
  )
}

export default UserBadgeItem;
