/**
 * Created by lyh_o on 2017/5/21.
 */
// var express = require('express');
// var router = express.Router();
var wechat = require('wechat');
var wxConfig = require('../config/wx');

exports.get_message = wechat(wxConfig,wechat.text(function (message,req,res,next) {
    console(message);
    res.replay('');
}));ok