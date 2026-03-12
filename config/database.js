const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "mychat",
  port: 3300
});

db.connect((err)=>{
  if(err){
    console.log("MySQL error:",err);
    return;
  }

  console.log("MySQL connected");
});

module.exports = db;