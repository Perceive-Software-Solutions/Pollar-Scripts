const MigrateSingleton = require('../singleton');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting Post Stats...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var userIDs = migrationSingleton.userInfoIDMap;
  var postIDs = migrationSingleton.postIDMap;

  //Transform like sinto post stats
  for(like of data.likes){

    var result = conn.query(`INSERT INTO PostStat (userInfoID, postID, PIT, liked) VALUES (${userIDs[like.userInfoId.$oid]}, ${postIDs[like.postId.$oid]}, NOW(), 1)`);

    glob.reportProgress(like, data.likes, modulus=5);
  }

  console.log("✓ Sucessful Post Stats Export");

}