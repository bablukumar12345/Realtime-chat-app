// const io = require("socket.io")(8000, {
//     cors: {
//         origin: "*",
//     }
// });

// const users = {};

// io.on("connection", socket => {
//     socket.on('New-User-Joined', name => {
//         console.log('New user:', name);
//         users[socket.id] = name;
//         socket.broadcast.emit('User-Joined', name);
//     });

//     socket.on('Send', message => {
//         socket.broadcast.emit('receive', {
//             message: message,
//             name: users[socket.id]
//         });
//     });

//     socket.on('disconnect', () => {
//         const username = users[socket.id];
//         console.log("User disconnected:", username);
//         if (username) {
//             socket.broadcast.emit('left', username);
//             delete users[socket.id];
//         }
//     });
// });




const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
});
const path = require("path");

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve index.html on "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
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

http.listen(8000, () => {
    console.log("Server running on port 8000");
});
