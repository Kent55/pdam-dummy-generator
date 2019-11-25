// function createTables () {
// 	// Industry Sector Table
// 	console.log('CREATING TABLES...\n')
// 	return client.query('CREATE TABLE IndustrySector (\n' +
// 		'    industrySectorID SERIAL PRIMARY KEY,\n' +
// 		'    sectorName varchar(100),\n' +
// 		'    sectorDescription varchar(500)\n' +
// 		');\n' +
// 		'CREATE TABLE Client (\n' +
// 		'    clientID SERIAL PRIMARY KEY,\n' +
// 		'    industrySectorID INTEGER REFERENCES IndustrySector(industrySectorID),\n' +
// 		'    clientName varchar(150),\n' +
// 		'    clientWebsiteName varchar(250)\n' +
// 		');\n' +
// 		'CREATE TABLE Product (\n' +
// 		'    productID SERIAL PRIMARY KEY,\n' +
// 		'    productName varchar(500),\n' +
// 		'    productCost varchar(20),\n' +
// 		'    productDescription varchar(500),\n' +
// 		'    productCategory varchar(500)\n' +
// 		');\n' +
// 		'CREATE TABLE ProductInteraction (\n' +
// 		'    interactionID SERIAL PRIMARY KEY,\n' +
// 		'    interactionType VARCHAR(200)\n' +
// 		');\n' +
// 		'CREATE TABLE Day (\n' +
// 		'    dayID SERIAL PRIMARY KEY\n' +
// 		');\n' +
// 		'CREATE TABLE Month (\n' +
// 		'    monthID SERIAL PRIMARY KEY,\n' +
// 		'    monthName VARCHAR(50)\n' +
// 		');\n' +
// 		'CREATE TABLE Month (\n' +
// 		'    monthID SERIAL PRIMARY KEY,\n' +
// 		'    monthName VARCHAR(50)\n' +
// 		');\n' +
// 		'CREATE TABLE Year (\n' +
// 		'    yearID SERIAL PRIMARY KEY\n' +
// 		');\n' +
// 		'CREATE TABLE Date (\n' +
// 		'    dateID SERIAL PRIMARY KEY,\n' +
// 		'    day VARCHAR(50),\n' +
// 		'    month VARCHAR(50),\n' +
// 		'    year VARCHAR(50)\n' +
// 		');\n' +
// 		'CREATE TABLE Category (\n' +
// 		'    categoryID SERIAL PRIMARY KEY,\n' +
// 		'    category VARCHAR(500)\n' +
// 		');\n' +
// 		'CREATE TABLE Return_Reasoning (\n' +
// 		'    reasoningID SERIAL PRIMARY KEY,\n' +
// 		'    categoryID INTEGER REFERENCES Category(categoryID),\n' +
// 		'    description VARCHAR(500)\n' +
// 		');\n' +
// 		'CREATE TABLE Returns (\n' +
// 		'    dateID INTEGER REFERENCES Date(dateID),\n' +
// 		'    clientID INTEGER REFERENCES Client(clientID),\n' +
// 		'    productID INTEGER REFERENCES Product(productID),\n' +
// 		'    reasoningID INTEGER REFERENCES Return_Reasoning(reasoningID),\n' +
// 		'    numberOfReturns INTEGER,\n' +
// 		'    totalReturnedProducts INTEGER\n' +
// 		');\n' +
// 		'CREATE TABLE EndUser (\n' +
// 		'    endUserID SERIAL PRIMARY KEY,\n' +
// 		'    endUserFirstName VARCHAR(200),\n' +
// 		'    endUserLastName VARCHAR(200),\n' +
// 		'    endUserSuffix VARCHAR(50),\n' +
// 		'    endUserGender VARCHAR(50),\n' +
// 		'    endUserAddress VARCHAR(1000),\n' +
// 		'    endUserEmail VARCHAR(500),\n' +
// 		'    endUserTelephone VARCHAR(100),\n' +
// 		'    endUserDOB VARCHAR(200)\n' +
// 		');\n' +
// 		'CREATE TABLE Time (\n' +
// 		'    timeID SERIAL PRIMARY KEY,\n' +
// 		'    hours VARCHAR(50),\n' +
// 		'    minutes VARCHAR(50),\n' +
// 		'    seconds VARCHAR(50)\n' +
// 		');\n' +
// 		'CREATE TABLE Navigation (\n' +
// 		'    navigationID SERIAL PRIMARY KEY,\n' +
// 		'    entryPageURL VARCHAR(500),\n' +
// 		'    searchPageURL VARCHAR(500),\n' +
// 		'    checkoutPageURL VARCHAR(500),\n' +
// 		'    exitLinkURL VARCHAR(500)\n' +
// 		');\n' +
// 		'CREATE TABLE Advertising (\n' +
// 		'    advertisingID SERIAL PRIMARY KEY,\n' +
// 		'    advertName VARCHAR(500),\n' +
// 		'    advertType VARCHAR(500),\n' +
// 		'    advertCost INTEGER\n' +
// 		');\n' +
// 		'CREATE TABLE Country (\n' +
// 		'    countryID SERIAL PRIMARY KEY,\n' +
// 		'    locationDescription VARCHAR(1000),\n' +
// 		'    countryName VARCHAR(500)\n' +
// 		');\n' +
// 		'CREATE TABLE County (\n' +
// 		'    countyID SERIAL PRIMARY KEY,\n' +
// 		'    countryID INTEGER REFERENCES Country(countryID),\n' +
// 		'    countyName VARCHAR(500)\n' +
// 		');\n' +
// 		'CREATE TABLE City (\n' +
// 		'    cityID SERIAL PRIMARY KEY,\n' +
// 		'    countyID INTEGER REFERENCES County(countyID),\n' +
// 		'    cityName VARCHAR(500)\n' +
// 		');\n' +
// 		'CREATE TABLE Location (\n' +
// 		'    locationID SERIAL PRIMARY KEY,\n' +
// 		'    cityID INTEGER REFERENCES City(cityID),\n' +
// 		'    locationDescription VARCHAR(500),\n' +
// 		'    locationName VARCHAR(500)\n' +
// 		');\n' +
// 		'CREATE TABLE Basket (\n' +
// 		'    orderNumber SERIAL PRIMARY KEY,\n' +
// 		'    timeID INTEGER REFERENCES Time(timeID),\n' +
// 		'    dateID INTEGER REFERENCES Date(DateID),\n' +
// 		'    productID INTEGER REFERENCES Product(productID),\n' +
// 		'    endUserID INTEGER REFERENCES EndUser(endUserID),\n' +
// 		'    clientID INTEGER REFERENCES Client(clientID),\n' +
// 		'    locationID INTEGER REFERENCES Location(locationID),\n' +
// 		'    navigationID INTEGER REFERENCES Navigation(navigationID),\n' +
// 		'    advertisingID INTEGER REFERENCES Advertising(advertisingID),\n' +
// 		'    interactionID INTEGER REFERENCES ProductInteraction(interactionID),\n' +
// 		'    productViewDuration INTEGER,\n' +
// 		'    productSessionPrice INTEGER\n' +
// 		');'
// 	)
// }

