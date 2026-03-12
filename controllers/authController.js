const db = require("../config/database");

exports.register=(req,res)=>{

const {username,password}=req.body;

db.query(
"INSERT INTO users(username,password) VALUES(?,?)",
[username,password],
(err,result)=>{

if(err){
return res.json({status:"error"});
}

res.json({status:"success"});

});

};

exports.login=(req,res)=>{

const {username,password}=req.body;

db.query(
"SELECT * FROM users WHERE username=? AND password=?",
[username,password],
(err,result)=>{

if(result.length>0){

res.json({
status:"success",
user:result[0]
});

}else{

res.json({status:"fail"});

}

});

};