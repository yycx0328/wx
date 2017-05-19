/**
 * Created by lyh_o on 2017/5/18.
 */
var express = require('express');
var swig = require('swig');
var util = require('util');
var bodyParser = require('body-parser');
var path = require('path');
var Cookies = require('cookies');
var srv = require('./config/server');

var app = express();
app.use('/public',express.static(path.join(__dirname,'public')));
swig.setDefaults({cache:false});
app.set('view engine','html');
app.set('views','./views');
app.use(bodyParser.urlencoded({extend:true}));
app.engine('html',swig.renderFile);

app.use('/',require('./routers/index'));
app.use('/api',require('./routers/api'));
app.listen(srv.port,srv.host,function (err) {
    if(err)
        console.log(err);
    console.log('服务已启动，正在监听%s:%s端口...',srv.host,srv.port);
});

