import express from 'express'
import cors from 'cors'
import sales from './api/sales.router.js'
import stores from './api/stores.router.js'

const app = express()
const __dirname='/home/aarthi/fitgit/react/einduch-stop/backend'

app.use(cors())
app.use(express.json())

app.use('/api/v1/supply', sales)
app.use('/api/v1/stores', stores)
app.use('*', (req, res)=>res.status(404).json({error: 'nor found'}))

export default app 