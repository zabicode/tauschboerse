const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');


const User = require('../models/user');

router.post("/signup", (req, res, next) => {

    bcrypt.hash(req.body.password,10)
    .then(hash => {
        User.create({
            email: req.body.email,
            password: hash
        })
        .then(result => {
            res.status(201).json({
                message: 'User created',
                result: result
            });
        })
        .catch( err =>{
            res.status(500).json({
                error: err
            });
        });
    });

    });


    router.post("/login", (req, res, next) => {

        let fetchedUser;

        User.findOne({where: {email: req.body.email}}).then(user => {
            if(!user){
                throw new Error('Auth failed');
                /*
                return res.status(401).json({
                    message: 'Auth failed'
                });
                */
            }
            
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);    // COMPARE PASSWORDS VIA BCRYPT
        }).then(result => {
            if(!result) {
                throw new Error('Auth failed');
                /*
                return res.status(401).json({
                    message: 'Auth failed'
                });
                */
            }

            const token = jwt.sign(                                             // Create Jsonwebtoken
                {email: fetchedUser.email, userId: fetchedUser.id},           // 
                'secret_webtoken',                                              //
                {expiresIn: "1h"}                                             //
            );

            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser.id
            });
        }).catch(err => {
            throw new Error('Auth failed');
                /*
                return res.status(401).json({
                    message: 'Auth failed'
                });
                */
        });
    });



module.exports = router;