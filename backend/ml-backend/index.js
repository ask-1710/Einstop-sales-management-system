import mongodb from "mongodb"
import app from "./server.js"
import dotenv from "dotenv"
import SalesDAO from '../dao/SalesDAO.js' ;

dotenv.config()
const mongoClient = mongodb.MongoClient
const port = process.env.PORT||5000

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
    await SalesDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`server listening on port ${port}`)
    })
})
