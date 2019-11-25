/**
 * Creates the relevant tables for the Sales star schema
 * The fact table for this star schema is Customer_Sales
 */
const { Client } = require('pg')
const faker = require('faker')
const escape = require('pg-escape')
const format = require('pg-format')

const client = new Client({})

client.connect()

function select(table) {
	return client.query('SELECT * FROM ' + table)
}

function init () {
	console.log('1. WORKING...\n')
	console.log('2. DROPPING PUBLIC SCHEMA...\n')
	return client.query('DROP SCHEMA PUBLIC CASCADE;').then(() => {
		console.log('3. DROPPED PUBLIC SCHEMA...\n')
		console.log('4. CREATING PUBLIC SCHEMA...\n')
		return client.query('CREATE SCHEMA PUBLIC;').catch(e => new Error(e.message))
	}).catch(e => new Error(e.message))
}

function populateTable (tableName, keys, values, count) {
	const k = keys.join()
	console.log('k===' + k)
	const v = values.map(val => `'${val}'`).join(',')
	console.log('\nv===' + v)
	const query = `INSERT INTO ${tableName} (${k}) VALUES (${v});`
	console.log('\nquery===' + query)
	return client.query(query)
}

function insertIntoTable (tableName, data, refs) {
	let keys = Object.keys(data[0])
	let values = []
	let counter = 0
	let currRef = 1
	let currStaticRef = 0
	let totalStaticRefs = 0
	Object.values(data[0]).map(statics => {
		if (statics === '$refStatic') {
			totalStaticRefs += 1
		}
	})

	const maxRef = refs

	data.forEach(field => {
		Object.values(field).map(v => {
			if (v === '$ref') {
				// v = currRef
				// currRef += 1
				v = Math.ceil(Math.random() * maxRef)
			}

			if (v === '$refStatic') {
				currStaticRef += 1
				if (currStaticRef <= totalStaticRefs) {
					v = currStaticRef
				} else {
					currStaticRef = 1
					v = currStaticRef
				}
			}


			if (typeof v === 'string' && !v.startsWith('$')) {
				const temp = v.slice(1, v.length - 1).replace("'", "''")
				v = `'${temp}'`
			}
			counter += 1
			if (counter === keys.length && keys.length > 1) {
				values.push(`${v})`)
				counter = 0
			} else if (counter === (keys.length - keys.length) + 1 && keys.length > 1) {
				values.push(`(${v}`)
			} else if (keys.length === 1 && !v.startsWith('$')) {
				values.push(`(${v})`)
			} else if (v === '$default') {
				values.push('(' + v.replace('$', '') + ')')
			} else {
				values.push(`${v}`)
			}
		})
	})
	const sanitisedValues = values.filter(v => escape(v))
	const columns = keys.length === 1 ? keys : keys.slice(0, -1).join(', ') + ', ' + keys.slice(-1)
	const vals = sanitisedValues.slice(0, -1).join(', ') + ', ' + sanitisedValues.slice(-1)
	let paramatised = ''

	console.log('SAN: ' + sanitisedValues)

	let c = 0
	const len = sanitisedValues.length / 2
	let placeholders = [...Array(keys.length).keys()]
	placeholders.shift()
	placeholders.push(keys.length)

	// i === sanitisedValues.length - 2 ? paramatised += '($' + (i + 1) + ', $' + (i + 2) + ')'
	// 	:

	let holders = []
	for (let j = 0; j < placeholders.length; j++) {
		for (let i = 0; i < len; i++) {
			c++

			holders.push(c)


			// i === 0 ? paramatised += '($' + (i + 1) + ', $' + (i + 2) + '), '
			// 	: paramatised += '($' + (i + c) + ', $' + (i + c + 1) + '), '
		}
	}

	const startIndexes = holders.filter((val, index) => {
		return index % placeholders.length === 0
	})

	const perChunk = placeholders.length // items per chunk

	const chunkArray = sanitisedValues.reduce((resultArray, item, index) => {
		const chunkIndex = Math.floor(index / perChunk)

		if (!resultArray[chunkIndex]) {
			resultArray[chunkIndex] = [] // start a new chunk
		}

		resultArray[chunkIndex].push('$' + (index + 1))

		return resultArray
	}, [])

	const newVals = sanitisedValues.reduce((resultArray, item, index) => {
		const chunkIndex = Math.floor(index / perChunk)

		if (!resultArray[chunkIndex]) {
			resultArray[chunkIndex] = [] // start a new chunk
		}

		resultArray[chunkIndex].push(item)

		return resultArray
	}, [])

	console.log('new vals=== ' + JSON.stringify(newVals))
	console.log('tempy===' + JSON.stringify(chunkArray))

	const placeholderFormattedArr = []
	chunkArray.forEach(i => {
		placeholderFormattedArr.push('(' + i + ')')
	})

	console.log('placeholderFormattedArr===' + placeholderFormattedArr)

	let queryValues = []
	for (let i = 0; i < startIndexes.length; i++) {
		queryValues[i] = '($' + startIndexes[i] + ', $' + (startIndexes[i] + 1) + ')'
	}

	paramatised += queryValues.join(', ')


	let p = paramatised.slice(0, paramatised.length - 2)
	console.log('aaa===' + [...Array(5).keys()])
	console.log('placeholders===' + placeholders)
	console.log('holders===' + holders)
	console.log('queryValues===' + queryValues)
	console.log('paramatised===' + paramatised)
	console.log('startIndexes===' + startIndexes)


	let cleanestValues = sanitisedValues.map(v => format('%s', v))
	let cleanestValues2 = newVals.map(v => format('%s', v))
	console.log('cleanestValues===' + JSON.stringify(cleanestValues))
	console.log('trying this===' + cleanestValues.join(', '))

	const test = []
	cleanestValues.forEach(i => {
		const v = i.slice(0, i.length - 1)
		test.push(v)
	})

	console.log('here===' + JSON.stringify(test))

	// @todo make this dynamic! It needs to pop from x to x ($x, $x + 1), ($..., $...) etc
	const query = format(`INSERT INTO ${tableName} (${columns}) VALUES ${placeholderFormattedArr};`)
	const query2 = format(`INSERT INTO ${tableName} (${columns}) VALUES %L`, cleanestValues)
	const query3 = `INSERT INTO ${tableName} (${columns}) VALUES ${cleanestValues.join(', ')};`
	console.log('query===', JSON.stringify(query))
	console.log('query2===', JSON.stringify(query2))
	console.log('query3===', JSON.stringify(query3))
	// console.log('aa===' + format('%s', sanitisedValues))
	// return client.query(query, cleanestValues)
	return client.query(query3)
}


