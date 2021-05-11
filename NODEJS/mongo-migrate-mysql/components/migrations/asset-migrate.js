const MigrateSingleton = require('../singleton');

const TypeEmun = new Map([[0, 'Picture'], [1, 'Video'], [2, 'Gif'], [3, 'Link']]);

module.exports.Types = TypeEmun;

//Takes a list of links to convert into an asset collection
//Works as a subroutine
module.exports.MigrateAsset = (conn, assets, type) => {

  console.log("  - Subrotuine: Exporting Asset...");
  
  if(!TypeEmun.has(type)){
    console.error("  - Subroutine: ! Invalid Type");
    return;
  }

  if(assets.length == 0){
    console.error("  - Subroutine: ! Empty Assets");
    return;
  }
  //Create a asset collection with the current date time
  var collectionResult = conn.query(`INSERT INTO AssetCollection (PIT) VALUES (NOW())`);
  var collectionID = collectionResult.insertId;

  //Create an asset model for each asset
  for(asset of assets){
    var result = conn.query(`INSERT INTO Asset (link, collectionID, assetType) VALUES ("${asset}", ${collectionID}, "${TypeEmun[type]}")`);
  }

  console.log("  - Subrotuine: ✓ Asset Exported");

  return collectionID;

}