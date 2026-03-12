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


/* =========================
   CREATE POST
========================= */

router.post("/",(req,res)=>{

const {user_id,content} = req.body;

db.query(
"INSERT INTO posts (user_id,content) VALUES (?,?)",
[user_id,content],
(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

res.json({
status:"success",
id:result.insertId
});

});

});


/* =========================
   GET POSTS (LOAD AVATAR)
========================= */

router.get("/",(req,res)=>{

db.query(
`SELECT 
posts.id,
posts.content,
posts.user_id,
users.username,
users.avatar
FROM posts
JOIN users ON posts.user_id = users.id
ORDER BY posts.id DESC`,
(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

res.json(result);

});

});


/* =========================
   DELETE POST (ONLY OWNER)
========================= */

router.delete("/:id",(req,res)=>{

const postId = req.params.id;
const userId = req.query.user_id;

db.query(
"DELETE FROM posts WHERE id=? AND user_id=?",
[postId,userId],
(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

if(result.affectedRows===0){
return res.json({status:"not owner"});
}

res.json({status:"deleted"});

});

});


/* =========================
   UPDATE POST (ONLY OWNER)
========================= */

router.put("/:id",(req,res)=>{

const postId = req.params.id;
const {content,user_id} = req.body;

db.query(
"UPDATE posts SET content=? WHERE id=? AND user_id=?",
[content,postId,user_id],
(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

if(result.affectedRows===0){
return res.json({status:"not owner"});
}

res.json({status:"updated"});

});

});


module.exports = router;