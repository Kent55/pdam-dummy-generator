const PDAM = require('./index')




const warehouse =
	new PDAM()
		.setThrottle(2000)
		.withSchema({ "my": "schema" })
		.useDatabase("myClientObj")
	  .withColumns('*')
		.interpolate()
		.start()
