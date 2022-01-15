import StoresDAO from "../dao/StoresDAO.js";

export default class StoresController {

    static async apiGetStores(req, res, next) {
          const { StoresList , totalnumberStores } = await StoresDAO.getStores()         
          const response = { 
              Stores: StoresList,
              totalNumberStores: totalnumberStores
          }
  
          res.json(response)   
    }

}

/*
SCHEMA

{
  "_id": {},
  
}

*/