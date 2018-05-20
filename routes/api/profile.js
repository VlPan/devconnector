const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./../../config/keys');
const Profile = require('./../../models/Profile');
const validateProfileInput = require('./../../validation/profile');
const validateExperienceInput = require('./../../validation/experience');
const validateEducationInput = require('./../../validation/education');

// @router GET api/profile/test
// @desc   Test profile route
// @access Public
router.get('/test', (req, res)=>{
    res.json({msg: "profile works"});
});

// @router GET api/profile/test
// @desc   Get current user's profile
// @access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    let errors = {};

    Profile.findOne({
        user: req.user.id
    }) 
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
        if(!profile) {
            errors.noprofile = "There is no profile for this user";
            return res.status(404).json(errors)
        }
        res.json(profile);
    })
    .catch((err) => {
        res.status(404).json(err);
    });
});


// @router POST api/profile/all
// @desc   Get ALL profiles
// @access Public
router.get('/all', (req, res) => {
    let errors = {};
    Profile.find()
    .then(profiles => {
        if(!profiles){
            errors.noprofile = "There are no profiles";
            return res.status(404).json(errors);
        } else {
            res.json(profiles);
        }
    }).catch((err) => {
        return res.status(404).json({profile: "There are no prfoiles"}); 
    });
});


// @router POST api/profile/handle/:handle
// @desc   Get profile by handle
// @access Public
router.get('/handle/:handle', (req, res) => {
    let errors = {};
    Profile.findOne({
        handle: req.params.handle
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if(!profile) {
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        res.json(profile);

    }).catch((err) => {
        res.status(404).json(err);
    });
});

// @router POST api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public
router.get('/user/:user_id', (req, res) => {
    let errors = {};
    Profile.findOne({
        user: req.params.user_id
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if(!profile) {
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        res.json(profile);

    }).catch((err) => {
        res.status(404).json(err);
    });
});


// @router POST api/profile/create
// @desc   Create or Edit User profile
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    let { errors, isValid } = validateProfileInput(req.body);
    // Find user by Email

    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    let newProfile = {};
    newProfile.user = req.user.id;
    if(req.body.handle) newProfile.handle = req.body.handle;
    if(req.body.company) newProfile.company = req.body.company;
    if(req.body.website) newProfile.website = req.body.website;
    if(req.body.location) newProfile.location = req.body.location;
    if(req.body.bio) newProfile.bio = req.body.bio;
    if(req.body.status) newProfile.status = req.body.status;
    if(req.body.githubUsername) newProfile.githubUsername = req.body.githubUsername;

    if(typeof req.body.skills !== 'undefined') {
        let skillsString = req.body.skills;
        let skillsArr = skillsString.split(',');
        newProfile.skills = skillsArr;
    }

    newProfile.social = {};
    if(req.body.youtube) newProfile.social.youtube = req.body.youtube;
    if(req.body.likedin) newProfile.social.likedin = req.body.likedin;
    if(req.body.twitter) newProfile.social.twitter = req.body.twitter;
    if(req.body.instagram) newProfile.social.instagram = req.body.instagram;
    if(req.body.facebook) newProfile.social.facebook = req.body.facebook;

    Profile.findOne({
        user: req.user.id
    })
    .then((profile) => {
        if (profile) {
            Profile.findOneAndUpdate(
                { user: req.user.id }, 
                { $set: newProfile }, 
                { new: true }
            )
            .then((profile) => {
                res.json(profile);
            });
        }else{
            // Check if handle exist
            Profile.findOne({ handle: newProfile.handle })
            .then((profile) => {
                if(profile) {
                    errors.handle = "Taht handle is already exist";
                    res.status(400).json(errors);
                }

                // Save profile
                new Profile(newProfile).save().then((profile) => {
                    res.json(profile);
                });
            })
        }
    }) 

});



// @router POST api/profile/experience
// @desc   Add experience to profile
// @access Private


router.post('/experience', passport.authenticate('jwt', {session: false }), (req, res) => {

    let { errors, isValid } = validateExperienceInput(req.body);
    // Find user by Email

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({
        user: req.user.id // Get from the token
    }).then(profile => {
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        };
        // Add to experience array

        profile.experience.unshift(newExp);
        profile.save().then((profile) => {
            res.json(profile);
        });
    });
});


// @router POST api/profile/education
// @desc   Add education to profile
// @access Private


router.post('/education', passport.authenticate('jwt', {session: false }), (req, res) => {

    let { errors, isValid } = validateEducationInput(req.body);
    // Find user by Email

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({
        user: req.user.id // Get from the token
    }).then(profile => {
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldOfStudy: req.body.fieldOfStudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        };
        // Add to experience array

        profile.education.unshift(newEdu);
        profile.save().then((profile) => {
            res.json(profile);
        });
    });
});


module.exports = router;