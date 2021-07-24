const MigrateSingleton = require('../singleton');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting UserDevice...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var userIDs = migrationSingleton.userMainIDMap;

  //Parse devices 
  for(device of data.userdevices){

    conn.query(`INSERT INTO UserDevice (userMainID, token, device, PIT) VALUES (${userIDs[device.userMainId.$oid]}, ${device.token}, '', NOW())`);

    glob.reportProgress(device, data.userdevices, modulus=5);
  }
  
  console.log("✓ Sucessful UserDevice Export");

}