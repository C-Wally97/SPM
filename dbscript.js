'use strict'

const mysql = require('mysql2/promise');
const config = require('./config.json');

let mysqlConn = null;

async function mysqlConnection() //Handles MySQL Database connections
{
  if (mysqlConn) //If a connection already exists
  {
    return mysqlConn; //Return the existing connection
  }
  else { //Else if no connection exists
    mysqlConn = newMysqlConnection(); //Make a new connection
    return mysqlConn; //Return the new connection
  }
}

async function newMysqlConnection() { //Creates a MySQL Database connection
  const newMysqlConn = await mysql.createConnection(config); //Create MySQL connection using the settings from the config
  return newMysqlConn; //Return the new connection
}

async function select(queryStr,queryVars){ //Runs MySQL Select Queries and returns results   
    try {
    const sqlConnection = await mysqlConnection(); //get the connection   
        const newQuery = sqlConnection.format(queryStr,queryVars); //format the query to avoid SQL Injection
        let [results] = await sqlConnection.execute(newQuery) //run query
        return results; //return results 
    }
    catch (error){
        console.log("Failure:",error);//catch SQL errors and print to console in colour
        return null; //return null as an SQL error was encountered trying to select
    }
  }

  async function insert(queryStr,queryVars){ 
    try {
    const sqlConnection = await mysqlConnection(); 
    const newQuery = sqlConnection.format(queryStr,queryVars); 
    await sqlConnection.query(newQuery) 
    return true; 
    }
    catch (error){
      console.log("Failure: ", error); 
      return null; 
    }
  }
  


async function getParts() {
    const query = await select('SELECT * FROM Parts')
    if (query != '[]') {
        return query
    }
    else {
        console.log('failed')
        return "cannot get parts list."
    }
}

async function getDesc() {
        let query = await select('SELECT * FROM Descriptions')
        return query
}

async function addDesc(descData) {
    let query = await insert('INSERT INTO Descriptions (xQM_No,series_No,Models,Symptoms,Description_of_failure,Technician,Closed,Date_raised,image_location,Fault_type) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [descData.xQM_No,descData.series_No,descData.models,descData.symptoms,descData.failure_Desc,descData.technician,descData.closed,descData.date_Raised,descData.img_Loc,descData.Fault_type])
    return query
}

async function getUser(userName, userPass) {
    const query = await select('SELECT * FROM Users WHERE email = ? AND pass = ?', [userName, userPass])
    if (!query.length) {
        return Error('invalid login')
    }
    else {
        return query
    }
}



module.exports = {
    mysqlConnection: mysqlConnection,
    getParts: getParts,
    getUser: getUser,
    getDesc: getDesc,
    addDesc: addDesc
}