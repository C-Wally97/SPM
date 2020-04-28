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

async function filterParts(query) {
  let querystr = "SELECT * FROM Parts WHERE "
  let queryBool = false
  for (let el in query) {
          if (queryBool) {
              querystr = querystr + " AND "
          }
          if (el == "Closed") {
            console.log(query[el])
            querystr = querystr + el + '=' + query[el]
          } else {
            querystr = querystr + el + `="${query[el]}"`
          }
          queryBool = true
  }
  let response = await select(querystr)
  return response
}

async function getDesc() {
        let query = await select('SELECT * FROM Descriptions')
        return query
}

async function getSeries() {
    let query = await select('SELECT * FROM Series')
    return query
}

async function filterSeries(query) {
  let querystr = "SELECT * FROM Series WHERE "
  let queryBool = false
  for (let el in query) {
          if (queryBool) {
              querystr = querystr + " AND "
          }
          if (el == "Closed") {
            querystr = querystr + el + '=' + query[el]
          } else {
            querystr = querystr + el + `="${query[el]}"`
          }
          queryBool = true
  }
  let response = await select(querystr)
  return response
}


async function addDesc(descData) {
    let query = await insert('INSERT INTO Descriptions (xQM_No,series_No,Models,Symptoms,Description_of_failure,Technician,Closed,Date_raised,image_location,Fault_type) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [descData.xQM_No,descData.series_No,descData.models,descData.symptoms,descData.failure_Desc,descData.technician,descData.closed,descData.date_Raised,descData.img_Loc,descData.fault_Type])
    return query
}

async function filterDesc(query) {
  let querystr = "SELECT * FROM Descriptions WHERE "
  let queryBool = false
  for (let el in query) {
          if (queryBool) {
              querystr = querystr + " AND "
          }
          if (el == "Closed") {
            console.log(query[el])
            querystr = querystr + el + '=' + query[el]
          } else {
            querystr = querystr + el + `="${query[el]}"`
          }
          queryBool = true
  }
  let response = await select(querystr)
  return response
}

async function addPart(partData) {
    let query = await insert('INSERT INTO Parts (xQM_No, Warranty_No, Serial_No, Date_of_sale, Date_of_failure, Part_number, Comments, Sent_to_manufacture, Date_added) VALUES (?,?,?,?,?,?,?,?,?)',
    [partData.xQM_No, partData.warranty_No, partData.serial_No, partData.date_of_sale, partData.date_of_failure, partData.part_No, partData.comments, partData.sent_to_manufacture, partData.date_raised])
    return query
}

async function addSeries(seriesData) {
  let query = await insert('INSERT INTO Series (Series, Description, Product_group, Power_type) VALUES (?, ?, ?, ?)',
  [seriesData.series_No, seriesData.description, seriesData.product_Group, seriesData.power_Type])
  return query
}

async function editDesc(descData) {
    let query = await select('UPDATE Descriptions SET xQM_No = ?,series_No = ?,Models = ?,Symptoms = ?,Description_of_failure = ?,Technician = ?,Closed = ?,Date_raised = ?,image_location = ?,Fault_type = ? WHERE id = ?',
    [descData.xQM_No,descData.series_No,descData.models,descData.symptoms,descData.failure_Desc,descData.technician,descData.closed,descData.date_Raised,descData.img_Loc,descData.fault_Type, descData.id])
    return query
}

async function editPart(partData) {
  let query = await select('UPDATE Parts SET xQM_No = ?,Warranty_No = ?,Serial_No = ?,Date_of_sale = ?,date_of_failure = ?,Part_number = ?,Comments = ?,Sent_to_manufacture = ?,Date_added = ? WHERE id = ?',
  [partData.xQM_No, partData.warranty_No, partData.serial_No, partData.date_of_sale, partData.date_of_failure, partData.part_No, partData.comments, partData.sent_to_manufacture, partData.date_raised, partData.id])
  return query
}

async function editSeries(seriesData) {
  let query = await select('UPDATE Series Set Series = ?, Description = ?, Product_group = ?, Power_type = ? WHERE id = ?', 
  [seriesData.series_No, seriesData.description, seriesData.product_Group, seriesData.power_Type, seriesData.id])
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
    filterParts: filterParts,
    getUser: getUser,
    getDesc: getDesc,
    filterDesc: filterDesc,
    getSeries: getSeries,
    addDesc: addDesc,
    addPart: addPart,
    addSeries: addSeries,
    filterSeries: filterSeries,
    editDesc: editDesc,
    editPart: editPart,
    editSeries: editSeries
}