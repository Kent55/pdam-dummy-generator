/**
 * PDAM - Practical Data Analytics and Mining
 * Generation library for creating large amounts of dummy data
 *
 * @author up821309, up804392, up825319
 */

// @TODO fix bug with strings in interpolation, names like O'Leiry will conflict with the wrapper ''...need to escape strings in that case...


const faker = require('faker')
const starSchema = require('./lib/starSchemasSales')
const { Pool } = require('pg')


function createPopulation () {
	return new Promise((resolve, reject) => {
		let pop = {}
		for(let i = 0; i < 100; i++) {
			pop[faker.fake('{{commerce.department}}')] = faker.fake('{{company.catchPhrase}}')
		}
		return pop
	})
}


starSchema.init().then(() => {
	console.log('5. CREATED PUBLIC SCHEMA...\n')
	starSchema.createTables().then(res => {
		console.log('6. CREATED TABLES...\n')
		return starSchema.client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'').then(data => {
			let tables = {}
			data.rows.forEach((row, i) => tables[i] = {'TABLE NAME': row.table_name})
			console.table(tables)
			// let pop = {}
			// for(let i = 0; i < 100; i++) {
			// 	pop[faker.fake('{{commerce.department}}')] = faker.fake('{{company.catchPhrase}}')
			// }
			const recordCount = 5
			console.log('7. INTERPOLATING DATA...')
			const industrySector = starSchema.interpolate(recordCount, starSchema.populateIndustrySector)
			const client = starSchema.interpolate(recordCount, starSchema.populateClient)
			const product = starSchema.interpolate(recordCount, starSchema.populateProduct)
			const productInteraction = starSchema.interpolate(recordCount, starSchema.populateProductInteraction)
			const day = starSchema.interpolate(recordCount, starSchema.populateDay)
			const month = starSchema.interpolate(recordCount, starSchema.populateMonth)
			const year = starSchema.interpolate(recordCount, starSchema.populateYear)
			const date = starSchema.interpolate(recordCount, starSchema.populateDate)
			const category = starSchema.interpolate(recordCount, starSchema.populateCategory)
			const returnReasoning = starSchema.interpolate(recordCount, starSchema.populateReturnReasoning)
			const returns = starSchema.interpolate(recordCount, starSchema.populateReturns)
			const endUser = starSchema.interpolate(recordCount, starSchema.populateEndUser)
			const time = starSchema.interpolate(recordCount, starSchema.populateTime)
			const navigation = starSchema.interpolate(recordCount, starSchema.populateNavigation)
			const advertising = starSchema.interpolate(recordCount, starSchema.populateAdvertising)
			const country = starSchema.interpolate(recordCount, starSchema.populateCountry)
			const county = starSchema.interpolate(recordCount, starSchema.populateCounty)
			const city = starSchema.interpolate(recordCount, starSchema.populateCity)
			const location = starSchema.interpolate(recordCount, starSchema.populateLocation)
			const basket = starSchema.interpolate(recordCount, starSchema.populateBasket)
			const t = console.table

			let dataTables = []

			starSchema.insertIntoTable('IndustrySector', industrySector).then(() => {
				console.log('8. DATA INSERTED INTO TABLE IndustrySector...')
				starSchema.select('IndustrySector').then(res => {
					console.table(res.rows)
					dataTables[0] = { 'IndustrySector': res.rows }
					starSchema.insertIntoTable('Client', client, res.rows.length).then(() => {
						console.log('8. DATA INSERTED INTO TABLE Client...')
						starSchema.select('Client').then(res => {
							console.table(res.rows)
							dataTables[1] = { 'Client': res.rows }
							starSchema.insertIntoTable('Product', product).then(() => {
								console.log('9. DATA INSERTED INTO TABLE Product...')
								starSchema.select('Product').then(res => {
									console.table(res.rows)
									dataTables[2] = { 'Product': res.rows }
									starSchema.insertIntoTable('ProductInteraction', productInteraction).then(() => {
										console.log('10. DATA INSERTED INTO ProductInteraction...')
										starSchema.select('ProductInteraction').then(res => {
											console.table(res.rows)
											dataTables[3] = { 'ProductInteraction': res.rows }
											starSchema.insertIntoTable('Day', day).then(() => {
												console.log('11. DATA INSERTED INTO Day...')
												starSchema.select('Day').then(res => {
													console.table(res.rows)
													dataTables[4] = { 'Day': res.rows }
													starSchema.insertIntoTable('Month', month).then(() => {
														console.log('12. DATA INSERTED INTO Month...')
														starSchema.select('Month').then(res => {
															console.table(res.rows)
															dataTables[5] = { 'Month': res.rows }
															starSchema.insertIntoTable('Year', year).then(() => {
																console.log('13. DATA INSERTED INTO Year...')
																starSchema.select('Year').then(res => {
																	console.table(res.rows)
																	dataTables[6] = { 'Year': res.rows }
																	starSchema.insertIntoTable('Date', date).then(() => {
																		console.log('14. DATA INSERTED INTO Date...')
																		starSchema.select('Date').then(res => {
																			console.table(res.rows)
																			dataTables[7] = { 'Date': res.rows }
																			starSchema.insertIntoTable('Category', category).then(() => {
																				console.log('15. DATA INSERTED INTO Category...')
																				starSchema.select('Category').then(res => {
																					console.table(res.rows)
																					dataTables[8] = { 'Category': res.rows }
																					starSchema.insertIntoTable('Return_Reasoning', returnReasoning, res.rows.length).then(() => {
																						console.log('16. DATA INSERTED INTO Return_Reasoning')
																					}).then(() => {
																						starSchema.select('Return_Reasoning').then(res => {
																							console.table(res.rows)
																							dataTables[9] = { 'Return_Reasoning': res.rows }
																							starSchema.insertIntoTable('Returns', returns, res.rows.length).then(() => {
																								console.log('17. DATA INSERTED INTO Returns...')
																								starSchema.select('Returns').then(res => {
																									console.table(res.rows)
																									dataTables[10] = { 'Returns': res.rows }
																									starSchema.insertIntoTable('EndUser', endUser).then(() => {
																										console.log('18. DATA INSERTED INTO EndUser...')
																										starSchema.select('EndUser').then(res => {
																											console.table(res.rows)
																											dataTables[11] = { 'EndUser': res.rows }
																											starSchema.insertIntoTable('Time', time).then(() => {
																												console.log('19. DATA INSERTED INTO Time...')
																												starSchema.select('Time').then(res => {
																													console.table(res.rows)
																													dataTables[12] = { 'Time': res.rows }
																													starSchema.insertIntoTable('Navigation', navigation).then(() => {
																														console.log('20. DATA INSERTED INTO Navigation...')
																														starSchema.select('Navigation').then(res => {
																															console.table(res.rows)
																															dataTables[13] = { 'Navigation': res.rows }
																															starSchema.insertIntoTable('Advertising', advertising).then(() => {
																																console.log('21. DATA INSERTED INTO Advertising...')
																																starSchema.select('Advertising').then(res => {
																																	console.table(res.rows)
																																	dataTables[14] = { 'Advertising': res.rows }
																																	starSchema.insertIntoTable('Country', country).then(() => {
																																		console.log('22. DATA INSERTED INTO Country...')
																																		starSchema.select('Country').then(res => {
																																			console.table(res.rows)
																																			dataTables[15] = { 'Country': res.rows }
																																			starSchema.insertIntoTable('County', county, res.rows.length).then(() => {
																																				console.log('23. DATA INSERTED INTO County...')
																																				starSchema.select('County').then(res => {
																																					console.table(res.rows)
																																					dataTables[16] = { 'County': res.rows }
																																					starSchema.insertIntoTable('City', city, res.rows.length).then(() => {
																																						console.log('24. DATA INSERTED INTO City...')
																																						starSchema.select('City').then(res => {
																																							console.table(res.rows)
																																							dataTables[17] = { 'City': res.rows }
																																							starSchema.insertIntoTable('Location', location, res.rows.length).then(() => {
																																								console.log('25. DATA INSERTED INTO Location...')
																																								starSchema.select('Location').then(res => {
																																									console.table(res.rows)
																																									dataTables[18] = { 'Location': res.rows }
																																									starSchema.insertIntoTable('Basket', basket, res.rows.length).then(() => {
																																										console.log('26. DATA INSERTED INTO Basket...')
																																										starSchema.select('Basket').then(res => {
																																											console.table(res.rows)
																																											dataTables[19] = { 'Basket': res.rows }
																																											console.log('COMPLETED SUCCESSFULLY!')
																																											console.log('TOTAL OF ' + dataTables.length + ' TABLES CREATED AND POPULATED.')
																																											console.log('WITH A TOTAL OF: ' + recordCount + dataTables.length + ' RECORDS CREATED.')
																																											dataTables.forEach(i => {
																																												console.log('TABLE: ' + Object.keys(i))
																																												Object.values(i).forEach(j => {
																																													console.table(j)
																																												})
																																											})
																																											process.exit()
																																										})
																																									})
																																								})
																																							})
																																						})
																																					})
																																				})
																																			})
																																		})
																																	})
																																})
																															})
																														})
																													})
																												})
																											})
																										})
																									})
																								})
																							})
																						})
																					})
																				})
																			})
																		})
																	})
																})
															})
														})
													})
												})
											})
										})
									})
								})
							})
						})
					}).catch(e => console.log(new Error(e.message)))
				})
			})

			// starSchema.massInsert('IndustrySector', ['sectorName', 'sectorDescription'],pop).then(() => {
			// 	starSchema.client.query('SELECT sectorName, sectorDescription FROM IndustrySector').then(res => {
			// 		console.table(res.rows)
			// 	}).then(() =>{
			// 		console.log('SELECTING DATA...')
			// 		starSchema.select('IndustrySector').then(res => {
			// 			console.log(res)
			// 		})
			// 	})
			// })
			// }).then(() => {
			// 	console.log('Tables Created.')
			// 	executePopulation().then(() => {
			// 		starSchema.client.query('SELECT sectorName, sectorDescription FROM Industry_Sector;').then(d => {
			// 			console.table(d.rows)
			// 		})
			// 	})
			// })
		}).catch(e => new Error(e.message))
	}).catch(e => new Error(e.message))
})

