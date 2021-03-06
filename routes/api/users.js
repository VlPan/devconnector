const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport  = require('passport');

// Load input validation
const validateRegisterInput = require('./../../validation/register');
const validateLoginInput = require('./../../validation/login');

const keys = require('./../../config/keys');



// Load User Model
const User = require('./../../models/User');

// @router GET api/users/test
// @desc   Test users route
// @access Public
router.get('/test', (req, res)=>{
    res.json({msg: "Users work"});
});

// @router GET api/users/register
// @desc   Register user
// @access Public

router.post('/register', (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    User.findOne({
        email: req.body.email
    }).then(user => {
        if(user) {
            errors.email = 'Email already exist'
            return res.status(400).json(errors);
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', // Size
                r: 'pg', // Rating
                d: 'mm' // Default
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

     
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save().then((user)=>{
                        res.json(user);
                    }).catch(err => console.log(err));
                })
            });
        }
    })
})

// @router GET api/users/register
// @desc   Login user / Returning JWT Token
// @access Public

router.post('/login', (req, res)=> {
    const email = req.body.email;
    const password = req.body.password;

    const { errors, isValid } = validateLoginInput(req.body);
    // Find user by Email

    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    User.findOne({email})
    .then(user => {
        // Check for user
        if(!user) {
            errors.email = 'User Not found';
            return res.status(404).json(errors);
        }

        // Check password
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(isMatch) {
                // Sign Token
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                } // Create JWT payload

                jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    if(err) throw err;
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    })
                });
            } else {
                errors.password = `Password incorrect for ${user.email}`;
                return res.status(400).json(errors);
            }
        })
    })
});


// @router GET api/users/current
// @desc   Return current User
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });  
});

module.exports = router;