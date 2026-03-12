const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// =======================
// DATABASE CONNECTION
// =======================
const db = mysql.createConnection({
host:"127.0.0.1",
user:"root",
password:"",
database:"mychat",
port:3300
});

db.connect(err=>{
if(err){
console.log("❌ MySQL connection error:",err);
}else{
console.log("✅ MySQL connected");
}
});


// =======================
// GET GROUP MESSAGES
// =======================
router.get("/group/:groupId",(req,res)=>{

const groupId = req.params.groupId;

db.query(
`SELECT messages.*, users.username, users.avatar
FROM messages
JOIN users ON messages.sender_id = users.id
WHERE messages.group_id=?
ORDER BY messages.id ASC`,
[groupId],
(err,result)=>{

if(err){
console.log("GET GROUP MSG ERROR:",err);
return res.status(500).json(err);
}

res.json(result);

});

});


// =======================
// SEND GROUP MESSAGE
// =======================
router.post("/group/send",(req,res)=>{

const {sender_id,group_id,message} = req.body;

if(!sender_id || !group_id || !message){
return res.status(400).json({error:"Missing data"});
}

db.query(
"INSERT INTO messages(sender_id,group_id,message) VALUES (?,?,?)",
[sender_id,group_id,message],
(err,result)=>{

if(err){
console.log("SEND GROUP MSG ERROR:",err);
return res.status(500).json(err);
}

res.json({
status:"sent",
id:result.insertId
});

});

});


// =======================
// GET CHAT BETWEEN 2 USERS
// =======================
router.get("/:user1/:user2",(req,res)=>{

const {user1,user2} = req.params;

db.query(
`SELECT messages.*, users.username, users.avatar
FROM messages
JOIN users ON messages.sender_id = users.id
WHERE (sender_id=? AND receiver_id=?)
OR (sender_id=? AND receiver_id=?)
ORDER BY messages.id ASC`,
[user1,user2,user2,user1],
(err,result)=>{

if(err){
console.log("GET PRIVATE MSG ERROR:",err);
return res.status(500).json(err);
}

res.json(result);

});

});


// =======================
// SEND PRIVATE MESSAGE
// =======================
router.post("/send",(req,res)=>{

const {sender_id,receiver_id,message} = req.body;

if(!sender_id || !receiver_id || !message){
return res.status(400).json({error:"Missing data"});
}

db.query(
"INSERT INTO messages(sender_id,receiver_id,message) VALUES (?,?,?)",
[sender_id,receiver_id,message],
(err,result)=>{

if(err){
console.log("SEND PRIVATE MSG ERROR:",err);
return res.status(500).json(err);
}

res.json({
status:"sent",
id:result.insertId
});

});

});


// =======================
// EDIT MESSAGE
// =======================
router.put("/:id",(req,res)=>{

const {message,user_id} = req.body;

db.query(
"UPDATE messages SET message=? WHERE id=? AND sender_id=?",
[message,req.params.id,user_id],
(err,result)=>{

if(err){
console.log("EDIT MSG ERROR:",err);
return res.status(500).json(err);
}

res.json({status:"updated"});

});

});


// =======================
// DELETE MESSAGE
// =======================
router.delete("/:id",(req,res)=>{
    const user_id = req.query.user_id;

db.query(
"DELETE FROM messages WHERE id=? AND sender_id=?",
[req.params.id,user_id],
(err,result)=>{

if(err){
console.log("DELETE MSG ERROR:",err);
return res.status(500).json(err);
}

res.json({status:"deleted"});

});

});

module.exports = router;