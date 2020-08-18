const express = require('express');
const IndexRouter = express.Router();


IndexRouter.get('/indextest' , (req , res , next)=>{
    res.status=200;
    res.setHeader('Content-Type' , 'application/json');
    res.json({ hi: "hello world!" })
    });


    module.exports = IndexRouter;