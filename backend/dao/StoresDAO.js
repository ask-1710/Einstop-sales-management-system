import mongodb from 'mongodb' ;
const ObjectId=mongodb.ObjectId

let stores

export default class StoresDAO {

    static async injectStoresDB(conn) {
        if (stores) {
            return
        }
        try {
            stores = await conn.db(process.env.STORES_DB_NAME).collection("stores")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in StoresDAO: ${e}`,
            )
        }
    }
 
    static async getStores() {

    let cursor
    
    try {
        cursor = await stores.find()
    } 
    catch (e) {
        console.error(`Unable to issue find command, ${e}`)
            return { StoresList: [], totalNumStores: 0 }
    }

    try {
        let StoresList = await cursor.toArray()

        let totalNumStores = await stores.countDocuments()

        return { StoresList, totalNumStores }
    } 
    catch (e) {
        console.error(
            `Unable to convert cursor  to array or problem counting documents, ${e}`,
        )
        return { StoresList: [], totalNumStores: 0 }
    }
}

}