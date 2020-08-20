const express = require('express');
const PostRouter = express.Router();
const userMiddleware = require('../middleware/users.js');
var multer = require('multer');
var path = require('path');
const db = require('../config/db.js');

PostRouter.get('/poststest' , (req , res , next)=>{
    res.status=200;
    res.setHeader('Content-Type' , 'application/json');
    res.json({ hi: "hello world!" })
    });

    PostRouter.post('/create_post' , (req , res , next)=>{
        
    });
    module.exports = PostRouter;