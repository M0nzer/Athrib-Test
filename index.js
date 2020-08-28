var express = require('express')
        , bodyParser = require('body-parser')
        , cors = require('cors')
        , app = express()
        //, IndexRouter = require('./router/index.router.js')
        , PostsRouter = require('./router/posts.router.js')
        , UsersRouter = require('./router/users.router');

//middellware
//app.use('/api/', IndexRouter);
app.use('/api/posts', PostsRouter);
app.use('/api/users' , UsersRouter);
app.use(bodyParser.json());
app.use(cors());


app.get('*' , (req , res , next)=>{
res.status=404;
res.setHeader('Content-Type' , 'application/json');
res.send({ Error: "Not Found!" })
});
app.post('*' , (req , res , next)=>{
    res.status=404;
    res.setHeader('Content-Type' , 'application/json');
    res.send({ Error: "Not Found!" })
    });
app.put('*' , (req , res , next)=>{
    res.status=404;
    res.setHeader('Content-Type' , 'application/json');
    res.send({ Error: "Not Found!" })
    });
app.delete('*' , (req , res , next)=>{
    res.status=404;
    res.setHeader('Content-Type' , 'application/json');
    res.send({ Error: "Not Found!" })
    });
app.listen(3232);
console.log('Server Running at Port 3232 localhost:3232');