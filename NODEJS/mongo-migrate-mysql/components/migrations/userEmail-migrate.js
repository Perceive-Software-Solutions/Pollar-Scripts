const MigrateSingleton = require('../singleton');
const glob = require('../global-functions');

module.exports = async (conn, data) => {

  console.log("Exporting UserEmails...");

    if(!data.useremails){
      console.log("✓ Skipping UserEmails");
      return;
    }
    const migrationSingleton = new MigrateSingleton().getInstance();


  //Parse UserEmails into exportable objects
  for(uEmail of data.useremails){ 

    if(!uEmail.userMainId)
      continue;

    conn.query(`INSERT INTO UserEmail (email, userMainID, code, verified) 
        VALUES ("${uEmail.email}", ${migrationSingleton.userMainIDMap[uEmail.userMainId.$oid]}, ${uEmail.code}, ${true})`);

    glob.reportProgress(uEmail, data.useremails, modulus=5);

  }

  console.log("✓ Sucessful UserEmail Export");

}