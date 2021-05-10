var mysql = require('sync-mysql');
require('dotenv').config();
var parse_json = require('./components/json-parser');
var migrate = require('./components/migration-helper');

async function run(){
  //Creating a connection with the MySQL instance
  var connection = new mysql({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT,
    database : process.env.RDS_DB_NAME,
    ssl      : "Amazon RDS",
  });

  console.log('Connected to database.');

  //Retreive Files
  console.log('Loading Files');
  data = await parse_json();

  //Run the migration functions
  console.log('Running Migration.');
  await migrate(connection, data);

  //CLoses the server on a complete migration
  console.log('Migration Complete.');
}

run();

// //Connect to the instance
// connection.connect(async function(err) {
//   if (err) {
//     console.error('Database connection failed: ' + err.stack);
//     return;
//   }

  
//   connection.end();

// });

