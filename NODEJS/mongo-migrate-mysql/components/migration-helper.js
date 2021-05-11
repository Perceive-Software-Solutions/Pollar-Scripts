const userInfoMigrate = require('./migrations/userInfo-migrate');
const userMainMigrate = require('./migrations/userMain-migrate');
const categoryMigrate = require('./migrations/category-migrate');
const topicMigrate = require('./migrations/topic-migrate');
const pollMigrate = require('./migrations/poll-migrate');
const chatMigrate = require('./migrations/chat-migrate');
const chatMembershipMigrate = require('./migrations/chatMembership-migrate');
const postMigrate = require('./migrations/post-migrate');
const followMigrate = require('./migrations/follow-migrate');
const pollResponseMigrate = require('./migrations/pollresponse-migrate');
const postStatMigrate = require('./migrations/poststat-migrate');
const subscriptionMigrate = require('./migrations/subscription-migrate');
const notifSettingMigrate = require('./migrations/notifSetting-migrate');
const trustMigrate = require('./migrations/trust-migrate');


module.exports = async (conn, data) => {
  //Calls all the migrate functions

  //Migrate categories
  await categoryMigrate(conn, data);

  //Migrate topics
  await topicMigrate(conn, data);
  
  //Migrate user infos
  await userInfoMigrate(conn, data);

  //Migrate user mains
  await userMainMigrate(conn, data);

  //Migrate polls
  await pollMigrate(conn, data);
  
  //Migrate posts
  await postMigrate(conn, data);

  //Migrate chats
  await chatMigrate(conn, data);

  //Migrate chat memberships
  await chatMembershipMigrate(conn, data);

  //Migrate follows
  await followMigrate(conn, data);

  //Migrate Poll Responses
  await pollResponseMigrate(conn, data);
  
  //Migrate Post Statistics
  await postStatMigrate(conn, data);
  
  //Migrate Subscriptions
  await subscriptionMigrate(conn, data);

  //Migrate notifSettings
  await notifSettingMigrate(conn, data);

  //Migrate trusts
  await trustMigrate(conn, data);

}
