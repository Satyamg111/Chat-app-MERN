const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const app = express();
const {chats} = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config()
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req,res) => {
    res.send("App runnig successfully")
})

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);



app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
const server = app.listen(PORT,()=>console.log(`running on ${PORT}...`));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors:{
        origin: ["https://chat-app-mern-chi.vercel.app","http://localhost:5173"],
    }
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("Room : " ,room);
    });

    socket.on('typing',(room) => socket.in(room).emit('typing'));
    socket.on('stop typing',(room) => socket.in(room).emit('stop typing'));
    
    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if(!chat.users) return console.log("chat.users not found");

        chat.users.forEach((user) => {
            if(user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message recieved',newMessageRecieved);
        });
    })

    socket.off('setup', () => {
        console.log("User Disconnectd");
        socket.leave(userData._id);
    })
})
