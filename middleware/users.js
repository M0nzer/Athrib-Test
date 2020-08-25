const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
module.exports = {
    validateRegister: (req, res, next) => {
      // username min length 3
      if (!req.body.username || req.body.username.length < 3) {
        return res.status(400).send({
          msg: 'Please enter a username with min. 3 chars'
        });
      }
      // password min 6 chars
      if (!req.body.password || req.body.password.length < 6) {
        return res.status(400).send({
          msg: 'Please enter a password with min. 6 chars'
        });
      }
      // password (repeat) does not match
      if (
        !req.body.password_repeat ||
        req.body.password != req.body.password_repeat
      ) {
        return res.status(400).send({
          msg: 'Both passwords must match'
        });
      }
      next();
    } ,
    isLoggedIn: (req, res, next) => {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token,'SECRETKEY');
        req.userData = decoded;
        next();
      } catch (err) {
        return res.status(401).send({
          msg: 'You Must Be Logining in!'
        });
      }
    },
    postOwner : (req , res , next) =>{
      db.query(`SELECT user , id FROM post WHERE post.id=${req.params.postid}`, (err , result)=>{
        let usertryer = req.userData.userId;
        if(usertryer != result[0].user){
          return res.status(401).send({
            msg: 'This Is Not Your Post You Cant Edit It'
          });
        }
        if(usertryer == result[0].user){
          next();
        }
      });
    },
    availabilty: (req , res , next)=>{
     //`SELECT id FROM post WHERE post.id=${req.params.postid}`
      var sql = `SELECT id FROM post WHERE EXISTS (SELECT id FROM post WHERE post.id = ${req.params.postid})`
      db.query(sql, (err , result)=>{
        if(err){
          next(err);
        }
        if(result.length == 0){
          return res.status(401).send({
            msg: 'no post'
          });
        }
        if(result.length >= 0){
          next();
        }
      });
    },
    profileOwner : (req , res , next)=>{
      db.query(`SELECT id FROM users WHERE users.id=${req.params.proid}`, (err , result)=>{
        var usertryer = req.userData.userId;
        if(usertryer != result[0].id){
          return res.status(401).send({
            msg: 'This Is Not Your Profile You Cant update It'
          });
        }
        if(usertryer == result[0].id){
          next();
        }
      });
    }
  };

  