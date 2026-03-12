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


// GET PROFILE
router.get("/:id",(req,res)=>{

const id = req.params.id;

db.query(
"SELECT id,username,avatar FROM users WHERE id=?",
[id],
(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

if(result.length===0){
return res.json(null);
}

res.json(result[0]);

});

});


// UPDATE USERNAME
router.post("/update",(req,res)=>{

const {id,username} = req.body;

db.query(
"UPDATE users SET username=? WHERE id=?",
[username,id],
(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

res.json({status:"updated"});

});

});

module.exports = router;