import mongodb from "mongodb"
import app from "./server.js"
import dotenv from "dotenv"
import SalesDAO from './dao/SalesDAO.js'
import StoresDAO from './dao/StoresDAO.js'

dotenv.config()
const mongoClient = mongodb.MongoClient
const port = process.env.PORT||9000

mongoClient.connect(
    process.env.STORES_DB_URI,
    {
        // poolSize: 50,
        // wtimeout: 2500,
        // useNewUrlParse: true
    }
)
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
.then(async client => {
    await SalesDAO.injectSalesDB(client)
    await StoresDAO.injectStoresDB(client)
    app.listen(port, () => {
        console.log(`server listening on port ${port}`)
    })
})

/*
{
    "name": "einstop-sales-management-system",
    "version": "1.0.0",
    "description": "Sales Management Software",
    "main": "./backend/index.js",
    "type": "module",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "node ./backend/index.js",
      "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install npm && run build"
    },
    "engines": {
      "node": "14.18.0"
    },
    "keywords": [],
    "author": "Aarthi Suresh Kumar",
    "license": "ISC"
  }
  */