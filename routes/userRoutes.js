const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

/* DÙNG CHUNG DATABASE */
const db = require("../config/database");


/* =====================
   MULTER STORAGE
===================== */

const storage = multer.diskStorage({

destination:(req,file,cb)=>{

cb(null, path.join(__dirname,"../uploads"));

},

filename:(req,file,cb)=>{

const ext = path.extname(file.originalname);

cb(null, Date.now() + ext);

}

});

const upload = multer({storage:storage});


/* =====================
   UPLOAD AVATAR
===================== */

router.post("/avatar", upload.single("avatar"), (req,res)=>{

const userId = req.body.userId;

if(!userId){
return res.status(400).json({error:"userId missing"});
}

if(!req.file){
return res.status(400).json({error:"No file uploaded"});
}

const avatarPath = "/uploads/" + req.file.filename;

db.query(
"UPDATE users SET avatar=? WHERE id=?",
[avatarPath,userId],
(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

res.json({
status:"success",
avatar:avatarPath
});

});

});

module.exports = router;