const socket = io();

const loginForm = document.getElementById('welcome-form');
const messageSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName = '';

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('join', ({name}) => addMessage('Chat Bot', `${name} has joined the conversation!`));
socket.on('remove', ({name}) => addMessage('Chat Bot', `${name} has left the conversation!:(`));
socket.emit('message', { author: 'John Doe', content: 'Lorem Ipsum' });


loginForm.addEventListener('submit', function login(event){
    event.preventDefault();
    if (!userNameInput.value){
        alert('Your login is required')
    } else {
        userName = userNameInput.value;
        loginForm.classList.remove('show');
        messageSection.classList.add('show');
        socket.emit('join', {name: userName, id: socket.id});
    }
});


function addMessage(author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName) {
        message.classList.add('message--self')};
    if(author === 'Chat Bot') {
        message.classList.add('botmsg')};
    message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author }</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
  };


addMessageForm.addEventListener('submit', function sendMessage (event){
    event.preventDefault();
    let messageContent = messageContentInput.value;
    if (!messageContentInput.value) {
        alert('Message is required')
    } else {
        addMessage(userName, messageContent);
        socket.emit('message', { author: userName, content: messageContent })
        messageContentInput.value = '';
    }
});