function executePopulation () {
	return new Promise(resolve => {
		let processed = 0
		Array.from(10).fill(0).forEach(() => {
			starSchema.populateTable('Industry_Sector', [
				'sectorName',
				'sectorDescription'
			], [
				faker.fake("{{commerce.department}}"),
				faker.fake("{{company.catchPhrase}}")
			], 1000)
			console.log('Record count: ' + processed)
			if (processed === 10) {
				resolve()
			} else {
				processed++
			}
		})
		// for (let i = 0, p = Promise.resolve(); i <= 10; i++) {
		// 	p = p.then(_ => {
		// 		starSchema.populateTable('Industry_Sector', [
		// 			'sectorName',
		// 			'sectorDescription'
		// 		], [
		// 			faker.fake("{{commerce.department}}"),
		// 			faker.fake("{{company.catchPhrase}}")
		// 		], 1000).then(() => console.log('Record count: ' + i))
		// 	})
		// }
		resolve()
	})
}

//
//
// for (let i = 0; i <= 10000; i++) { // 10000 records
// 	// const obj = {
// 	// 	firstName: faker.name.findName(),
// 	// 	lastName: faker.name.lastName(),
// 	// 	email: faker.internet.email()
// 	// }
// 	// data[i] = obj
// 	// const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
// 	// const values = [faker.name.findName(), faker.internet.email()]
// 	// client.query(text, values, (err, res) => {
// 	// 	if (err) {
// 	// 		console.log(err.stack)
// 	// 	} else {
// 	// 		console.log(res.rows[0])
// 	// 	}
// 	// })
//
// }
//
// console.table(data)