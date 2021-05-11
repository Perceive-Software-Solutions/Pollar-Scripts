const MigrateSingleton = require('../singleton');
const MigrateAsset = require('./asset-migrate');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting Polls...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var pollIDs = migrationSingleton.pollIDMap;

  //Parse polls into exportable objects
  for(poll of data.polls){ //TODO Put in assetID
    var pollAss = null;
    if(poll.image!=null){
        pollAss = MigrateAsset.MigrateAsset(conn, [poll.image], 0);
    }
    var realPollAss = pollAss == null ? null : `"${pollAss}"`;

    var result = conn.query(`INSERT INTO Poll (userInfoID, topicID, assetID, title, content, PIT, pollStatus, pollType, anon, draft) 
        VALUES (${migrationSingleton.userInfoIDMap[poll.userInfoId.$oid]}, ${migrationSingleton.topicIDMap[poll.topicId.$oid]}, ${realPollAss}, "${poll.title}", "${poll.content}", "${glob.toMySQLDateTime(poll.timeSubmitted.$date)}", "${poll.status}", '${poll.type}', ${poll.anonymous}, ${poll.draft})`);

    //Extract id from result
    id = result.insertId;

    //Map mongo and mysql ids
    pollIDs[poll._id.$oid] = id;

  }

  //Export the pollId map
  migrationSingleton.pollIDMap = pollIDs;

  console.log("✓ Sucessful Poll Export");

}