function massInsert (tableName, colNames, data) {
	console.log('TABLE NAME: ' + tableName)
	console.log('COLUMN NAMES: ' + colNames)
	console.log('DATA:')
	const cols = colNames.join()
	const keys = Object.keys(data)
	const values = Object.values(data)
	console.log('keys===', keys)
	console.log('\nvalues===', values)

	let valusString = ''
	let i = 0
	for (let row in data) {
		i++
		if (!data.hasOwnProperty(row)) continue
		if (i === Object.keys(data).length) {
			valusString += "('" + row + "'," + "'" + data[row] + "')"
		} else {
			valusString += "('" + row + "'," + "'" + data[row] + "'),"
		}
	}
	const query = `INSERT INTO ${tableName} (${cols}) VALUES ${valusString};`
	console.log('POPULATING TABLE...' + tableName + '\n')
	return client.query(query)
}

const populateIndustrySector = () => {
	return {
		sectorName: `'${faker.fake('{{commerce.department}}')}'`,
		sectorDescription: `'${faker.fake('{{company.catchPhrase}}')}'`
	}
}

const populateClient = () => {
	return {
		industrySectorID: '$ref',
		clientName: `'${faker.fake('{{company.companyName}}')}'`,
		clientWebsiteName: `'${faker.fake('{{internet.domainName}}')}'`
	}
}

