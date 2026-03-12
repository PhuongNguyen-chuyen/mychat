const socket = io();

let currentChatUser = null;
let currentGroup = null;
let currentUser = JSON.parse(localStorage.getItem("user"));

/* =========================
OPEN PRIVATE CHAT
========================= */
function openChat(userId, username){

currentGroup = null;
currentChatUser = userId;

document.querySelector(".chat-header").innerText =
"Chat with " + username;

loadMessages();

}

/* =========================
OPEN GROUP CHAT
========================= */
function openGroupChat(groupId, groupName){

currentChatUser = null;
currentGroup = groupId;

document.querySelector(".chat-header").innerText =
"Group: " + groupName;

loadGroupMessages();

}

/* =========================
LOAD PRIVATE MESSAGES
========================= */
function loadMessages(){

if(!currentChatUser) return;

fetch(`/api/chat/${currentUser.id}/${currentChatUser}`)
.then(res => res.json())
.then(data => {

const box = document.getElementById("messages");
box.innerHTML = "";

data.forEach(m => {

addMessage(
m.sender_id == currentUser.id ? "You" : m.username,
m.message,
m.id,
m.sender_id
);

});

box.scrollTop = box.scrollHeight;

});

}

/* =========================
LOAD GROUP MESSAGES
========================= */
function loadGroupMessages(){

if(!currentGroup) return;

fetch(`/api/chat/group/${currentGroup}`)
.then(res => res.json())
.then(data => {

const box = document.getElementById("messages");
box.innerHTML = "";

data.forEach(m => {

addMessage(
m.sender_id == currentUser.id ? "You" : m.username,
m.message,
m.id,
m.sender_id
);

});

box.scrollTop = box.scrollHeight;

});

}

/* =========================
SEND MESSAGE
========================= */
function sendMsg(){

const input = document.getElementById("msgInput");
const msg = input.value.trim();

if(!msg) return;

/* PRIVATE CHAT */
if(currentChatUser){

fetch("/api/chat/send",{

method:"POST",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({
sender_id:currentUser.id,
receiver_id:currentChatUser,
message:msg
})

})
.then(()=>{

socket.emit("sendMessage",{
sender_id:currentUser.id,
receiver_id:currentChatUser
});

input.value="";
loadMessages();

});

}

/* GROUP CHAT */
else if(currentGroup){

fetch("/api/chat/group/send",{

method:"POST",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({
sender_id:currentUser.id,
group_id:currentGroup,
message:msg
})

})
.then(()=>{

socket.emit("sendGroupMessage",{
group_id:currentGroup
});

input.value="";
loadGroupMessages();

});

}

else{
alert("Please select a friend or group first");
}

}

/* =========================
RECEIVE PRIVATE MESSAGE
========================= */
socket.on("receiveMessage",(data)=>{

if(!currentChatUser) return;

if(
data.sender_id == currentChatUser ||
data.receiver_id == currentUser.id
){
loadMessages();
}

});

/* =========================
RECEIVE GROUP MESSAGE
========================= */
socket.on("receiveGroupMessage",(data)=>{

if(currentGroup == data.group_id){
loadGroupMessages();
}

});
/* =========================
SHOW MESSAGE
========================= */
function addMessage(user,msg,id,sender){

const box = document.getElementById("messages");

let menu = "";

/* chỉ tin nhắn của mình mới có menu */
if(sender == currentUser.id){

menu = `
<div class="msg-menu">

<span class="menu-icon" onclick="toggleMenu(${id});event.stopPropagation()">⋮</span>

<div class="menu-actions" id="menu-${id}">
<button onclick="editMsg(${id})">Edit</button>
<button onclick="deleteMsg(${id})">Delete</button>
</div>

</div>
`;

}

box.innerHTML += `

<div class="msg">
<div class="msg-text">
<b>${user}:</b> ${msg}
</div>

${menu}

</div>

`;

}

/* =========================
SHOW / HIDE MENU
========================= */
function toggleMenu(id){

const menu = document.getElementById("menu-"+id);

if(menu.style.display === "block"){
menu.style.display = "none";
}else{
menu.style.display = "block";
}

}

/* =========================
EDIT MESSAGE
========================= */
function editMsg(id){

const text = prompt("Edit message");

if(!text) return;

fetch("/api/chat/"+id,{
method:"PUT",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({
message:text,
user_id:currentUser.id
})

}).then(()=>{

if(currentGroup){
loadGroupMessages();
}else{
loadMessages();
}

});

}

/* =========================
DELETE MESSAGE
========================= */
function deleteMsg(id){

if(!confirm("Delete this message?")) return;

fetch("/api/chat/"+id+"?user_id="+currentUser.id,{
method:"DELETE"
}).then(()=>{

if(currentGroup){
loadGroupMessages();
}else{
loadMessages();
}

});

}

/* =========================
VIEW GROUP MEMBERS
========================= */
function viewGroupMembers(){

if(!currentGroup) return;

fetch("/api/groups/members/"+currentGroup)
.then(res=>res.json())
.then(data=>{

let list="Members:\n\n";

data.forEach(u=>{
list += u.username + "\n";
});

alert(list);

});

}