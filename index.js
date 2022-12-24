//Node server which will handle socket to connections
const path=require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port=process.env.PORT || 3000;
app.use('/images',express.static(__dirname+'/images'));
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});
//list for storing the names of the users
const users={};
//Opening a connection on socket server
io.on("connection", (socket)=>{
    console.log('a user connected');
    //Handling new user joining and emitting it to the clients
    socket.on("new-user-joined",name=>{
        console.log("New user",name);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });
   //Handling message sent by any user and emitting it to the clients
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]});
    });
    //Handling user leaving and deleting it from the list
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
});
//Opening the http server and listeing to the port
server.listen(port,()=>{
    console.log('listening to*;3000');
});

