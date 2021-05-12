const MigrateSingleton = require('../singleton');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting Poll Response...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var userIDs = migrationSingleton.userInfoIDMap;
  var pollIDs = migrationSingleton.pollIDMap;

  var visitedResponses = {};

  //Parse poll responses
  for(response of data.pollresponses){

    var responseID = `${userIDs[response.userInfoId.$oid]}-${pollIDs[response.pollId.$oid]}`;

    //Skip duplicate poll responses
    if(!visitedResponses[responseID]){
      visitedResponses[responseID] = true;
      var result = conn.query(`INSERT INTO PollResponse (userInfoID, pollID, modifiedBy, vote, PIT) VALUES (${userIDs[response.userInfoId.$oid]}, ${pollIDs[response.pollId.$oid]}, ${userIDs[response.modifiedBy.$oid]}, ${response.vote}, "${glob.toMySQLDateTime(response.createdAt.$date)}")`);
    }


    glob.reportProgress(response, data.pollresponses, modulus=5);
  }

  console.log("✓ Sucessful Poll Response Export");

}