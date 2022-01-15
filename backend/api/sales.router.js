import express from 'express'
import SalesController from './sales.controller.js'

const router = express.Router()

router.route('/sales')
        .get(SalesController.apiGetSales)
        // .get(SalesController.apiGetMonthlySales)

router.route('/sale/:id')
        .get(SalesController.apiGetSale)
        .delete(SalesController.apiDeleteSale)
        // .patch(SalesController.apiPatchSale)

router.route('/sale')
        .post(SalesController.apiPostSale)

router.route('/purchaseMethods')
        .get(SalesController.apiGetPurchaseMethods)

router.route('/storeLocations')
        .get(SalesController.apiGetLocations)

// router.route('/predict')
//         .post(SalesController.apiPredictRevenue)

// router.route('/tags') -> Return all location selling a 
//         .get(StoresController.apiGetStores)

// router.get('/')

export default router