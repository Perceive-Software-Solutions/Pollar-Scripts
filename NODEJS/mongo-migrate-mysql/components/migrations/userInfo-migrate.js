const MigrateSingleton = require('../singleton');

module.exports = async (conn, data) => {

  console.log("Exporting UserInfo...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var userIDs = migrationSingleton.userInfoIDMap;

  //Parse user infos into exportable objects
  for(user of data.userinfos){
    var result = conn.query(`INSERT INTO UserInfo (firstName, lastName, gender, username) VALUES ('${user.firstName}', '${user.lastName}', ${user.gender == null ? null : `'${user.gender}'`}, '${user.username}')`);

    //Extract id from result
    id = result.insertId;

    //Map mongo and mysql ids
    userIDs[user._id.$oid] = id

    //Map userMain-ids to userInfo-ids
    migrationSingleton.userMain2Info[user.userMainId.$oid] = user._id.$oid;
  }

  //Export the userId map
  migrationSingleton.userInfoIDMap = userIDs;

  console.log("✓ Sucessful UserInfo Export");

}