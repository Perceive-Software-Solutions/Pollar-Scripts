const userInfoMigrate = require('./migrations/userInfo-migrate');
const userMainMigrate = require('./migrations/userMain-migrate');
const categoryMigrate = require('./migrations/category-migrate');


module.exports = async (conn, data) => {
  //Calls all the migrate functions

  //Migrate user infos
  await userInfoMigrate(conn, data)

  //Migrate user mains
  await userMainMigrate(conn, data)

  //Migrate categories
  await categoryMigrate(conn, data)
}
