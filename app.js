/**
 * Created by lyh_o on 2017/5/18.
 */
var https = require('https');
var iconv = require("iconv-lite");
var express = require('express');
var swig = require('swig');
var util = require('util');
var bodyParser = require('body-parser');
var path = require('path');
var Cookies = require('cookies');
var srv = require('./config/server');
var wxUrl = require('./config/wx_url');

var app = express();
app.use('/public',express.static(path.join(__dirname,'public')));
swig.setDefaults({cache:false});
app.set('view engine','html');
app.set('views','./views');
app.use(bodyParser.urlencoded({extend:true}));
app.engine('html',swig.renderFile);

app.use(function (req,res,next) {
    req.cookies = new Cookies(req,res);
    if(req.cookies.get('client_credential')){
        console.log('获取cookies client_credential');
        try{
            var jsonCookies = JSON.parse(req.cookies.get('client_credential'));
            var expires_date = new Date(jsonCookies.expires_date);
            var current = new Date();
            if(expires_date.getTime()>current.getTime()) {
                req.client_credential = jsonCookies;
                next();
            }else{
                console.log('cookies client_credential已过期');
                req.client_credential = null;
            }
        }catch (e){
            console.log(e);
            next();
        }
    }
    if(!req.client_credential){
        console.log('重新设置cookies client_credential');
        https.get(wxUrl.client_credential_url, function (response) {
            var datas = [];
            var size = 0;
            response.on('data', function (data) {
                datas.push(data);
                size += data.length;
            });
            response.on("end", function () {
                var buff = Buffer.concat(datas, size);
                var result = buff.toString(); // iconv.decode(buff, "utf8");// 转码； var result = buff.toString();//不需要转编码,直接tostring
                var json = JSON.parse(result);
                var date = new Date();
                var expireSeconds = json.expires_in;
                date.setTime(date.getTime()+expireSeconds*1000);
                // 设置cookies保存access_token及过期时间
                req.cookies.set('client_credential',JSON.stringify({
                    access_token : json.access_token,
                    expires_date : date
                }));
                next();
            });
        }).on("error", function (err) {
            console.log(err.stack);
            // callback.apply(null);
            next();
        });
    }
});

app.use('/',require('./routers/index'));
app.use('/api',require('./routers/api'));
app.listen(srv.port,srv.host,function (err) {
    if(err)
        console.log(err);
    console.log('服务已启动，正在监听%s:%s端口...',srv.host,srv.port);
});

