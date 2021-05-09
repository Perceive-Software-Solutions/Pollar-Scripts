var mysql = require('mysql');
var parse_json = require('./components/json-parser');

//Creating a connection with the MySQL instance
var connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT
});

//Connect to the instance
connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');

});


//Retreive Files
console.log('Loading Files');
await parse_json();


//Run the migration functions
console.log('Running Migration.');


console.log('Migration Complete.');

connection.end();
