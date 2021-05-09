var mysql = require('mysql');
require('dotenv').config();
var parse_json = require('./components/json-parser');
var migrate = require('./components/migration-helper');

//Creating a connection with the MySQL instance
var connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  ssl      : "Amazon RDS",
});

//Connect to the instance
connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');

  //Retreive Files
  console.log('Loading Files');
  data = parse_json();

  //Run the migration functions
  console.log('Running Migration.');
  migrate(connection, data);

  //CLoses the server on a complete migration
  console.log('Migration Complete.');
  connection.end();

});

