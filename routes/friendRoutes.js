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

// GET FRIENDS
router.get("/", (req,res)=>{

const userId = req.query.userId;

db.query(
`SELECT users.id, users.username
FROM friends
JOIN users ON friends.friend_id = users.id
WHERE friends.user_id = ?`,
[userId],
(err,result)=>{

if(err){
res.status(500).json(err);
return;
}

res.json(result);

});

});

module.exports = router;