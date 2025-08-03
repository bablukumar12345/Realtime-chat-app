const io = require("socket.io")(8000, {
    cors: {
        origin: "*",
    }
});

const users = {};

io.on("connection", socket => {
    socket.on('New-User-Joined', name => {
        console.log('New user:', name);
        users[socket.id] = name;
        socket.broadcast.emit('User-Joined', name);
    });

    socket.on('Send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        console.log("User disconnected:", username);
        if (username) {
            socket.broadcast.emit('left', username);
            delete users[socket.id];
        }
    });
});
