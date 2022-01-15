import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
// import predict from './components/predict.router.js' ;

const app = express()
const router = express.Router();

app.use(express.json())

app.use(express.static('public'))

router.get('/',function(req,res){
  res.sendFile(path.join('/home/aarthi/fitgit/react/einduch-stop/backend/ml-backend/index.html'));
  //__dirname : It will resolve to your project folder.
});
app.use('/',router);

export default app ;