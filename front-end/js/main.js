const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const chatform = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userlist = document.getElementById('users');


const {username , room} = qs.parse(location.search, {
    ignoreQueryPrefix:true,
});
socket.emit('joinRoom',{username,room})

//get room and users
socket.on('roomUsers', ({room, users})=> {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down 
    chatMessages.scrollTop = chatMessages.scrollHeight;

});
 
//message submit
chatform.addEventListener('submit', (e) => {
    e.preventDefault();
    //get message text 
    const msg = e.target.elements.msg.value;
    msg= msg.trim();
    if (!msg){
        return false;
    }

   socket.emit('ChatMessage',msg);
   //clear input
   e.target.elements.msg.value='';
   e.target.elements.msg.focus();
});

//output message to dom
function oututMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}
function outputRoomName(room){
    roomName.innertext = room;

}
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }
  document.getElementById('leave-btn').addEventListener('click', () => {
    
   
      window.location = '../index.html';
   
    
  });