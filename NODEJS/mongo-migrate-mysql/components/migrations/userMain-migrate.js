const MigrateSingleton = require('../singleton');

module.exports = async (conn, data) => {

  console.log("Exporting UserMain...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var userIDs = migrationSingleton.userMainIDMap;

  var main2Settings = {};

  for(user of data.usersettings){
    main2Settings[user.userMainId.$oid] = user;
  }

  //Parse user mains into exportable objects
  for(user of data.usermains){
    var result = conn.query(`INSERT INTO UserMain (userInfoID, hashedPassword, readReceipts, contactsSynced) VALUES (${migrationSingleton.userInfoIDMap[migrationSingleton.userMain2Info[user._id.$oid]]}, '${user.password}', ${main2Settings[user._id.$oid].sendReadReceipts}, ${main2Settings[user._id.$oid].contactsSynced})`);

    //Extract id from result
    id = result.insertId;

    //Map mongo and mysql ids
    userIDs[user._id.$oid] = id
    
  }

  //Export the userId map
  migrationSingleton.userMainIDMap = userIDs;

  console.log("✓ Sucessful UserMain Export");

}