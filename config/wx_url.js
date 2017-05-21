/**
 * Created by luyh on 2017/5/19.
 */
var wxConfig = require('./wx');
var util = require('util');
module.exports = {
    client_credential_url:util.format('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s',wxConfig.appid,wxConfig.appsecret)
};
