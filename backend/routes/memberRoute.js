import express from 'express'
import { createMember,getAllMembers,getMemberByCode,updateMember,deleteMember } from '../controllers/memberControllers.js'


const memberRouter = express.Router()
memberRouter.post('/addmember',createMember),
memberRouter.get('/getmember',getAllMembers)
memberRouter.get('/getmember/:membershipCode',getMemberByCode),
memberRouter.put('/updatemember/:membershipCode',updateMember)
memberRouter.delete('/deletemember/:membershipCode',deleteMember)

export default memberRouter