const MigrateSingleton = require('../singleton');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

    console.log("Exporting Notifs...");

    const migrationSingleton = new MigrateSingleton().getInstance();

    var notifIDs = migrationSingleton.notificationIDMap;

    //Parse notifs into exportable objects
    for (notif of data.notifications) {
        var tID = 0;
        switch (notif.type["type"]) {
            case "poll":
                tID = migrationSingleton.pollIDMap[notif.typeId];
                break;
            case "post":
                tID = migrationSingleton.postIDMap[notif.typeId];
                break;
            case "trust":
                tID = migrationSingleton.topicIDMap[notif.typeId];
                break;
            case "chat":
                tID = migrationSingleton.chatIDMap[notif.typeId];
                break;
            case "userInfo":
                tID = migrationSingleton.userInfoIDMap[notif.typeId];
                break;
            default:
                continue;
        }
        
        tID = !tID ? null : tID;

        var result = conn.query(`INSERT INTO Notif (userInfoID, parent, child, notifType, typeID, subjectNotif, seen) 
            VALUES (${migrationSingleton.userInfoIDMap[notif.userInfoId.$oid]}, "${notif.type["parent"]}", "${notif.type["child"]}", "${notif.type["type"]}", ${tID}, "${notif.subject}", ${notif.viewed})`);

        //Extract id from result
        id = result.insertId;

        tempMap = {};
        
        for (actID of notif.actorId) {
            if(!tempMap[actID.$oid]){
                tempMap[actID.$oid] = true;
                conn.query(`INSERT INTO NotifActor (notifID, actorID, PIT) 
                VALUES (${id}, ${migrationSingleton.userInfoIDMap[actID.$oid]}, "${glob.toMySQLDateTime(notif.date.$date)}")`);

            }

        }

        //Map mongo and mysql ids
        notifIDs[notif._id.$oid] = id;

        glob.reportProgress(notif, data.notifications, modulus = 5);

    }

    //Export the notifID map
    migrationSingleton.notificationIDMap = notifIDs;

    console.log("✓ Sucessful Notif Export");

}