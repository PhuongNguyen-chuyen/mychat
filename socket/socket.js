const db=require("../config/database");

module.exports=(io)=>{

io.on("connection",(socket)=>{

socket.on("send_message",(data)=>{

db.query(
"INSERT INTO messages(sender_id,receiver_id,message) VALUES(?,?,?)",
[data.sender,data.receiver,data.message]
);

io.emit("receive_message",data);

});

});

};