const AWS = require('aws-sdk'),
      s3 = new AWS.S3();
const MigrateSingleton = require('../singleton');

//S3 Bucket for migration
const AWS_NEW_BUCKET_NAME = process.env.AWS_NEW_BUCKET_NAME,
      AWS_OLD_BUCKET_NAME = process.env.AWS_OLD_BUCKET_NAME;

//Configure AWS access keys
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const TypeEmun = new Map([[0, 'Picture'], [1, 'Video'], [2, 'Gif'], [3, 'Link']]);

module.exports.Types = TypeEmun;

//Takes a list of links to convert into an asset collection
//Works as a subroutine
module.exports.MigrateAsset = async (conn, assets, type, quiet = false) => {

  if(!quiet)
    console.log(`  - Subrotuine: Exporting Asset Typed "${TypeEmun.get(type)}"...`);
  
  if(!TypeEmun.has(type)){
    if(!quiet)
      console.error("  - Subroutine: ! Invalid Type");
    return;
  }

  if(assets.length == 0){
    if(!quiet)
      console.error("  - Subroutine: ! Empty Assets");
    return;
  }

  //Move video or image to new s3 bucket
  if(type == 0 || type == 1){
    console.error(`  - Subroutine: Copying ${assets.length} ${TypeEmun.get(type)}s to S3 Bucket`);

    //New asset links
    const newAssets = [];

    //Migrate each asset to new bucket
    for(asset of assets){
      newAssets.push(await promisifyS3CopyObject(asset).catch((err) => { throw err }));
    }

    //copy assets over
    assets = newAssets;
  }

  //Migrate over to new S3 bucket

  //Create a asset collection with the current date time
  var collectionResult = conn.query(`INSERT INTO AssetCollection (PIT) VALUES (NOW())`);
  var collectionID = collectionResult.insertId;

  //Create an asset model for each asset
  for(asset of assets){
    var result = conn.query(`INSERT INTO Asset (link, collectionID, assetType) VALUES ("${asset}", ${collectionID}, "${TypeEmun.get(type)}")`);
  }

  if(!quiet)
    console.log("  - Subrotuine: ✓ Asset Exported");

  return collectionID;

}

//S3 Migrate helper
promisifyS3CopyObject = async (asset) => {

  //Create key
  const key = asset.split('.amazonaws.com/')[1];
  
  //Copying from old to new bucket, while retaining key
  var params = {
    CopySource: AWS_OLD_BUCKET_NAME + '/' + key,
    Bucket: AWS_NEW_BUCKET_NAME,
    Key: key
  };
  
  //Promisify the s3 copy object request
  return new Promise((resolve, reject) => {
    s3.copyObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
      }
      resolve(data);
    });
  });
}