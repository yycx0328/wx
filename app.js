/**
 * Created by lyh_o on 2017/5/18.
 */
var https = require('https');
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
        try{
            req.client_credential = JSON.parse(req.cookies.get('client_credential'));
        }catch (e){
            console.log(e);
        }
    }
    if(!req.client_credential){
        console.log('未获取到保存的client_credential');
        console.log(wxUrl.client_credential_url);
        https.get(wxUrl.client_credential_url,function (request,response) {
            console.log('111');
            var result='';
            req.on('data',function(data){
                console.log('222');
                result+=data;
            });
            req.on('end',function(){
                console.log(result);
                var json = JSON.stringify(result);
                var date = new Date();
                var expireSeconds = json.expires_in;
                date.setTime(date.getTime()+expireSeconds*1000);

                // 设置cookies保存access_token及过期时间
                req.cookies.set('client_credential',JSON.stringify({
                    access_token : json.access_token,
                    expires_date : date
                }));
            });
        });
    }
    next();
});

app.use('/',require('./routers/index'));
app.use('/api',require('./routers/api'));
app.listen(srv.port,srv.host,function (err) {
    if(err)
        console.log(err);
    console.log('服务已启动，正在监听%s:%s端口...',srv.host,srv.port);
});

