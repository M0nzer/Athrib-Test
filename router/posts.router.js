const express = require('express');
const PostRouter = express.Router();
const userMiddleware = require('../middleware/users.js');
var multer = require('multer');
var path = require('path');
const db = require('../config/db.js');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,'./public/image/uploads')
    },
    filename: (req, file, cb) => {
      cb(null,'IMG-' + Date.now() + path.extname(file.originalname))
    }
  });
  var upload = multer({storage: storage});

PostRouter.get('/poststest' , (req , res , next)=>{
    res.status=200;
    res.setHeader('Content-Type' , 'application/json');
    res.json({ hi: "hello world!" })
    });

    PostRouter.post('/create_post' , upload.single('image') , userMiddleware.isLoggedIn , (req , res , next)=>{
        db.query(`INSERT INTO post ( user, image, body , date) VALUES ( ${db.escape(req.userData.userId)}, ${db.escape(req.file.path)},${db.escape(req.body.body)} , ${Date.now()})`,(err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                  msg: err
                });
              }
              return res.status(201).send({
                msg: 'Uplouded! Good Job'
              });
              console.log(result);
        });
    });
    module.exports = PostRouter;

    //CREATE TABLE `node`.`posts` ( `postId` INT(225) NOT NULL , `userId` INT(225) NOT NULL , `imageSpath` VARCHAR(225) NOT NULL , `postBody` VARCHAR(225) NOT NULL , `postedDate` VARCHAR(225) NOT NULL ) ENGINE = InnoDB;