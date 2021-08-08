const MigrateSingleton = require('../singleton');
const MigrateAsset = require('./asset-migrate');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting UserInfo...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var userIDs = migrationSingleton.userInfoIDMap;

  //Parse user infos into exportable objects
  for(user of data.userinfos){
    
    var profilePicture = null
    if(user.image != null){
      profilePicture = await MigrateAsset.MigrateAsset(conn, [user.image], 0, quiet = true);
    }
    
    var gender = user.gender == null ? null : `'${user.gender}'`;
    var userProfile = profilePicture == null ? null : `'${profilePicture}'`;
    var result = conn.query(`INSERT INTO UserInfo (firstName, lastName, gender, username, profilePicture) VALUES ('${user.firstName}', '${user.lastName}', ${gender}, '${user.username}', ${userProfile})`);

    //Extract id from result
    id = result.insertId;

    //Map mongo and mysql ids
    userIDs[user._id.$oid] = id;

    //Map userMain-ids to userInfo-ids
    migrationSingleton.userMain2Info[user.userMainId.$oid] = user._id.$oid;

    glob.reportProgress(user, data.userinfos, modulus=5);
  }

  //Export the userId map
  migrationSingleton.userInfoIDMap = userIDs;

  console.log("✓ Sucessful UserInfo Export");

}