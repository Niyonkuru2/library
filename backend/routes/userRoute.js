import express from 'express'
import {registerUser,loginUser,resetPassword,requestResetPassword} from '../controllers/usersControllers.js'

const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.post('/request-reset-password',requestResetPassword);
userRouter.post('/reset-password/:token',resetPassword);

export default userRouter;