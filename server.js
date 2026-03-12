const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

/* CHO PHÉP LOAD AVATAR */
app.use("/uploads", express.static(path.join(__dirname,"uploads")));


// database
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


// ROUTES
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const profileRoutes = require("./routes/profileRoutes");
const postRoutes = require("./routes/postRoutes");
const groupRoutes = require("./routes/groupRoutes");

/* ROUTE AVATAR */
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/users", userRoutes);



// API friends
app.get("/api/friends",(req,res)=>{

const userId = req.query.userId;

db.query(
"SELECT id, username, avatar FROM users WHERE id != ?",
[userId],
(err,result)=>{

if(err){
res.status(500).json(err);
return;
}

res.json(result);

});

});


// SOCKET CHAT
io.on("connection",(socket)=>{

console.log("User connected");

socket.on("sendMessage",(data)=>{

io.emit("receiveMessage",data);

});

});


server.listen(3000,()=>{
console.log("Server running on port 3000");
});