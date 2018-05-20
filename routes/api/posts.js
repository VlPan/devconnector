const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('./../../models/Post');
const Profile = require('./../../models/Profile');
const validatePostInput = require('./../../validation/post');


// @router GET api/posts/test
// @desc   Test posts route
// @access Public
router.get('/test', (req, res)=>{
    res.json({msg: "post works"});
});

// @router POST api/posts/
// @desc   Create post
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    let { errors, isValid } = validatePostInput(req.body);
    // Find user by Email

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));

});



// @router GET api/posts/
// @desc   Get posts
// @access Public

router.get('/',  (req, res) => {
    Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({noPostsFound: 'No Posts found'}));
});

// @router GET api/posts/:id
// @desc   Get post
// @access Public
router.get('/:id',  (req, res) => {
    Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({noPostFound: 'No Post found with that ID'}));
});

// @router DELETE api/posts/:id
// @desc   Delete post
// @access Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).
    then((profile) => {
        Post.findById(req.params.id)
        .then(post => {
            // Check for post Owner
            if(post.user.toString() !== req.user.id) {
                return res.status(401).json({notAuthorized: 'User is not authorized'});
            }

            // Delete 
            post.remove().then(() => {
                res.json({ success: true });
            })
            .catch(() => res.status(404).json({postnotfound: 'Can not delete post'}));
        })
        .catch(() => res.status(404).json({postnotfound: 'Mo post find'}));
    });
});

// @router POST api/posts/like/:id
// @desc   Like post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).
    then((profile) => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) { // Alredy like it!
                return res.status(400).json({alredyLiked: 'User already liked this post'});
            }

            // Add the user id to likes array
            post.likes.unshift({ user: req.user.id });
            post.save().then(post => res.json(post));
        })
        .catch(() => res.status(404).json({postnotfound: 'Mo post find'}));
    })
    ;
});

// @router POST api/posts/unlike/:id
// @desc   Unlike post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).
    then((profile) => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) { // not like it!
                return res.status(400).json({notLiked: 'User have not yet liked this post'});
            }

            // remove like
            const removeIndex = post.likes.map(like => like.user.toString())
            .indexOf(req.user.id);

            post.likes.splice(removeIndex, 1);
            post.save()
            .then((post) => res.json(post));
        })
        .catch(() => res.status(404).json({postnotfound: 'Mo post find'}));
    });
});

// @router POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private


router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {

    let { errors, isValid } = validatePostInput(req.body);
    // Find user by Email

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
    .then(post => {
        const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        }

        // Add to comments array
        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));

    })
    .catch(err => res.status(404).json({postnotfound: 'post was not found'}));
});


// @router DELETE api/posts/comment/:post_id/:comment:id
// @desc   Remove comment from post
// @access Private


router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {


  

    Post.findById(req.params.post_id)
    .then(post => {
        // Check to see if the comment Exist

        // if(post.user.toString() !== req.user.id) {
        // return res.status(401).json({notAuthorized: 'User is not authorized'});
        // }

        
        if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id)
            .length === 0) {
                return res.status(404).json({commentnotexists: 'Comment does not exist'})
        } // Comment does not exist
        if(post.comments.filter(comment => {
            return comment.user.toString() === req.user.id
        })
            .length === 0) {
                return res.status(404).json({commentnotexists: 'You are not authorized'})
        } // Comment not owned by current user
        const removeIndex = post.comments.map(comment => comment._id.toString())
        .indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);
        post.save()
        .then((post) => res.json(post));
        
    })
    .catch(err => res.status(404).json({postnotfound: 'post was not found'}));
});

module.exports = router;