const MigrateSingleton = require('../singleton');
const glob = require('../global-functions');


module.exports = async (conn, data) => {

  console.log("Exporting NotificationSettings...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  // userSettingID to userMainID
  var uSet2uMain = {};

  for(uSetting of data.usersettings){
    uSet2uMain[uSetting._id.$oid] = uSetting.userMainId.$oid;
  }

  migrationSingleton.userSettingID2userMainID = uSet2uMain;

  //Parse NotificationSettings into exportable objects
  for(notifSet of data.notificationsettings){
    
    conn.query(`INSERT INTO NotificationSettings (userMainID, POSTS_LIKES, POSTS_NEW_TRUSTS, POSTS_FIRST_POSTS, POSTS_REPLIES, 
            POSTS_VOTES, POLLS_ACCEPTED_POLL_SUBMISSION, POLLS_EXPIRE_SOON, POLLS_RESULTS, POLLS_TRENDING, MESSAGES_MESSAGE, MESSAGES_REQUEST, 
            MESSAGES_GROUP_REQUEST, FOLLOWS_NEW_FOLLOW, FOLLOWS_NEW_FRIEND, TRUSTS_TRUST, TRUSTS_TRUSTING) 
            VALUES (${migrationSingleton.userMainIDMap[uSet2uMain[notifSet.userSettingId.$oid]]}, "${num2enum(notifSet.posts["likes"])}", "${num2enum(notifSet.posts["newTrusts"])}", "${num2enum(notifSet.posts["firstPosts"])}", "${num2enum(notifSet.posts["replies"])}", 
            "FOLLOWERS", ${notifSet.polls["acceptedPollSubmissions"]}, ${notifSet.polls["pollsExpireSoon"]}, ${notifSet.polls["pollResults"]}, ${notifSet.polls["trendingPolls"]}, ${notifSet.messages["messages"]}, ${notifSet.messages["messageRequests"]}, 
            ${notifSet.messages["groupRequests"]}, ${notifSet.follows["newFollowers"]}, ${notifSet.follows["friendsOnPollar"]}, ${notifSet.trusts["trusts"]}, ${notifSet.trusts["trusting"]})`);

    glob.reportProgress(notifSet, data.notificationsettings, modulus=5);

  }

  console.log("✓ Sucessful NotificationSettings Export");

}

//helper function
//takes [0,1,2] and returns notif settings enum strings
function num2enum (n) {
    if(n==2){
        return "EVERYONE";
    }else if (n==1){
        return "FOLLOWERS";
    }else{
        return "OFF";    
    }
}