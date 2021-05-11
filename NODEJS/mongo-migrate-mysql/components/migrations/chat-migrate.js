const MigrateSingleton = require('../singleton');
const MigrateAsset = require('./asset-migrate');

module.exports = async (conn, data) => {

  console.log("Exporting Chats...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var chatIDs = migrationSingleton.chatIDMap;

  //Parse chats into exportable objects
  for(chat of data.chats){
    var chatImg = null;
    if(chat.image!=null){
        chatImg = MigrateAsset.MigrateAsset(conn, [chat.image], 0); //TODO check the 0 here and change timeToken, also where r the chat names
    }
    var realChatImg = chatImg == null ? null : `"${chatImg}"`;
    //TODO: DO THIS
    var result = conn.query(`INSERT INTO Chat (channelID, assetID, chatName, timeToken, groupChat) 
        VALUES ("${chat.channel}", ${realChatImg}, null, 0, ${groupChat})`);

    //Extract id from result
    id = result.insertId;

    //Map mongo and mysql ids
    chatIDs[chat._id.$oid] = id;

  }
  
  //Export the chatID map
  migrationSingleton.chatIDMap = chatIDs;

  console.log("✓ Sucessful Chat Export");

}