populateProduct = () => {
	return {
		productName: `'${faker.fake('{{commerce.productName}}')}'`,
		productCost: `'${faker.fake('{{commerce.price}}')}'`,
		productDescription: `'${faker.fake('{{commerce.department}}')}'`,
		productCategory: `'${faker.fake('{{commerce.productAdjective}}')}'`
	}
}

populateProductInteraction = () => {
	return {
		interactionType: `'${faker.fake('{{company.bsNoun}}')}'`
	}
}

populateDay = () => {
	return {
		dayID: '$default'
	}
}

populateMonth = () => {
	const month = faker.fake('{{date.month}}')
	return {
		monthName: `'${month}'`
	}
}

populateYear = () => {
	return {
		yearID: '$default'
	}
}

populateDate = () => {
	return {
		day: `'${faker.fake('{{date.weekday}}')}'`,
		month: `'${faker.fake('{{date.month}}')}'`,
		year: "'" + Math.floor(1000 + Math.random() * (2019 - 2000) + 1000) + "'"
	}
}

populateCategory = () => {
	return {
		category: `'${faker.fake('{{commerce.department}}')}'`
	}
}

populateReturnReasoning = () => {
	return {
		categoryID: '$ref',
		description: `'${faker.fake('{{hacker.phrase}}')}'`
	}
}

populateReturns = () => {
	return {
		dateID: '$refStatic',
		clientID: '$refStatic',
		productID: '$refStatic',
		reasoningID: '$refStatic',
		numberOfReturns: Math.floor(1000 + Math.random() * (2019 - 2000) + 2000),
		totalReturnedProducts: Math.floor(Math.random() * (9999 - 14) + 14)
	}
}

populateEndUser = () => {
	const gender = ['Male','Female'][Math.round(Math.random())]
	return {
		endUserFirstName: `'${faker.fake('{{name.firstName}}')}'`,
		endUserLastName: `'${faker.fake('{{name.lastName}}')}'`,
		endUserSuffix: `'${faker.fake('{{name.suffix}}')}'`,
		endUserGender: `'${gender}'`,
		endUserAddress: `'${faker.fake('{{address.streetAddress}}')}'`,
		endUserEmail: `'${faker.fake('{{internet.email}}')}'`,
		endUserTelephone: `'${faker.fake('{{phone.phoneNumber}}')}'`,
		endUserDOB: `'${faker.fake('{{date.past}}')}'`
	}
}

populateTime = () => {
	const myDate = new Date();
	const myHour = myDate.getUTCHours()
	const myMinutes = myDate.getMinutes()
	const mySeconds = myDate.getSeconds()
	const hrs = Math.round(Math.random()*myHour)
	const mins = Math.round(Math.random()*myMinutes)
	const secs = Math.round(Math.random() * mySeconds)
	return {
	hours: `'${hrs}'`,
	minutes: `'${mins}'`,
	seconds: `'${secs}'`
	}
}

populateNavigation = () => {
	const url = `'${faker.fake('{{internet.url}}')}'`
	return {
		entryPageURL: url,
	  searchPageURL: url + '/search',
		checkoutPageURL: url + '/checkout',
		exitLinkURL: url + '/exit'
	}
}

populateAdvertising = () => {
	return {
		advertName: `'${faker.fake('{{commerce.productName}}')}'`,
		advertType: `'${faker.fake('{{commerce.productMaterial}}')}'`,
		advertCost: `'${faker.fake('{{commerce.price}}')}'`
	}
}

populateCountry = () => {
	return {
		locationDescription: `'${faker.fake('{{address.latitude}}, {{address.longitude}}')}'`,
		countryName: `'${faker.fake('{{address.country}}')}'`
	}
}

populateCounty = () => {
	return {
		countryID: '$ref',
		countyName: `'${faker.fake('{{address.county}}')}'`
	}
}

