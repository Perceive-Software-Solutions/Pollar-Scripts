const MigrateSingleton = require('../singleton');

module.exports = async (conn, data) => {

  console.log("Exporting UserInfo...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var userIDs = migrationSingleton.userIDMap;

  //Parse user infos into exportable objects
  for(user of data.userinfos){
    var result = conn.query(`INSERT INTO UserInfo (firstName, lastName, gender, username) VALUES ('${user.firstName}', '${user.firstName}', '${user.gender}', '${user.username}')`);

    //Extract id from result
    id = result.insertId;

    //Map mongo and mysql ids
    userIDs[user._id.$oid] = id
    console.log(result);
  }

  //Export the userId map
  migrationSingleton.userIDMap = userIDs;

  console.log("✓ Sucessful UserInfo Export");

}