const faker = require('faker')
const starSchema = require('./starSchemasSales')

function createPopulation () {
	return new Promise((resolve, reject) => {
		let pop = {}
		for(let i = 0; i < 100; i++) {
			pop[faker.fake('{{commerce.department}}')] = faker.fake('{{company.catchPhrase}}')
		}
		resolve(pop)
	})
}

const populateIndustrySector = () => {
	return {
		sectorName: faker.fake('{{commerce.department}}'),
		sectorDescription: faker.fake('{{company.catchPhrase}}')
	}
}

const populateClient = () => {
	return {
		clientName: `${faker.fake('{{name.prefix}}')} ${faker.fake('{{name.firstName}}')} ${faker.fake('{{name.lastName}}')}`,
		clientWebsiteName: faker.fake('{{internet.domainName}}')
	}
}

const interpolate = (fieldCount, popFunc) => {
	return Array(fieldCount)
		.fill(null)
		.map(popFunc)
}

console.log(interpolate(5, populateIndustrySector))
console.log(interpolate(5, populateClient))


// function createTables () {
// 		// Industry Sector Table
// 	console.log('CREATING TABLES...\n')
// 		return client.query('CREATE TABLE IndustrySector (\n' +
// 			'    industrySectorID SERIAL PRIMARY KEY,\n' +
// 			'    sectorName varchar(100),\n' +
// 			'    sectorDescription varchar(500)\n' +
// 			');').then(() => {
// 			return client.query('CREATE TABLE Client (\n' +
// 				'    clientID SERIAL PRIMARY KEY,\n' +
// 				'    industrySectorID INTEGER REFERENCES IndustrySector(industrySectorID),\n' +
// 				'    clientName varchar(150),\n' +
// 				'    clientWebsiteName varchar(250)\n' +
// 				');').then(() => {
// 				return client.query('CREATE TABLE Product (\n' +
// 					'    productID SERIAL PRIMARY KEY,\n' +
// 					'    productName varchar(500),\n' +
// 					'    productCost varchar(20),\n' +
// 					'    productDescription varchar(500),\n' +
// 					'    productCategory varchar(500)\n' +
// 					');').then(() => {
// 					return client.query('CREATE TABLE ProductInteraction (\n' +
// 						'    interactionID SERIAL PRIMARY KEY,\n' +
// 						'    interactionType VARCHAR(200)\n' +
// 						');').then(() => {
// 				return client.query('CREATE TABLE Day (\n' +
// 					'    dayID SERIAL PRIMARY KEY\n' +
// 					');').then(() => {
// 					return client.query('CREATE TABLE Month (\n' +
// 						'    monthID SERIAL PRIMARY KEY,\n' +
// 						'    monthName VARCHAR(50)\n' +
// 						');').then(() => {
// 						return client.query('CREATE TABLE Year (\n' +
// 							'    yearID SERIAL PRIMARY KEY\n' +
// 							');').then(() => {
// 							return client.query('CREATE TABLE Date (\n' +
// 								'    dateID SERIAL PRIMARY KEY,\n' +
// 								'    day VARCHAR(50),\n' +
// 								'    month VARCHAR(50),\n' +
// 								'    year VARCHAR(50)\n' +
// 								');').then(() => {
// 									return client.query('CREATE TABLE Category (\n' +
// 										'    categoryID SERIAL PRIMARY KEY,\n' +
// 										'    category VARCHAR(500)\n' +
// 										');').then(() => {
// 								return client.query('CREATE TABLE Return_Reasoning (\n' +
// 									'    reasoningID SERIAL PRIMARY KEY,\n' +
// 									'    categoryID INTEGER REFERENCES Category(categoryID),\n' +
// 									'    description VARCHAR(500)\n' +
// 									');').then(() => {
// 								return client.query('CREATE TABLE Returns (\n' +
// 									'    dateID INTEGER REFERENCES Date(dateID),\n' +
// 									'    clientID INTEGER REFERENCES Client(clientID),\n' +
// 									'    productID INTEGER REFERENCES Product(productID),\n' +
// 									'    reasoningID INTEGER REFERENCES Return_Reasoning(reasoningID),\n' +
// 									'    numberOfReturns INTEGER,\n' +
// 									'    totalReturnedProducts INTEGER\n' +
// 									');').then(() => {
// 									return client.query('CREATE TABLE EndUser (\n' +
// 										'    endUserID SERIAL PRIMARY KEY,\n' +
// 										'    endUserFirstName VARCHAR(200),\n' +
// 										'    endUserLastName VARCHAR(200),\n' +
// 										'    endUserSuffix VARCHAR(50),\n' +
// 										'    endUserGender VARCHAR(50),\n' +
// 										'    endUserAddress VARCHAR(1000),\n' +
// 										'    endUserEmail VARCHAR(500),\n' +
// 										'    endUserTelephone VARCHAR(100),\n' +
// 										'    endUserDOB VARCHAR(200)\n' +
// 										');').then(() => {
// 										return client.query('CREATE TABLE Time (\n' +
// 											'    timeID SERIAL PRIMARY KEY,\n' +
// 											'    hours VARCHAR(50),\n' +
// 											'    minutes VARCHAR(50),\n' +
// 											'    seconds VARCHAR(50)\n' +
// 											');').then(() => {
// 											return client.query('CREATE TABLE Navigation (\n' +
// 												'    navigationID SERIAL PRIMARY KEY,\n' +
// 												'    entryPageURL VARCHAR(500),\n' +
// 												'    searchPageURL VARCHAR(500),\n' +
// 												'    checkoutPageURL VARCHAR(500),\n' +
// 												'    exitLinkURL VARCHAR(500)\n' +
// 												');').then(() => {
// 												return client.query('CREATE TABLE Advertising (\n' +
// 													'    advertisingID SERIAL PRIMARY KEY,\n' +
// 													'    advertName VARCHAR(500),\n' +
// 													'    advertType VARCHAR(500),\n' +
// 													'    advertCost INTEGER\n' +
// 													');').then(() => {
// 													return client.query('CREATE TABLE Country (\n' +
// 														'    countryID SERIAL PRIMARY KEY,\n' +
// 														'    locationDescription VARCHAR(1000),\n' +
// 														'    countryName VARCHAR(500)\n' +
// 														');').then(() => {
// 														return client.query('CREATE TABLE County (\n' +
// 															'    countyID SERIAL PRIMARY KEY,\n' +
// 															'    countryID INTEGER REFERENCES Country(countryID),\n' +
// 															'    countyName VARCHAR(500)\n' +
// 															');').then(() => {
// 															return client.query('CREATE TABLE City (\n' +
// 																'    cityID SERIAL PRIMARY KEY,\n' +
// 																'    countyID INTEGER REFERENCES County(countyID),\n' +
// 																'    cityName VARCHAR(500)\n' +
// 																');').then(() => {
// 																return client.query('CREATE TABLE Location (\n' +
// 																	'    locationID SERIAL PRIMARY KEY,\n' +
// 																	'    cityID INTEGER REFERENCES City(cityID),\n' +
// 																	'    locationDescription VARCHAR(500),\n' +
// 																	'    locationName VARCHAR(500)\n' +
// 																	');').then(() => {
// 																	return client.query('CREATE TABLE Basket (\n' +
// 																		'    orderNumber SERIAL PRIMARY KEY,\n' +
// 																		'    timeID INTEGER REFERENCES Time(timeID),\n' +
// 																		'    dateID INTEGER REFERENCES Date(DateID),\n' +
// 																		'    productID INTEGER REFERENCES Product(productID),\n' +
// 																		'    endUserID INTEGER REFERENCES EndUser(endUserID),\n' +
// 																		'    clientID INTEGER REFERENCES Client(clientID),\n' +
// 																		'    locationID INTEGER REFERENCES Location(locationID),\n' +
// 																		'    navigationID INTEGER REFERENCES Navigation(navigationID),\n' +
// 																		'    advertisingID INTEGER REFERENCES Advertising(advertisingID),\n' +
// 																		'    interactionID INTEGER REFERENCES ProductInteraction(interactionID),\n' +
// 																		'    productViewDuration INTEGER,\n' +
// 																		'    productSessionPrice INTEGER\n' +
// 																		');')
// 																})
// 															})
// 														})
// 													})
// 												})
// 											})
// 														})
// 													})
// 												})
// 											})
// 										})
// 									})
// 								})
// 							})
// 						})
// 					})
// 				})
// 			})
// 		}).catch(e => new Error(e.message))
// }