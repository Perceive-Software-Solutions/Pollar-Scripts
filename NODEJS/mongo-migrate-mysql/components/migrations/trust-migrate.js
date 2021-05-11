const MigrateSingleton = require('../singleton');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting Trusts...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  //Parse trusts into exportable objects
  for(trust of data.trusts){
    conn.query(`INSERT INTO Trust (userInfoID, recipientID, topicID, cachedAgrees, cachedDisagrees) 
        VALUES (${migrationSingleton.userInfoIDMap[trust.userInfoID.$oid]}, ${migrationSingleton.userInfoIDMap[trust.recipientId]}, ${trust.topicID}, ${trust.cachedAgreeCount == null || trust.cachedAgreeCount == undefined ? 0 : trust.cachedAgreeCount}, ${trust.cachedDisagreeCount == null || trust.cachedDisagreeCount == undefined ? 0 : trust.cachedDisagreeCount})`);

    glob.reportProgress(trust, data.trusts, modulus=5);

  }


  console.log("✓ Sucessful Trust Export");

}