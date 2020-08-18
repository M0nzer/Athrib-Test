const express = require('express');
const PostRouter = express.Router();

PostRouter.get('/poststest' , (req , res , next)=>{
    res.status=200;
    res.setHeader('Content-Type' , 'application/json');
    res.json({ hi: "hello world!" })
    });

    module.exports = PostRouter;