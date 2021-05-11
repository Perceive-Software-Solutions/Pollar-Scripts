const MigrateSingleton = require('../singleton');
const MigrateAsset = require('./asset-migrate');

module.exports = async (conn, data) => {

  console.log("Exporting Topics...");

  const migrationSingleton = new MigrateSingleton().getInstance();

  var topicIDs = migrationSingleton.topicIDMap;

  //Parse topics into exportable objects
  for(topic of data.topics){
    var topicImg = null;
    if(topic.image!=null){
        topicImg = MigrateAsset.MigrateAsset(conn, [topic.image], 0);
    }
    var realTopicImg = topicImg == null ? null : `"${topicImg}"`;

    var result = conn.query(`INSERT INTO Topic (topicName, categoryID, assetID) VALUES ("${topic.name}", ${migrationSingleton.categoryIDMap[topic.categoryId.$oid]}, ${realTopicImg})`);

    //Extract id from result
    id = result.insertId;

    //Map mongo and mysql ids
    topicIDs[topic._id.$oid] = id;

  }

  //Export the topicID map
  migrationSingleton.topicIDMap = topicIDs;

  console.log("✓ Sucessful Topic Export");

}