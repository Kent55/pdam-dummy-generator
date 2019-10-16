/**
 * PDAM - Practical Data Analytics and Mining
 * Generation library for creating large amounts of dummy data
 *
 * @author up821309, up804392, up825319
 */

const faker = require('faker')
const { Client } = require('pg')

const client = new Client({
	user: '',
	host: '',
	database: '',
	password: '',
	port: '5432'
})

client.connect()

const data = {}

client.query('CREATE TABLE users (\n' +
	'    id bigserial primary key,\n' +
	'    name varchar(20) NOT NULL,\n' +
	'    email text NOT NULL,\n' +
	'    date_added timestamp default NULL\n' +
	');')

for (let i = 0; i <= 100; i++) {
	// const obj = {
	// 	firstName: faker.name.findName(),
	// 	lastName: faker.name.lastName(),
	// 	email: faker.internet.email()
	// }
	// data[i] = obj
	const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
	const values = [faker.name.findName(), faker.internet.email()]
	client.query(text, values, (err, res) => {
		if (err) {
			console.log(err.stack)
		} else {
			console.log(res.rows[0])
		}
	})

}

console.table(data)