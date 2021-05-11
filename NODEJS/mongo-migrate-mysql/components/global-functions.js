
//Converts JS time to MySQL time
module.exports.toMySQLDateTime = (datetime) => datetime.slice(0, 19).replace('T', ' ');

//Reporting the progress of a loop, in modulated steps
module.exports.reportProgress = (x, list, modulus = 1) => {

  var index = list.indexOf(x) + 1;

  if(index%modulus == 0 || index == 1 || index == list.length)
    console.log(`Progress: ${Math.ceil(index/list.length*100)}%`);
}