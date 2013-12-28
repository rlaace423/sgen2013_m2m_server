var fs = require('fs');
var mysql = require('mysql');

exports.login = function(req, res){
	res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
	try
	{
		// json ���� �� �����͸� �Ľ�.
		var email = req.body.email;
		var pw = req.body.pw;

		console.log("input email: "+email);
		console.log("input pw: "+pw);

		// mysql ���� ã��
		var client = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'tkdgh3426'
		});

		// �α��� ����, ���� ���θ� �˷���.
		client.query('use sgen');
		client.query('select * from user where email=? and pw=?',
			[email, pw],
			function(error, result, fields) {
				if(error) {
					console.log('there\'s error in query!!');
					console.log(error);
				}

				else {
					console.log(JSON.stringify(result));

					// 0, 1, 2�� case dealing
					var jsonStr = '';
					console.log('result.length = '+result.length);
					if(result.length==0) {
						jsonStr = '{"code":1}';
						res.end(jsonStr);
					}
					else if(result.length==1) {
						// session ����
						req.session.email = result[0].email;
						jsonStr = '{"code":2,"result":'+JSON.stringify(result)+'}';
						res.end(jsonStr);
					}
					else {
						// �̰� ū�ϳ��� ��� �Ф�
						jsonStr = '{"code":3}';
						res.end(jsonStr);
					}
				}
		});





	}
	catch (err)	{	console.log(err);	}
};