const MigrateSingleton = require('../singleton');
const MigrateAsset = require('./asset-migrate');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting Polls...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var pollIDs = migrationSingleton.pollIDMap;

  //Parse polls into exportable objects
  for(poll of data.polls){ //TODO Put in assetID

    var pollGif = null;
    var pollImage = null;
    var pollLink = null;
    if(poll.images.length > 0){
      pollImage = MigrateAsset.MigrateAsset(conn, poll.images, 0, quiet = true);
    }
    else if(poll.video != null){
      pollImage = MigrateAsset.MigrateAsset(conn, [poll.video], 1, quiet = true);
    }
    else if(poll.links.length > 0){
      pollLink = MigrateAsset.MigrateAsset(conn, poll.links, 3, quiet = true);
    }
    else if(poll.gif != null){
      pollGif = MigrateAsset.MigrateAsset(conn, [poll.gif], 2, quiet = true);
    }

    var pollAsset = pollImage != null ? `"${pollImage}"` : pollLink != null ? `"${pollLink}"` : pollGif != null ? `"${pollGif}"` : null;

    var result = conn.query(`INSERT INTO Poll (userInfoID, topicID, collectionID, title, content, PIT, pollStatus, pollType, anon, draft) 
        VALUES (${migrationSingleton.userInfoIDMap[poll.userInfoId.$oid]}, ${migrationSingleton.topicIDMap[poll.topicId.$oid]}, ${pollAsset}, "${poll.title}", '${poll.content.replace(/\"/g, '"').replace(/'/g, "\\'")}', "${glob.toMySQLDateTime(poll.timeSubmitted.$date)}", "${poll.status}", '${poll.type}', ${poll.anonymous}, ${poll.draft})`);

    //Extract id from result
    id = result.insertId;

    //Map mongo and mysql ids
    pollIDs[poll._id.$oid] = id;

    glob.reportProgress(poll, data.polls, modulus=5);

  }

  //Export the pollId map
  migrationSingleton.pollIDMap = pollIDs;

  console.log("✓ Sucessful Poll Export");

}