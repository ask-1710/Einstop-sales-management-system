import SalesDAO from "../dao/SalesDAO.js";


export default class SalesController {

    static async apiGetSales(req, res, next) {
        
        let page = req.query.page?parseInt(req.query.page):0
        let SalesPerPage = req.query.SalesPerPage?parseInt(req.query.SalesPerPage):500

        let filters = {}
        
        if(req.query.location) {
          filters['location'] = req.query.location       
        }
        if(req.query.purchaseMethod) {
            filters['purchaseMethod'] = req.query.purchaseMethod
        }
        if(req.query.couponUsed) {
          if(req.query.couponUsed === 'true')
            filters['couponUsed'] = true 
          else
              filters['couponUsed'] = false
        }

        if('location' in filters || 'purchaseMethod' in filters || 'couponUsed' in filters) { 
          const { SalesList , totalnumberSales } = await SalesDAO.getSales({filters,page, SalesPerPage})         
          const response = { 
              Sales: SalesList,
              totalNumberSales: totalnumberSales,
              filters: filters,
              page: page, 
              SalesPerPage: SalesPerPage
          }
  
          res.json(response)   
        }
        else {
          const { SalesList , totalnumberSales } = await SalesDAO.getSales({ page, SalesPerPage})         
          const response = { 
              Sales: SalesList,
              totalNumberSales: totalnumberSales,
              filters: filters,
              page: page, 
              SalesPerPage: SalesPerPage
          }
  
          res.json(response)   
        }

    }

    static async apiGetSale(req, res, next) {
      try{
      const orderId = req.params.id || {}

      console.log(orderId)

      const sale = await SalesDAO.getSaleById(orderId)
      
      res.json(sale)
    }
    catch(e) {
      res.status(500).json({error: e})
    }
  }

    static async apiPostSale(req, res, next) {
            // addSale(customer, storeLocation, purchaseMethod, items, couponUsed, date) 
            // customer : { age ; gender ; email ; satisfaction} 
            // items : [ { name ; tags ; price ; quantity } ]
        try {    
            const customer = {
                age: req.body.age,
                gender: req.body.gender,
                email: req.body.email,
                satisfaction: req.body.satisfaction
            }


            // req.body.items.forEach(element => items.push(element));

            console.log(req.body.items)

            // console.log(items)

            const date = new Date()

            const addedSaleResponse = await SalesDAO.addSale(
                customer,
                req.body.storeLocation,
                req.body.purchaseMethod,
                req.body.items,
                req.body.couponUsed,
                date
            )

            res.json({status: "success"})
        }

        catch(e) {

            res.status(500).json({error: e.message})

        }

    }

    // static async apiPatchSale(req,res,next) {
    //     // orderId, customer, purchaseMethod, items, couponUsed
    //     try {
    //         const orderId = req.body.orderId
    //         const customer = {
    //             age: req.body.age,
    //             gender: req.body.gender,
    //             email: req.body.email,
    //             satisfaction: req.body.satisfaction
    //         }

    //         const items = req.body.items
    
    //         const saleResponse = await SalesDAO.updateSale(
    //         orderId,
    //         customer,
    //             req.body.purchaseMethod,
    //             req.body.items,
    //             req.body.couponUsed
    //         )
    
    //         var { error } = saleResponse
    //         if (error) {
    //             res.status(400).json({ error })
    //         }
    
    //         if (saleResponse.modifiedCount === 0) {
    //             throw new Error(
    //                 "unable to update sale - user may not be original poster",
    //             )
    //         }
    
    //         res.json({ status: "success" })
    //     } 
    //     catch (e) {
    //         res.status(500).json({ error: e.message })
    //     }
    // }
    
    static async apiDeleteSale(req,res,next) {
            try {
              const orderId = req.params.id
              const response = await SalesDAO.deleteSale(
                orderId
              )
              if(response.deletedCount===0) {
                  res.status(404).json({ error: "Sale Id not found" })
              }
              res.json({ status: "success" })
            } catch (e) {
              res.status(500).json({ error: e.message })
            }
    }
    
    static async apiGetPurchaseMethods(req, res, next) {
      
      try {
        const methods=await SalesDAO.getPurchaseMethods()
        res.json(methods)
      }
      catch(e) {
        res.status(500).json({error: e.message})
      }

    }

    static async apiGetLocations(req, res, next) {
      try {
        const locations = await SalesDAO.getStoreLocations() 
        res.json(locations)
      }
      catch(e) {
        res.status(505).json({error: e.message})
      }
    }

}

/*
SCHEMA

{
  "_id": {},
  "saleDate": {},
  "items": [    
    {
      "name": 
      "tags": [],
      "price": ,
      "quantity": ,
    }
  ],

  "storeLocation": ,
  "customer": {
    "gender": 
    "age": ,
    "email": ,
    "satisfaction": ,
  },
  "couponUsed": ,
  "purchaseMethod": ,
}

*/
