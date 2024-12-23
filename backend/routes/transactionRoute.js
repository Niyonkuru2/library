import express from 'express'
import {createTransaction,getAllTransactions,returnBook,getTransactionById} from '../controllers/transactionControllers.js'


const transactionRouter = express.Router()
transactionRouter.post('/addtransaction',createTransaction),
transactionRouter.get('/gettransactions',getAllTransactions)
transactionRouter.post('/return',returnBook),
transactionRouter.put('/updatebook/:transactionId',getTransactionById)


export default transactionRouter