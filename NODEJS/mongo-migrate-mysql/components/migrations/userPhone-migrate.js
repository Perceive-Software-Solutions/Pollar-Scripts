const MigrateSingleton = require('../singleton');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting UserPhones...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  //Parse UserPhones into exportable objects
  for(uPhone of data.userphonenumbers){
    conn.query(`INSERT INTO UserPhone (phoneNumber, userMainID, code, verified) 
        VALUES ("${uPhone.phoneNumber}", ${migrationSingleton.userMainIDMap[uPhone.userMainId.$oid]}, ${uPhone.code}, ${true})`);

    glob.reportProgress(uPhone, data.userphonenumbers, modulus=5);

  }

  console.log("✓ Sucessful UserPhone Export");

}