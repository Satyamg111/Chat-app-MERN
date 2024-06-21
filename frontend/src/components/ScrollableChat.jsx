import React from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin } from '../config/ChatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';
import ScrollableFeed from 'react-scrollable-feed';
import {ChatState} from '../context/ChatProvider'

const ScrolableChat = ({messages}) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages && messages.map((m,i) => (
        <div style={{display:'flex'}} key={m._id}>
          {
            (isSameSender(messages,m,i,user._id) ||
            isLastMessage(messages,i,user._id)) &&
            (
              <Tooltip
                label={m.sender.name}
                placement={'bottom-start'}
                hasArrow
              >
                <Avatar
                  mt={'7px'}
                  mr={1}
                  size={'sm'}
                  cursor={'pointer'}
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span style={{
              backgroundColor:`${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
              borderRadius:"20px",
              marginTop:"2px",
              padding:"5px 15px",
              maxWidth:"75%",
              marginLeft: isSameSenderMargin(messages,m,i,user._id),
              
            }}>
              {m.content}
            </span>
        </div>
      ))}
    </ScrollableFeed>
  );
}

export default ScrolableChat;
