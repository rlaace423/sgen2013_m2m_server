/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var routesLogin = require('./routes/login');
var routesJoin = require('./routes/join');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: 'secret', key: 'express.sid'}));
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
// app.get('/users', user.list);
/* insert by me */
app.post('/login', routesLogin.login);
app.post('/join', routesJoin.join);

var server = http.createServer(app).listen(app.get('port'), function(){
	   console.log("Express server listening on port " + app.get('port'));
	});

//socket io위해
var io = require('socket.io').listen(server);

//log level 수정
io.set('log level', 2);

var users = {};

io.sockets.on('connection', function(socket) {
	
	//프로필을 각 소켓마다 저장
	socket.on('set profile',function(data){
		socket.set('nickname',data.nickname,function(){
			socket.set('age',data.age,function(){
				var user = {};
				user.socket_id = socket.id;
				users[data.nickname] = user;
				socket.emit('profile ready');
			});
		});
	});
	
	//접속자 정보 요청
	socket.on('get users',function(){
		for( var socket_id in io.sockets.sockets){
			io.sockets.sockets[socket_id].get('nickname',function(err,nickname){
				io.sockets.sockets[socket_id].get('age',function(err,age){
					var user = {};
					user.nickname = nickname;
					user.age = age;
					//접속자 정보 전송
					socket.emit('user profile',user);
				});
			});
		}
	});
	
	socket.on('talk request',function(data){
		
	});
});

