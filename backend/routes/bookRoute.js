import express from 'express'
import { createBook,getAllBooks,getBookByIsbn,deleteBook,updateBook } from '../controllers/bookControllers.js'
import upload from '../middleware/multer.js'

const bookRouter = express.Router()
bookRouter.post('/addbook',upload.single('image'),createBook),
bookRouter.get('/getbooks',getAllBooks)
bookRouter.get('/getbook/:isbn',getBookByIsbn),
bookRouter.put('/updatebook/:isbn', upload.single('image'), updateBook);
bookRouter.delete('/deletebook/:isbn',deleteBook)

export default bookRouter