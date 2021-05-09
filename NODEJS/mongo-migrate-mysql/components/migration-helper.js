const userInfoMigrate = require('./migrations/userInfo-migrate');

module.exports = (conn, data) => {

  //Calls all the migrate functions

  //Migrate user infos
  userInfoMigrate(conn, data.userinfos)
}