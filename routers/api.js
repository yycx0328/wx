/**
 * Created by luyh on 2017/5/19.
 */
var express = require('express');
var router = express.Router();
var jsSHA = require('jssha');
var wxConfig = require('./config/wx');

router.get('/',function (req,res,next) {
    // 设置token
    var token = wxConfig.token;
    // 获取请求参数
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var echostr = req.query.echostr;
    var nonce = req.query.nonce;

    // 将请求参数排序，并拼接成字符串（signature不拼接）
    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = token;
    oriArray.sort();
    var original = oriArray.join('');

    // 进行SH-1加密
    var shaObj = new jsSHA(original, 'TEXT');
    var scyptoString=shaObj.getHash('SHA-1', 'HEX');
    // 验证签名
    if(signature == scyptoString){
        // 验证成功
        res.send("验证成功");
    } else {
        // 验证失败
        res.send("验证失败");
    }
});

module.exports = router;