const MigrateSingleton = require('../singleton');
const MigrateAsset = require('./asset-migrate');
const glob = require('../global-functions');
const PubNub = require('pubnub');

async function getTimeToken(pubnub, channel){

  history = await pubnub.fetchMessages({
      channels: [channel],
      count: 1,
      stringifiedTimeToken: true
  });

  if(Object.keys(history['channels']).length === 0)
    return null;

  return history['channels'][channel.replace(/ /g, "%20").replace(/:/g, "%3A")][0]['timetoken'];

}

module.exports = async (conn, data) => {

  console.log("Exporting Chats...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var chatIDs = migrationSingleton.chatIDMap;

  //Define pubnub to retreive last time token
  const pubnub = new PubNub({
    publishKey   : process.env.PUB_KEY,
    subscribeKey : process.env.SUB_KEY,
    uuid         : "db-export-tool"
  })

  //Parse chats into exportable objects
  for(chat of data.chats){

    var timeToken = await getTimeToken(pubnub, chat.channel);

    if(timeToken == null)
      timeToken = 0

    var chatImg = null;
    if(chat.image!=null){
        chatImg = MigrateAsset.MigrateAsset(conn, [chat.image], 0); //TODO check the 0 here and change timeToken, also where r the chat names
    }
    var realChatImg = chatImg == null ? null : `"${chatImg}"`;
    var chatName = !chat.chatName ? null : `"${chat.chatName}"`;
    //TODO: DO THIS
    var result = conn.query(`INSERT INTO Chat (channelID, collectionID, chatName, timeToken, groupChat) 
        VALUES ("${chat.channel}", ${realChatImg}, ${chatName}, ${timeToken}, ${chat.groupChat})`);

    //Extract id from result
    id = result.insertId;

    //Map mongo and mysql ids
    chatIDs[chat._id.$oid] = id;

    glob.reportProgress(chat, data.chats, modulus=5);

  }
  
  //Export the chatID map
  migrationSingleton.chatIDMap = chatIDs;

  console.log("✓ Sucessful Chat Export");

}