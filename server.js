const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
    res.render('index');
  });

let messages = [];
let users = [];

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
  });

const io = socket(server);

io.on('connection', (socket) => {
    socket.on('join', user => {
        console.log('New user arrived! Welcome-' + socket.id);
        users.push(user);
        socket.broadcast.emit('join', user);
    })
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
      });
    socket.on('disconnect', () => { 
        console.log('Oh, socket ' + socket.id + ' has left');
        const removeUser = users.find(user => user.id == socket.id);
        users = users.filter(user => user.id !== socket.id);
        socket.broadcast.emit('remove', removeUser);
        });
      
  });

