const MigrateSingleton = require('../singleton');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting Notifs...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var notifIDs = migrationSingleton.notificationIDMap;

  //Parse notifs into exportable objects
  for(notif of data.notifications){ //TODO talk about notifType, list of actorID, map of type, typeID, 
    var result = conn.query(`INSERT INTO Notif (userInfoID, actorID, notifType, typeID, subjectNotif, PIT, seen) 
        VALUES (${migrationSingleton.userInfoIDMap[notif.userInfoId.$oid]}, ${notif.}, "${notif.}", ${notif.}, "${notif.subject}", "${glob.toMySQLDateTime(notif.date.$date)}", ${notif.viewed})`);

    //Extract id from result
    id = result.insertId;

    //Map mongo and mysql ids
    notifIDs[notif._id.$oid] = id;

    glob.reportProgress(notif, data.notifications, modulus=5);

  }

  //Export the notifID map
  migrationSingleton.notificationIDMap = notifIDs;

  console.log("✓ Sucessful Notif Export");

}