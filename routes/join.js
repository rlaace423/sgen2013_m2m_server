var fs = require('fs');
var mysql = require('mysql');

exports.join = function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
	try
	{
		// json 으로 온 데이터를 파싱.
		var email = req.body.email;
		var pw = req.body.pw;
		var nick = req.body.nick;
		var age = req.body.age;

		console.log("input email: "+email);
		console.log("input pw: "+pw);
		console.log("input nick: "+nick);
		console.log("input age: "+age);

		//res.charset = "utf-8";
		res.end("input email: "+email
		+"<br>"+"input pw: "+pw 
		+"<br>"+"input nick: "+nick 
		+"<br>"+"input age: "+age);

		// mysql 에서 찾기
		var client = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'tkdgh3426'
		});

		// db 접속
		client.query('use sgen');
		client.query('set names utf8');
		client.query('select * from user where email=?',
			[email],
			function(error, result, fields) {
				if(error) {
					console.log('there\'s error in query!!');
					console.log('ErrMsg: '+ error);
				}

				else {
					console.log(JSON.stringify(result));

					// 0, 1, 2명 case dealing
					var jsonStr = '';
					console.log('result.length = '+result.length);
					if(result.length==0) {
						// db에 insert
						client.query('INSERT INTO user (`email`, `pw`, `nick`, `age`, `reg_date`) VALUES (?, ?, ?, ?, NOW())',
							[email, pw, nick, age],
							function(error, result) {
								// insert 실패
								if(error) {
									jsonStr = '{"code":102}';
									res.end(jsonStr);
								}
								// insert 성공
								else {
									jsonStr = '{"code":101}';
									res.end(jsonStr);
								}
						});
					}
					// 이미 존재하는 email
					else {
						jsonStr = '{"code":103}';
						res.end(jsonStr);
					}
				}
		});
		
	}
	catch (err)	{	console.log(err);	}
};