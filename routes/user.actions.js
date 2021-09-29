const express = require("express");
const db = require("../db");
const router = express.Router();
const requireLogin = require("../middle-wares");


router.post("/message", requireLogin, (req, res) => {
    const { toUserId, message, time } = req.body;
    const fromUserId = req.user.userId;
    const sql = "INSERT INTO messages (fromUserId, toUserId, time, message) VALUES (?, ?, ?, ?)"
    db.query(sql, [fromUserId, toUserId, time, message], (error, result) => error ?  res.json({error}) : res.json({ message: message }))
});


router.get("/messages/:userId", requireLogin, (req, res) => {
    const sql = `SELECT * FROM messages`;
    db.query(sql, (error, result) => { 
        if (error) {
            res.json({error: error});
        } else {
            const allMessages = result.filter(item => item.fromUserId === req.user.userId);
            const sendMessages = allMessages.filter((item) => item.toUserId === req.params.userId);
            //messages i received from a friend
            const friendMessages = result.filter((item) => item.fromUserId === req.params.userId);
            const myMessages = friendMessages.filter((item) => item.toUserId === req.user.userId);
            //all messages send and received from 2 users
            const messages = [...sendMessages, ...myMessages];
            messages.sort((a, b) => a.id - b.id)
            res.json({ messages: messages });
        }
    })
});
     
router.get("/users", requireLogin, (req, res) => {
    const sql = "SELECT * FROM users"
    db.query(sql, (error, data) => {
        if(error) {
            res.json({error: error});
        } else {
            const friends = data.filter(user => user.userId !== req.user.userId)
            res.status(200).json({friends: friends});
        }
    })
})

router.get("/user/:userId", requireLogin, (req, res) => {
    const sql = "SELECT * FROM users"
    db.query(sql, (error, data) => {
        if(error) {
            res.json({error: error});
        } else {
            const userInfo = data.find(user => user.userId === req.params.userId)
            res.status(200).json({userInfo: userInfo});
        }
    })
})

router.get("/myposts", requireLogin, (req, res) => {
    const sql = "SELECT * FROM posts"
    db.query(sql, (error, data) => {
        if(error) {
            res.json({error: error});
        } else {
            const posts = data.filter(user => user.userId === req.user.userId)
            res.status(200).json({posts: posts});
        }
    })
})

router.get("/posts", (req, res) => {
    const sql = "SELECT * FROM posts"
    db.query(sql, (error, data) => {
        if(error) {
            res.json({error: error});
        } else {
             res.json({posts: data})
        }
    })
})

module.exports = router;