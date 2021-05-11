const MigrateSingleton = require('../singleton');

module.exports = async (conn, data) => {

  console.log("Exporting Categories...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var categoryIDs = migrationSingleton.categoryIDMap;

  //Parse categories into exportable objects
  for(category of data.categories){
    var result = conn.query(`INSERT INTO Category (categoryName) VALUES ("${category.name}")`);

    //Extract id from result
    id = result.insertId;

    //Map mongo and mysql ids
    categoryIDs[category._id.$oid] = id;

  }

  //Export the categoryID map
  migrationSingleton.categoryIDMap = categoryIDs;

  console.log("✓ Sucessful Categories Export");

}