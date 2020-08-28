const express = require('express')
, PostRouter = express.Router()
, userMiddleware = require('../middleware/users.js')
, multer = require('multer')
, path = require('path')
, db = require('../config/db.js')
, fs = require('fs');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,'./public/image/uploads')
    },
    filename: (req, file, cb) => {
      cb(null,'IMG-' + Date.now() + path.extname(file.originalname))
    }
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
  var upload = multer({storage: storage , fileFilter : fileFilter});

PostRouter.get('/poststest' , (req , res , next)=>{
    res.status=200;
    res.setHeader('Content-Type' , 'application/json');
    res.json({ hi: "hello world!" })
    });

    PostRouter.post('/create_post' , upload.array('image', 5) , userMiddleware.isLoggedIn , (req , res , next)=>{
      var filearray = [];
      //let file = req.files.find(car => filearray.push(car.path) );
      for(let i = 0; i < req.files.length; i++){ 
        filearray.push(req.files[i].path);
        }
      var stringObj = JSON.stringify(filearray);
        db.query(`INSERT INTO post ( user, image, body , date) VALUES ( ${db.escape(req.userData.userId)},
         ${db.escape(stringObj)},${db.escape(req.body.body)} , ${Date.now()})`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                  msg: err
                });
              }
              return res.status(201).send({
                msg: 'Uplouded! Good Job'
              }); 
        });
    });

    PostRouter.get('/' , userMiddleware.isLoggedIn , (req , res ,next)=>{
    db.query(`SELECT post.id , users.username , post.body , post.image , post.date FROM post JOIN users ON users.id=post.user` , (err , result) =>{
      if(err){
        res.send(err);
      }else{

        for(let i = 0; i < result.length; i++){
          result[i].image = JSON.parse(result[i].image);
          }
        res.send(result);
      }
    });
    });

    PostRouter.get('/:postid'  , userMiddleware.availabilty, (req ,res ,next)=>{
      db.query(`SELECT post.id , users.username , post.body , post.image , post.date FROM post JOIN users ON users.id=post.user WHERE post.id=${req.params.postid}` , (err , result) =>{
        if(err){
          res.send(err);
        }else{
         result[0].image = JSON.parse(result[0].image); 
          res.send(result[0]);
        }
      });
    });

    PostRouter.put('/update/:postid' , upload.array('image', 3) ,  userMiddleware.isLoggedIn, userMiddleware.availabilty, userMiddleware.postOwner, (req , res ,next)=>{
      db.query(`SELECT image FROM post WHERE post.id=${req.params.postid}`, (err , result)=>{
      if (err){
        console.log(err);
      }else{
        var images = JSON.parse(result[0].image);
          for(var i = 0; i < images.length; i++){ 
            fs.unlinkSync(images[i]);
            }
        //fs.unlinkSync(result[0].image);
        var filearray = [];
      //let file = req.files.find(car => filearray.push(car.path) );
      for(let i = 0; i < req.files.length; i++){ 
        filearray.push(req.files[i].path);
        }
      var stringObj = JSON.stringify(filearray);
      db.query(`UPDATE post SET body = ${db.escape(req.body.body)}, image = ${db.escape(stringObj)} WHERE id = ${req.params.postid};` , (err , result)=>{
        if (err){
          console.log(err)
        }else{
          res.send(result);
        }
      });
      }
      });
      
    });

    PostRouter.delete('/delete/:postid' ,userMiddleware.isLoggedIn ,userMiddleware.availabilty,  userMiddleware.postOwner , (req , res , next)=>{
      db.query(`SELECT image FROM post WHERE post.id=${req.params.postid}`, (err , result)=>{
        if (err){
          console.log(err);
        }else{
         var images = JSON.parse(result[0].image);
          for(var i = 0; i < images.length; i++){ 
            fs.unlinkSync(images[i]);
            //if(i <= images.length){}
            }
            db.query(`DELETE FROM post WHERE post.id=${req.params.postid}`, (err , result)=>{
              if (err){
                throw err;
              }else{
                res.send({done : true});
              }
            });
          //fs.unlinkSync(result[0]);
               // db.query(`DELETE FROM post WHERE post.id=${req.params.postid}`, (err , result)=>{
                  //if (err){
                  //  res.send(err);
                //  }else{
                 //   res.send(result);
                 // }
                //});
              }
        });
     
     
     // db.query(`DELETE FROM post WHERE ${req.params.postid};` , (err , result)=>{
      //  if(err){
       //   res.send(err);
       // }else{
        //  res.send(result)
        //}
     // });
    });
    module.exports = PostRouter;

    //CREATE TABLE `node`.`posts` ( `postId` INT(225) NOT NULL , `userId` INT(225) NOT NULL , `imageSpath` VARCHAR(225) NOT NULL , `postBody` VARCHAR(225) NOT NULL , `postedDate` VARCHAR(225) NOT NULL ) ENGINE = InnoDB;