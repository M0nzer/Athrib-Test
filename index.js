var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
//const IndexRouter = require('./router/index.router.js');
var PostsRouter = require('./router/posts.router.js');
var UsersRouter = require('./router/users.router');

//middellware
//app.use('/api/', IndexRouter);
app.use('/api/posts', PostsRouter);
app.use('/api/users' , UsersRouter);
app.use(bodyParser.json());
app.use(cors());


app.get('/test' , (req , res , next)=>{
res.status=200;
res.setHeader('Content-Type' , 'application/json');
res.json({ hi: "hello world!" })
});


app.listen(3232);
console.log('app listining in on port 3232');