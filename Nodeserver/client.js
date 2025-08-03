const socket = io('http://localhost:8000');

let username = prompt("Enter your name to join");
if (!username || username.trim() === "") {
    username = "Guest";
}
socket.emit('New-User-Joined', username);

// DOM Elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

var audio = new Audio('../img/24645.mp3');

// Function to append message
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);

    if (position === 'left') {
        audio.play().catch(err => {
            console.log("Audio failed:", err);
        });
    }
};

// Send message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message === '') return;
    append(`You: ${message}`, 'right');
    socket.emit('Send', message);
    messageInput.value = '';
});

// When user joins
socket.on('User-Joined', name => {
    append(`${name} joined the chat`, 'right');
});

// When message is received
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// When user leaves
socket.on('left', name => {
    append(`${name} Left the chat`, 'right');
});
