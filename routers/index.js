/**
 * Created by lyh_o on 2017/5/18.
 */
var express = require('express');
var router = express.Router();

router.use(function (req,res,next) {
    
})

router.get('/',function (req,res,next) {
    res.render('index');
});

module.exports = router;