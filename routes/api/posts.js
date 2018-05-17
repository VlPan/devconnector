const express = require('express');
const router = express.Router();

// @router GET api/posts/test
// @desc   Test posts route
// @access Public
router.get('/test', (req, res)=>{
    res.json({msg: "post works"});
});

module.exports = router;