populateCity = () => {
	return {
		countyID: '$ref',
		cityName: `'${faker.fake('{{address.city}}')}'`
	}
}

populateLocation = () => {
	return {
		cityID: '$ref',
		locationDescription: `'${faker.fake('{{address.latitude}}, {{address.longitude}}')}'`,
		locationName: `'${faker.fake('{{address.state}}')}'`
	}
}

populateBasket = () => {
	return {
		timeID: '$ref',
		dateID: '$ref',
		productID: '$ref',
		endUserID: '$ref',
		clientID: '$ref',
		locationID: '$ref',
		navigationID: '$ref',
		advertisingID: '$ref',
		interactionID: '$ref',
		productViewDuration: Math.floor(Math.random() * 10000),
		productSessionPrice: `'${faker.fake('{{commerce.price}}')}'`
	}
}

const interpolate = (fieldCount, popFunc) => {
	return Array(fieldCount)
		.fill(null)
		.map(popFunc)
}

function createTables () {
	// Industry Sector Table
	console.log('CREATING TABLES...\n')
	return client.query('CREATE TABLE IndustrySector (\n' +
		'    industrySectorID SERIAL PRIMARY KEY,\n' +
		'    sectorName varchar(100),\n' +
		'    sectorDescription varchar(500)\n' +
		');\n' +
		'CREATE TABLE Client (\n' +
		'    clientID SERIAL PRIMARY KEY,\n' +
		'    industrySectorID INTEGER REFERENCES IndustrySector(industrySectorID),\n' +
		'    clientName varchar(150),\n' +
		'    clientWebsiteName varchar(250)\n' +
		');\n' +
		'CREATE TABLE Product (\n' +
		'    productID SERIAL PRIMARY KEY,\n' +
		'    productName varchar(500),\n' +
		'    productCost varchar(20),\n' +
		'    productDescription varchar(500),\n' +
		'    productCategory varchar(500)\n' +
		');\n' +
		'CREATE TABLE ProductInteraction (\n' +
		'    interactionID SERIAL PRIMARY KEY,\n' +
		'    interactionType VARCHAR(200)\n' +
		');\n' +
		'CREATE TABLE Day (\n' +
		'    dayID SERIAL PRIMARY KEY\n' +
		');\n' +
		'CREATE TABLE Month (\n' +
		'    monthID SERIAL PRIMARY KEY,\n' +
		'    monthName VARCHAR(50)\n' +
		');\n' +
		'CREATE TABLE Year (\n' +
		'    yearID SERIAL PRIMARY KEY\n' +
		');\n' +
		'CREATE TABLE Date (\n' +
		'    dateID SERIAL PRIMARY KEY,\n' +
		'    day VARCHAR(50),\n' +
		'    month VARCHAR(50),\n' +
		'    year VARCHAR(50)\n' +
		');\n' +
		'CREATE TABLE Category (\n' +
		'    categoryID SERIAL PRIMARY KEY,\n' +
		'    category VARCHAR(500)\n' +
		');\n' +
		'CREATE TABLE Return_Reasoning (\n' +
		'    reasoningID SERIAL PRIMARY KEY,\n' +
		'    categoryID INTEGER REFERENCES Category(categoryID),\n' +
		'    description VARCHAR(500)\n' +
		');\n' +
		'CREATE TABLE Returns (\n' +
		'    dateID INTEGER REFERENCES Date(dateID),\n' +
		'    clientID INTEGER REFERENCES Client(clientID),\n' +
		'    productID INTEGER REFERENCES Product(productID),\n' +
		'    reasoningID INTEGER REFERENCES Return_Reasoning(reasoningID),\n' +
		'    numberOfReturns INTEGER,\n' +
		'    totalReturnedProducts INTEGER\n' +
		');\n' +
		'CREATE TABLE EndUser (\n' +
		'    endUserID SERIAL PRIMARY KEY,\n' +
		'    endUserFirstName VARCHAR(200),\n' +
		'    endUserLastName VARCHAR(200),\n' +
		'    endUserSuffix VARCHAR(50),\n' +
		'    endUserGender VARCHAR(50),\n' +
		'    endUserAddress VARCHAR(1000),\n' +
		'    endUserEmail VARCHAR(500),\n' +
		'    endUserTelephone VARCHAR(100),\n' +
		'    endUserDOB VARCHAR(200)\n' +
		');\n' +
		'CREATE TABLE Time (\n' +
		'    timeID SERIAL PRIMARY KEY,\n' +
		'    hours VARCHAR(50),\n' +
		'    minutes VARCHAR(50),\n' +
		'    seconds VARCHAR(50)\n' +
		');\n' +
		'CREATE TABLE Navigation (\n' +
		'    navigationID SERIAL PRIMARY KEY,\n' +
		'    entryPageURL VARCHAR(500),\n' +
		'    searchPageURL VARCHAR(500),\n' +
		'    checkoutPageURL VARCHAR(500),\n' +
		'    exitLinkURL VARCHAR(500)\n' +
		');\n' +
		'CREATE TABLE Advertising (\n' +
		'    advertisingID SERIAL PRIMARY KEY,\n' +
		'    advertName VARCHAR(500),\n' +
		'    advertType VARCHAR(500),\n' +
		'    advertCost VARCHAR(20)\n' +
		');\n' +
		'CREATE TABLE Country (\n' +
		'    countryID SERIAL PRIMARY KEY,\n' +
		'    locationDescription VARCHAR(1000),\n' +
		'    countryName VARCHAR(500)\n' +
		');\n' +
		'CREATE TABLE County (\n' +
		'    countyID SERIAL PRIMARY KEY,\n' +
		'    countryID INTEGER REFERENCES Country(countryID),\n' +
		'    countyName VARCHAR(500)\n' +
		');\n' +
		'CREATE TABLE City (\n' +
		'    cityID SERIAL PRIMARY KEY,\n' +
		'    countyID INTEGER REFERENCES County(countyID),\n' +
		'    cityName VARCHAR(500)\n' +
		');\n' +
		'CREATE TABLE Location (\n' +
		'    locationID SERIAL PRIMARY KEY,\n' +
		'    cityID INTEGER REFERENCES City(cityID),\n' +
		'    locationDescription VARCHAR(500),\n' +
		'    locationName VARCHAR(500)\n' +
		');\n' +
		'CREATE TABLE Basket (\n' +
		'    orderNumber SERIAL PRIMARY KEY,\n' +
		'    timeID INTEGER REFERENCES Time(timeID),\n' +
		'    dateID INTEGER REFERENCES Date(DateID),\n' +
		'    productID INTEGER REFERENCES Product(productID),\n' +
		'    endUserID INTEGER REFERENCES EndUser(endUserID),\n' +
		'    clientID INTEGER REFERENCES Client(clientID),\n' +
		'    locationID INTEGER REFERENCES Location(locationID),\n' +
		'    navigationID INTEGER REFERENCES Navigation(navigationID),\n' +
		'    advertisingID INTEGER REFERENCES Advertising(advertisingID),\n' +
		'    interactionID INTEGER REFERENCES ProductInteraction(interactionID),\n' +
		'    productViewDuration INTEGER,\n' +
		'    productSessionPrice VARCHAR(10000)\n' +
		');'
	).then(res => res).catch(e => new Error(e.message))
}


module.exports = {
	init,
	client,
	createTables,
	populateTable,
	massInsert,
	select,
	populateIndustrySector,
	populateClient,
	populateProduct,
	populateProductInteraction,
	populateDay,
	populateMonth,
	populateYear,
	populateDate,
	populateCategory,
	populateReturnReasoning,
	populateReturns,
	populateEndUser,
	populateTime,
	populateNavigation,
	populateAdvertising,
	populateCountry,
	populateCounty,
	populateCity,
	populateLocation,
	populateBasket,
	interpolate,
	insertIntoTable
}
