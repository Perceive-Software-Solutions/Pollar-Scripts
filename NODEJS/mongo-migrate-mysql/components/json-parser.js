var fs = require('fs');
const readline = require('readline');

module.exports = async (path) => {

  //Map containing all indexed data
  const data_map = {};

  //Determine the path to the data
  const pathToData = ( path || '../data/' );

  //Determine the files within the path
  files = fs.readdirSync(pathToData)

  //Read all files within the path
  for(file in files){

    //reads the input line by line
    const fileStream = fs.createReadStream(pathToData + file, 'utf-8')
    
    const lineReader = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of lineReader){
      console.log(line);
    }

  }

}