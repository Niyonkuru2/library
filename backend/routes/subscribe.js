import express from 'express'
import {addSubscription} from '../controllers/subscribe.js'


const subscribeRouter = express.Router()
subscribeRouter.post('/addsubscribe',addSubscription)

export default subscribeRouter