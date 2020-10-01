const chatRoom = document.getElementById('chatRoom');
const sendMessage = document.getElementById('sendMessage');
const currentUser = document.getElementById('currentUser');
const otherUser = document.getElementById('otherUser');
const message = document.getElementById('message');
const output = document.getElementById("output");
const status = document.getElementById("status");
const status1 = document.getElementById("status1");

output.scrollTop = output.scrollHeight;

var socket = io();

socket.emit('joinRoom', {
    chatRoom: chatRoom.value,
    user: currentUser.value
})

sendMessage.addEventListener('click', (e) => {
    e.preventDefault();

    socket.emit('userMessage', {
        from: currentUser.value,
        to: otherUser.value,
        message: message.value,
        chatRoom: chatRoom.value
    });
    
    //Clear Input
    message.value = '';
    message.focus();
})

socket.on('onstatus', (on) => {
    if(on.id !== currentUser.value){
        status.innerHTML = on.online;
        status1.innerHTML = on.online;
        status.style.color = 'green';
        status1.style.color = 'green';
    }
})

socket.on('offstatus', (off) => {
    status.innerHTML = off;
    status1.innerHTML = off;
    status.style.color = '#333333';
    status1.style.color = '#333333';
})

socket.on('userMessage', (data) => {
    const div = document.createElement('div');
    if(currentUser.value !== data.from_uid){
        div.className = 'message-chat chat-away'
    }else{
        div.className = 'message-chat chat-home'
    }
    div.innerHTML = `
    <p>${data.message}</p>
    <small>${data.time}</small>
    `;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
})