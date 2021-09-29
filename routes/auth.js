const express = require("express");
const db = require("../db");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

router.post("/register", (req, res) => {
    const { name, email, profilePhoto, password } = req.body;
    const userId = uuidv4();
    if (name === "" && email  === "" && password === "") res.json({ error: "no black spaces" });
    const sql = "SELECT * FROM users";
    db.query(sql, async (error, result) => {
      if(error) {
          res.json({error});
      } else {
          const user = result.some(item => item.email === email);
          if(user) {
              res.json({ error: "user already exists" });
          } else {
              const newPassword = await bcrypt.hash(password, 10);
              const sql = "INSERT INTO users (userId, name, email, profilePhoto, password) VALUES (?, ?, ?, ?, ?)";
              db.query(sql, [userId, name, email, profilePhoto, newPassword], (error, result) => {
                  if(error) {
                      res.json({error});
                  } else {
                      const token = jwt.sign({userId, name, email}, "chatappsecret");
                      res.status(201).json({ token, user:{ name, email, profilePhoto }});
                  }
              });
          }
      }
    });
});


  router.post("/login", (req, res) => {
      const { email, password } = req.body;
      if (email === "" && password === "") res.json({ error: "no black spaces" });
      const sql = "SELECT * FROM users";
      db.query(sql, async (error, result) => {
          if(error) {
              res.json({ error });
          } else {
              const user = result.find(user => user.email === email);
              if(user) {
                  const checkedPassword = await bcrypt.compare(password, user.password);
                  if(checkedPassword) {
                      const token = jwt.sign({ userId: user.userId, name: user.name, email }, "chatappsecret");
                      res.status(201).json({ token, user :{ userId: user.userId, name: user.name, email, profilePhoto: user.profilePhoto }});                     
                  } else {
                    res.json({error: "email or password is wrong"});
                  }
              } else {
                  res.json({error: "user does not exist"});
              }
          }
      });
  });

  module.exports = router;