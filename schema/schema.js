const schema = {
  "tables": {
    "IndustrySector": {
      "columns": {
        "industrySectorID": {
          "constraints": "SERIAL PRIMARY KEY",
          "factory": false
        },
        "sectorName": {
          "constraints": "VARCHAR(500)",
          "factory": value => value
        },
        "sectorDescription": {
          "constraints": "VARCHAR(2000)",
          "factory": value => value
        }
      }
    },
    "Client": {
      "columns": {
        "clientID": {
          "constraints": "SERIAL PRIMARY KEY",
          "factory": false
        },
        "industrySectorID": {
          "constraints": "INTEGER REFERENCES IndustrySector(industrySectorID)",
          "factory": value => value
        },
        "clientName": {
          "constraints": "VARCHAR(1000)",
          "factory": value => value
        },
        "clientWebsiteName": {
          "constraints": "VARCHAR(200)",
          "factory": value => value
        }
      }
    }
  }
}

module.exports = schema