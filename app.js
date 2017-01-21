var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var conn = require("./conn");
var bcrypt = require('bcryptjs');
//var salt = bcrypt.genSaltSync(10);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(function(req, res, next){    
	console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	next();	
});

app.use(express.static("./www"));
app.use(cors());

//services api
app.get("/api", function(req, res){
	
	conn.query("SELECT * FROM services", function(error, rows, fields){
		if(error){
			console.log(error);
		}else{
			console.log(rows);
			res.json(rows)
		}
	});
});
//closest shop api
app.get("/api3", function(req, res,next){
	console.log(req.query.lat);
	console.log(req.query.long);
	var lat = req.query.lat;
	var lng = req.query.long;
	conn.query("SELECT agents.agent_reg_id,agents.agent_name, agents.agent_add, agents.agent_img2, a_m.id, a_m.latitude, a_m.longitude, TRUNCATE(( 3959 * acos( cos( radians(?) ) * cos( radians( a_m.latitude ) ) * cos( radians( a_m.longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( a_m.latitude ) ) ) ),1) AS distance FROM agents INNER JOIN a_m on agents.agent_reg_id =a_m.agent_reg_id ORDER BY distance LIMIT 0,5", [lat, lng, lat], function(error, rows, fields){
		if(error){
			console.log(error);
		}else{
			console.log(rows);
			res.json(rows)
		}
	});
});






app.post("/signup", function(req, res){
	console.log(req.body); 
	var username=req.body.username;
	var pass    =req.body.password;
	var f_name    =req.body.fullname;
	var msisdn    =req.body.msisdn;
	//console.log(pass);
	
	conn.query('SELECT * FROM users WHERE msisdn = ?', [msisdn], function(error, rows, fields){
		
		
		if(!error){
			
			bcrypt.genSalt(10, function(err, salt) {
				if(err){
					console.error(err);
				}
				bcrypt.hash(pass, salt, function(err, hash) {
					console.log(hash);
					console.log(pass);
					var db = hash;
					
					//insert statement
					var credentials  = {f_name:f_name, password: hash,username:username,msisdn:msisdn};
					conn.query('INSERT INTO users SET ?', credentials, function(error, rows, fields){
						if(error){
							console.log(error);
						}else{
							console.log(rows);
							res.send('success');
						}
					});
				});
			});
			
		}else if(rows.length){
			//console.log(rows);
			 res.send('exist');
		}else{
			console.log('we will input the thing here');
			console.log(error);
			//console.log(username);
			res.send('failed');
		}
	}); 
});
app.post("/login", function(req, res){
	//console.log(req.body.username); 
	var username=req.body.username;
	var pass    =req.body.password;
	//console.log(pass);
	conn.query('SELECT * FROM users WHERE username = ?', [username], function(error, rows, fields){
		if(rows.length){
			console.log(rows);
			var enc_pass= rows[0].password;
			
			 // Load hash from your password DB. 
				bcrypt.compare(pass, enc_pass, function(err, stat) {
					// res == true 
					console.log(stat);
					
					if(stat == true){
						res.json(rows);
					}else{
						res.send('wrong');
					}
				});
		}else if(!rows.length){
			console.log('User not Found');
			res.send('not');
		}else{
			console.log(error);
			res.send('error');
		}
	}); 
});
app.listen(3000);

console.log("app runing on port 3000");

module.exports = app;