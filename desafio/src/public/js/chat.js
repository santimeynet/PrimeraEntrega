const socket = io();

const messageForm = document.getElementById('message-form');
const userInput = document.getElementById('user-input');
const messageInput = document.getElementById('message-input');
const messageList = document.getElementById('message-list');

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const user = userInput.value.trim();
  const message = messageInput.value.trim();

  if (user && message) {

    socket.emit('chatMessage', { user, message });
    messageInput.value = '';
  }
});


socket.on('chatMessage', (data) => {
  const messageItem = document.createElement('li');
  messageItem.textContent = `${data.user}: ${data.message}`;
  messageList.appendChild(messageItem);
});