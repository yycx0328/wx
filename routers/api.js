/**
 * Created by luyh on 2017/5/19.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var wxConfig = require('../config/wx');

router.get('/validate',function (req,res,next) {
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
    var hashSum = crypto.createHash('sha1');
    hashSum.update(original);
    var scyptoString = hashSum.digest('hex');

    // 验证签名
    if(signature == scyptoString){
        // 验证成功
        res.end(echostr);
        console.log("confirm and send echo back");
    } else {
        // 验证失败
        res.end("false");
        console.log("failed!");
    }
});

module.exports = router;