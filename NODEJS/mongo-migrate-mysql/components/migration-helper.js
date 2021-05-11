const userInfoMigrate = require('./migrations/userInfo-migrate');
const userMainMigrate = require('./migrations/userMain-migrate');
const categoryMigrate = require('./migrations/category-migrate');
const topicMigrate = require('./migrations/topic-migrate');
const pollMigrate = require('./migrations/poll-migrate');


module.exports = async (conn, data) => {
  //Calls all the migrate functions

  //Migrate categories
  await categoryMigrate(conn, data)

  //Migrate topics
  await topicMigrate(conn, data)
  
  //Migrate user infos
  await userInfoMigrate(conn, data)

  //Migrate user mains
  await userMainMigrate(conn, data)

  //Migrate polls
  await pollMigrate(conn, data)
  
  //Migrate posts
  // await postMigrate(conn, data)
}
