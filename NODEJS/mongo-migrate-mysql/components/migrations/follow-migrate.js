const MigrateSingleton = require('../singleton');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting Follow...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var userIDs = migrationSingleton.userInfoIDMap;

  //Parse follows and map user info ids
  for(follow of data.follows){

    var result = conn.query(`INSERT INTO Follow (userInfoID, recipientID, PIT) VALUES (${userIDs[follow.userInfoId.$oid]}, ${userIDs[follow.recipientId.$oid]}, NOW())`);

    glob.reportProgress(follow, data.follows, modulus=5);
  }
  
  console.log("✓ Sucessful Follow Export");

}