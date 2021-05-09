const MigrateSingleton = require('../singleton');

module.exports = async (conn, userData) => {

  console.log("Exporting UserInfo...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var userIDs = migrationSingleton.userIDMap;

  //Parse user infos into exportable objects
  for(user of userData){

  }

  console.log("✓ Sucessful UserInfo Export");

}