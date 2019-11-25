/**
 * Data Warehouse factory. Populates the database with dummy data.
 */

const { client } = require('pg')
const recordsCountToPopulate = 10000 // 10,000
const starSchemaSalesDummyData = {
	Industry_Sector: 'CREATE TABLE Industry_Sector (\n' +
		'    industrySectorID INTEGER PRIMARY_KEY,\n' +
		'    sectorName varchar(100),\n' +
		'    sectorDescription varchar(500)\n' +
		');'
}

const client = new Client({
	user: 'root',
	host: 'uni-database-1.copnjujcaxw9.us-east-2.rds.amazonaws.com',
	database: 'uni',
	password: 'ThisPasswordIsForUniOnly1!',
	port: '5432'
})

client.connect()

beginTransaction().then(function () {
	populateDataWarehouse(starSchemaSalesDummyData).then(function () {
		commitTransaction().then(function () {
			releaseTransaction()
		})
	})
}).catch(function (err) {
	console.warn('ERROR PERFORMING DATABASE TRANSACTION ', err.message)
})

function beginTransaction () {
	return new Promise(function (resolve, reject) {
		client.query('BEGIN')
	})
}

function populateDataWarehouse (dummyData) {
	let recordCount = 0
	return dummyData.map(function (query) {
		client.query(query)
		recordCount += 1
		console.log('ADDING RECORD NUMBER: ' + recordCount)
	})
}

function commitTransaction () {
	return client.query('COMMIT')
}

function releaseTransaction () {
	client.release()
}