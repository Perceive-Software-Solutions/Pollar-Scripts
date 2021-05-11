const MigrateSingleton = require('../singleton');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting Subscriptions...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var userIDs = migrationSingleton.userInfoIDMap;
  var topicIDs = migrationSingleton.topicIDMap;

  //Parse poll responses
  for(sub of data.subscriptions){

    var result = conn.query(`INSERT INTO Subscription (userInfoID, topicID, PIT) VALUES (${userIDs[sub.userInfoId.$oid]}, ${topicIDs[sub.topicId.$oid]}, NOW())`);

    glob.reportProgress(sub, data.subscriptions, modulus=5);
  }

  console.log("✓ Sucessful Subscription Export");

}