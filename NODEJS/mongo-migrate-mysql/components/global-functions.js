
//Converts JS time to MySQL time
module.exports.toMySQLDateTime = (datetime) => datetime.slice(0, 19).replace('T', ' ');