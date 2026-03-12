const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const db = mysql.createConnection({
host:"127.0.0.1",
user:"root",
password:"",
database:"mychat",
port:3300
});


/* =====================
CREATE GROUP
===================== */

router.post("/",(req,res)=>{

const {name,owner_id} = req.body;

db.query(
"INSERT INTO groups (name,owner_id) VALUES (?,?)",
[name,owner_id],
(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

const groupId = result.insertId;

/* thêm owner vào member */
db.query(
"INSERT INTO group_members(group_id,user_id) VALUES (?,?)",
[groupId,owner_id],
(err2)=>{
if(err2){
console.log(err2);
}
});

res.json({
status:"success",
id:groupId
});

});

});


/* =====================
GET GROUPS OF USER
===================== */

router.get("/",(req,res)=>{

const userId = req.query.userId;

db.query(
`SELECT groups.*
FROM groups
JOIN group_members
ON groups.id = group_members.group_id
WHERE group_members.user_id=?`,
[userId],
(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.json(result);

});

});


/* =====================
ADD MEMBER TO GROUP
===================== */

router.post("/addMember",(req,res)=>{

const {group_id,user_id} = req.body;

/* kiểm tra member đã tồn tại chưa */
db.query(
"SELECT * FROM group_members WHERE group_id=? AND user_id=?",
[group_id,user_id],
(err,result)=>{

if(err){
return res.status(500).json(err);
}

if(result.length>0){
return res.json({
status:"exists"
});
}

/* nếu chưa có thì thêm */
db.query(
"INSERT INTO group_members(group_id,user_id) VALUES (?,?)",
[group_id,user_id],
(err2,result2)=>{

if(err2){
return res.status(500).json(err2);
}

res.json({
status:"member added"
});

});

});

});


/* =====================
GET GROUP MEMBERS
===================== */

router.get("/members/:groupId",(req,res)=>{

const groupId = req.params.groupId;

db.query(
`SELECT users.id,users.username,users.avatar
FROM group_members
JOIN users ON group_members.user_id = users.id
WHERE group_members.group_id=?`,
[groupId],
(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.json(result);

});

});


module.exports = router;