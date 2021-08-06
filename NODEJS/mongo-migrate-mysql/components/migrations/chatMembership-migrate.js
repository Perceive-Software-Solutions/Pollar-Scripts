const MigrateSingleton = require('../singleton');
const glob = require('../global-functions');

/**
 * @deprecated Chats no longer being migrated.
 */
module.exports = async (conn, data) => {

    console.log("Exporting Chat Memberships...");

    const migrationSingleton = new MigrateSingleton().getInstance();

    //Parse chat Memberships into exportable objects
    for (chat of data.chats) {
        var userz = {};
        for (var user of chat.users) {
            userz[user.$oid] = {
                readReceipts: chat.sendReadReceipts[user.$oid] != undefined ? chat.sendReadReceipts[user.$oid] : 1,
                notifications: chat.notificationsEnabled[user.$oid] != undefined ? chat.notificationsEnabled[user.$oid] : 1,
                accepted: chat.chatAccepted[user.$oid] != undefined ? chat.chatAccepted[user.$oid] : 0
            };
        }
        for (var m in userz) {
            await conn.query(`INSERT INTO ChatMembership (userInfoID, channelID, accepted, readReceipts, notifications) 
                VALUES (${migrationSingleton.userInfoIDMap[m]}, ${chat.channel}, ${userz[m].accepted}, ${userz[m].readReceipts}, ${userz[m].notifications})`);
        }
        
        glob.reportProgress(chat, data.chats, modulus=5);
    }

    console.log("✓ Sucessful Chat Membership Export");

}