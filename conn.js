var mysql = require("mysql");
var conn = mysql.createConnection({
	//options
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'node_test'

});

conn.connect(function(error){
		if (error){
			console.log(error);
			
		}else{
			console.log('connected');
		}
});

module.exports = conn;