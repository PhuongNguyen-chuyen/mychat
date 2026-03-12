const db=require("../config/database");

exports.getMessages=(req,res)=>{

const {sender,receiver}=req.query;

db.query(
"SELECT * FROM messages WHERE sender_id=? AND receiver_id=?",
[sender,receiver],
(err,result)=>{

res.json(result);

});

};