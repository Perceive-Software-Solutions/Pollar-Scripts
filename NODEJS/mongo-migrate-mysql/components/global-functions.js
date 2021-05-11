
//Converts JS time to MySQL time
module.exports.toMySQLDateTime = (datetime) => datetime.toISOString().slice(0, 19).replace('T', ' ');