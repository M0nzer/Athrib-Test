const express = require('express');
const UsersRouter = express.Router();
const fs = require('fs');
const bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
const userMiddleware = require('../middleware/users.js');
var multer = require('multer');
var path = require('path');

UsersRouter.use(bodyParser.urlencoded({ extended: false }));
UsersRouter.use(bodyParser.json());
UsersRouter.use(cors());

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'./public/image/Profile')
  },
  filename: (req, file, cb) => {
    cb(null,'IMG-' + Date.now() + path.extname(file.originalname))
  }
});
var upload = multer({storage: storage});

UsersRouter.get('/' , (req , res , next)=>{
    res.status=200;
    res.setHeader('Content-Type' , 'application/json');
    res.json({ hi: "hello world!" })
          });

    UsersRouter.post('/sign-up', upload.single('profile'), userMiddleware.validateRegister,  (req, res, next) => {
            db.query(`SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(req.body.username)});`,(err, result) => {
                if (result.length) {
                  return res.status(409).send({
                    msg: 'This username is already in use!'
                  });
                } else {
                  // username is available
                  bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                      return res.status(500).send({
                        msg: err
                      });
                    } else {
                      if (!req.file) {
                        console.log("No file received");
                      } else {
                        console.log('file received');
                      }

                      // has hashed pw => add to database
                      db.query(`INSERT INTO users ( username, password, profile_pic, registered) VALUES ( ${db.escape(req.body.username)}, ${db.escape(hash)},${db.escape(req.file.path)}, now())`,(err, result) => {
                          if (err) {
                            throw err;
                            return res.status(400).send({
                              msg: err
                            });
                          }
                          return res.status(201).send({
                            msg: 'Registered!'
                          });
                        }
                      );
                    }
                  });
                }
              }
            );
          });
    
    UsersRouter.post('/login', (req, res, next) => {
        db.query(`SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,(err, result) => {
              // user does not exists
              if (err) {
                throw err;
                return res.status(400).send({
                  msg: err
                });
              }
              if (!result.length) {
                return res.status(401).send({
                  msg: 'Username or password is incorrect!'
                });
              }
              // check password
              bcrypt.compare(req.body.password,result[0]['password'],(bErr, bResult) => {
                  // wrong password
                  if (bErr) {
                    throw bErr;
                    return res.status(401).send({
                      msg: 'Username or password is incorrect!'
                    });
                  }
                  if (bResult) {
                    const token = jwt.sign({
                        username: result[0].username,
                        userId: result[0].id
                      },
                      'SECRETKEY', {
                        expiresIn: '7 days'
                      });
                    db.query(`UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`);
                    return res.status(200).send({
                      msg: 'Logged in!',
                      token,
                      user: result[0]
                    });
                  }
                  return res.status(401).send({
                    msg: 'Username or password is incorrect!'
                  });
                });
              });
          });
    
UsersRouter.put('/updateProfile/:proid' , userMiddleware.isLoggedIn, userMiddleware.profileOwner , upload.single('profile') , (req , res , next)=>{
  db.query(`SELECT profile_pic FROM users WHERE users.id=${req.params.proid}`, (err , result)=>{
    if (err){
      console.log(err);
    }else{
      fs.unlinkSync(result[0].profile_pic);
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        req.body.password = hash;
      
    db.query(`UPDATE users SET profile_pic = ${db.escape(req.file.path)} , username = ${db.escape(req.body.username)}  , password = ${db.escape(req.body.password)} WHERE id = ${req.params.proid};` , (err , result)=>{
      if (err){
        console.log(err)
      }else{
        res.send(result);
      }
    });
  });
  }
    });
    
          });

UsersRouter.delete('/deleteProfile/:proid' , userMiddleware.isLoggedIn , userMiddleware.profileOwner , (req , res , next)=>{
  db.query(`SELECT profile_pic FROM users WHERE users.id=${req.params.proid}`, (err , result)=>{
    if (err){
      console.log(err);
    }else{
      fs.unlinkSync(result[0].profile_pic);
            db.query(`DELETE FROM users WHERE users.id=${req.params.proid}`, (err , result)=>{
              if (err){
                console.log(err);
              }else{
                res.send(result);
              }
            });
          }
    });
          });

module.exports = UsersRouter;