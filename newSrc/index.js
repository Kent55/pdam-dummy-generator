/**
 * PDAM - Practical Data Analytics and Mining
 * This script was built to allow for the easy creation and insertion of data into
 * a remote PostgreSQL database. We needed thousands and thousands of records
 * and to save time, this script was born.
 *
 * It uses faker.js to generate the random data, which on the whole is pretty
 * realistic. The pg library is used to connect and interact with the postgreSQL database.
 * Unfortunately that is the only database that is currently supported.
 *
 * @author Matt Kent (Kent55 - GitHub, @Matt_Kent9 - Twitter)
 * @license MIT
 */
const schema = require('../schema/schema')
const faker = require('faker')

class PDAM {
	constructor () {
		this.schema = null
		this.interpolatedColumns = []
		this.dbClient = null
	}

	setThrottle (milliseconds) {
		console.log('Throttle of ' + milliseconds + ' set.')
		return this
	}

	withSchema (schema) {
		this.schema = schema
		console.log('With schema: ' + schema)
		return this
	}

	useDatabase (clientObj) {
		console.log('initialising database client' + clientObj)
		return this
	}

	withColumns (which = '*') {
		// if (which === '*') {
		//
		// }
		// if (which.isArray()) {
		//
		// }
		// if (typeof which === 'string') {
		// 		this.interpolatedColumns = this._getColumnByKey(this.schema, which)
		// 			|| console.log('Error finding column passed in PDAM.columns()')
		// } else {
		// 	console.log(throw new Error('Invalid columns argument passed to PDAM.columns()'))
		// }
		console.log('with columns ' + which)
		return this
	}

	_traverseObjKeys (obj) {

	}

	_getColumnByKey (obj, key) {
		if (obj.key === key) {
			return obj
		}
		for (let i in obj) {
			if (obj.hasOwnProperty(i)) {
				const column = this._getColumnByKey(obj[i], key)
				if (column) {
					return column
				}
			}
		}
		return false
	}

	interpolate () {
		// Object.keys(this.schema.tables).map(table => {
		// 	Object.keys(this.schema.tables[table].columns).map(column => {
		// 		const col = this.schema.tables[table].columns[column]
		// 		const factory = !this.schema.tables[table].columns[column].factory
		// 			? null
		// 			: this.schema.tables[table].columns[column].factory('Value')
		// 		this.interpolatedColumns.push({
		// 			col: factory
		// 		})
		// 	})
		// })
		console.log('interpolating strings with data')
		return this
	}

	start() {
		console.log('starting...')
	}

	print() {
		console.log(this.schema)
	}
}

module.exports = PDAM


