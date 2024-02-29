const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const redis = require("redis");
const { createClient } = redis;
const createAdapter = require("@socket.io/redis-adapter").createAdapter;
const dotenv = require('dotenv');

const { userJoin, getCurrentuser, userLeave, getRoomUsers } = require('./utils/users');
const formatMessage = require('./utils/messages');

const bot = 'anaaa';





dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// set static folder 
app.use(express.static(path.join(__dirname, 'Chat')));


//redis connection set up
(async () => {
    pubClient = createClient({ url: "redis://127.0.0.1:6379" });
    await pubClient.connect();
    subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
})();









// run when client connects
io.on('connection', (socket) => {
    console.log(io.of("/").adapter);
    //event handling for join room
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage(bot, 'welcome a zebi'));
        //broadcast when a user connect without sending it to the user
        socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.username} joinet the chat`));
        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        // listen for chat message
        socket.on('ChatMessage', msg => {
            const user = getCurrentuser(socket.id)

            io.to(user.room).emit('message', formatMessage(user.username, msg));
        });
        // runs when the client disconnect
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);
            if (user) {
                io.to(user.room).emit('message',
                    formatMessage(user.username, `${user.username} left the chat`));
            }
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });



        });

    });

    // send to all even the user
    //io.emit();
});

const PORT = 3000 || process.env.PORT;
//starting the server and logs a message to the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 