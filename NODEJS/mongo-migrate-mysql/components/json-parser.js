var fs = require('fs');
const readline = require('readline');

module.exports = async (path) => {

  //Map containing all indexed data
  const data_map = {};

  //Determine the path to the data
  const pathToData = ( path || './data/' );

  //Determine the files within the path
  files = fs.readdirSync(pathToData);

  //Read all files within the path
  for(file of files){

    //reads the input line by line
    const fileStream = fs.createReadStream(pathToData + file, 'utf-8')
    
    const lineReader = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    list = [];

    for await (const line of lineReader){
      list.push(JSON.parse(line))
    }

    var fileName = file.split('_')[1];

    data_map[fileName] = list;

  }

  return data_map;

}