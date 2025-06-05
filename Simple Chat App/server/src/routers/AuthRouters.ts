import {Router} from 'express'
import { getUserInfo, logIn, logOut, signUp, updateProfile } from '../controllers/AuthControllers';
import { verifyToken } from '../middlewares /authMiddlewares';


const authRoutes = Router();

authRoutes.post('/signUp' , signUp);
authRoutes.post('/logIn' , logIn);
authRoutes.get('/user-info' , verifyToken , getUserInfo);
authRoutes.post('/logOut' , logOut);
authRoutes.post('/update-profile' , updateProfile);


export default authRoutes;