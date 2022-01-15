import express from 'express'
import StoresController from './stores.controller.js'

const router = express.Router()

router.route('/')
        .get(StoresController.apiGetStores)


export default router