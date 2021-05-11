const MigrateSingleton = require('../singleton');

module.exports = async (conn, data) => {

    console.log("Exporting Chat Memberships...");

    const migrationSingleton = new MigrateSingleton().getInstance();

    //Parse chat Memberships into exportable objects
    for (chat of data.chats) {
        var userz = {};
        for (var user of chat.users) {
            userz[user.$oid] = {
                readReceipts: chat.sendReadReceipts[user.$oid] != undefined ? chat.sendReadReceipts[user.$oid] : null,
                notifications: chat.notificationsEnabled[user.$oid] != undefined ? chat.notificationsEnabled[user.$oid] : null,
                accepted: chat.chatAccepted[user.$oid] != undefined ? chat.chatAccepted[user.$oid] : null
            };
        }
        for (var m in userz) {
            await conn.query(`INSERT INTO ChatMembership (userInfoID, channelID, accepted, readReceipts, notifications) 
                VALUES (${migrationSingleton.userInfoIDMap[m]}, "${chat.channel}", ${userz[m].accepted}, ${userz[m].readReceipts}, ${userz[m].notifications})`);
        }
        console.log("   another 1");
    }

    console.log("✓ Sucessful Chat Membership Export");

}