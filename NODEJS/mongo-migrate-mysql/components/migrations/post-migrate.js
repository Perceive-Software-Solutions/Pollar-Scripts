const MigrateSingleton = require('../singleton');
const MigrateAsset = require('./asset-migrate');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting Posts...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var postIDs = migrationSingleton.postIDMap;

  //Parse posts into exportable objects
  for(post of data.posts){

    var postGif = null;
    var postImage = null;
    var postLink = null;
    if(post.images.length > 0){
      postImage = await MigrateAsset.MigrateAsset(conn, post.images, 0, quiet = true);
    }
    else if(post.video != null && post.video != ""){
      postImage = await MigrateAsset.MigrateAsset(conn, [post.video], 1, quiet = true);
    }
    else if(post.links != null && post.links.length > 0){
      postLink = await MigrateAsset.MigrateAsset(conn, post.links, 3, quiet = true);
    }
    else if(post.gif != null && post.gif != ""){
      postGif = await MigrateAsset.MigrateAsset(conn, [post.gif], 2, quiet = true);
    }

    var postAsset = postImage != null ? `"${postImage}"` : postLink != null ? `"${postLink}"` : postGif != null ? `"${postGif}"` : null;
    var parentID = post.parentId == null ? null : post.parentType == "poll" ? migrationSingleton.pollIDMap[post.parentId.$oid] : null;
    var vote = !post.vote ? null : post.vote

    var result = conn.query(`INSERT INTO Post (userInfoID, parentTopicID, parentPollID, parentType, collectionID, messageText, vote, PIT, cachedLikes, isHidden) 
        VALUES (${migrationSingleton.userInfoIDMap[post.userInfoId.$oid]}, ${migrationSingleton.topicIDMap[post.parentTopic.$oid]}, ${parentID}, "${post.parentType}", ${postAsset}, '${post.message.replace(/\"/g, '"').replace(/'/g, "\\'")}', ${vote}, "${glob.toMySQLDateTime(post.timeSubmitted.$date)}", ${post.cachedLikeCount}, ${post.hidden})`);

    //Extract id from result
    id = result.insertId;

    //Map mongo and mysql ids
    postIDs[post._id.$oid] = id;

    glob.reportProgress(post, data.posts, modulus=5);

  }

  //Export the postId map
  migrationSingleton.postIDMap = postIDs;

  console.log("✓ Sucessful Posts Export");

}