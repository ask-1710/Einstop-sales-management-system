import mongodb from 'mongodb' ;
const ObjectId=mongodb.ObjectId

let sales

export default class SalesDAO {

    static async injectSalesDB(conn) {
        if (sales) {
            return
        }
        try {
            sales = await conn.db(process.env.STORES_DB_NAME).collection("sales")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in StoresDAO: ${e}`,
            )
        }
    }

    static async getSales({
            filters = null,
            page = 0,
            SalesPerPage = 20,
        } = {}) {

        let query = {}

        if (filters) {
            if ("location" in filters && "purchaseMethod" in filters && "couponUsed" in filters) {
                query = { $and: [
                    { $text: { $search: filters["location"] } } , 
                    { "purchaseMethod": { $eq: filters["purchaseMethod"] } } , 
                    { "couponUsed": { $eq: filters["couponUsed"] }  } 
                ]}
            } 
            else if ("location" in filters && "purchaseMethod" in filters) {
                query = { $and: [
                    { $text: { $search: filters["location"] } } , 
                    { "purchaseMethod": { $eq: filters["purchaseMethod"] } }
                ]}
            } 
            else if ("location" in filters && "couponUsed" in filters) {
                query = { $and: [
                    { $text: { $search: filters["location"] } } , 
                    { "couponUsed": { $eq: filters["couponUsed"] } }
                ]}
            } 
            else if ("couponUsed" in filters && ("purchaseMethod" in filters)) {
                query = { $and: [ 
                    { "purchaseMethod": { $eq: filters["purchaseMethod"] } } , 
                    { "couponUsed": { $eq: filters["couponUsed"] }  } 
                ]}
            }
            else if ("location" in filters) {
                query =  { $text: { $search: filters["location"] } }
            }
            else if ("purchaseMethod" in filters) {
                query =  { "purchaseMethod": { $eq: filters["purchaseMethod"] } } 
            }
            else {
                query = { "couponUsed": { $eq: filters["couponUsed"] }  }
            }
        } 

        let cursor
        
        try {
            cursor = await sales.find(query)
        } 
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
                return { SalesList: [], totalNumSales: 0 }
        }

        let displayCursor = await cursor.limit(SalesPerPage).skip(SalesPerPage * page)

        try {
            let SalesList = await displayCursor.toArray()

            let totalNumSales = await sales.countDocuments(query)

            return { SalesList, totalNumSales }
        } 
        catch (e) {
            console.error(
                `Unable to convert cursor  to array or problem counting documents, ${e}`,
            )
            return { SalesList: [], totalNumSales: 0 }
        }
    }

    static async getSaleById(orderId) {
        try {
            const sale=await sales.find({_id: ObjectId(orderId)})

            return sale.toArray()
        }
        catch(e) {
            return {error: e}
        }
    }

    static async addSale(customer, storeLocation, purchaseMethod, items, couponUsed, date) {

        try {
          const saleDoc = {
            saleDate: date,
            items: items,
            storeLocation: storeLocation,
            customer: customer,
            couponUsed: couponUsed,
            purchaseMethod: purchaseMethod
          }
          
          console.log(saleDoc)
          return await sales.insertOne(saleDoc)
        } 
        catch (e) {
          console.error(`Unable to post sale: ${e}`)
          return { error: e }
        }

      }

    static async deleteSale(orderId) {
        try {
            const deleteResponse = await sales.deleteOne({
                _id: ObjectId(orderId)
            })
            console.log(deleteResponse)
            return deleteResponse
        }
        catch(e) {
            console.error('Unable to delete Sale : ${e}') 
            return {error: e}
        }
    }

    static async getPurchaseMethods() {
        try{
            const purchaseMethods = await sales.distinct("purchaseMethod")
            // console.log(purchaseMethods)
            return purchaseMethods
        }
        catch(e) {
            console.error('Unable to find distinct purchase methods: ${e}') 
            return {error: e}
        }    
    }

    static async getStoreLocations() {
        try {
            const locations = await sales.distinct('storeLocation')

            return locations
        }
        catch(e) {
            return  {error: e}
        }
    }

}

/*

  static async deleteReview(reviewId, userId) {

    try {
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id: userId,
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }

*/