import { Request , Response } from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'

interface CustomRequest extends Request {
  user : {
    userId : string;
    email? : string;
  }
}

export const signUp = async (req : Request , res : Response) => {
  
  const {email , password} = req.body;

   try{
     if(!email || !password){
      return res.status(400).json({
        success : false,
        message :"user's credentials are invalid",
      });
     }

     const newUser = await User.create({email , password});

     res.status(201).json({
      success : true,
      message : 'New User created successfully !',
      user : {
        userId : newUser._id,
        email : newUser._id,
        password : newUser.password,
      }
     })
   }
   catch(error){
     res.status(500).json({
      success : false,
      message : `Error while resgistering ${error}`,
     });
   }
}


export const logIn = async (req : Request , res : Response) => {
   try{
     const {email , password} = req.body;
     const user = await User.findOne({email});
     if(!user){
      return res.status(400).json({
        success : false,
        message : 'User not found',
      });
     }

     const isMatch = await bcrypt.compare(password , user.password);

     if(!isMatch){
      return res.status(400).json({
        success : false,
        message : 'Invalid credentials',
      });
     }

     res.status(200).json({
      success : true,
      message : 'Logged In successfully !',
      user : {
        id : user._id,
        email : user.email,
      }
     })
   }
   catch(error){
     res.send(404).json({
       success : false,
       message : `Error while logging In ${error}`,
     })
   }
};

export const logOut = async (req : Request , res : Response) => {
  try{
    
  }
  catch(error){

  }
};

export const getUserInfo = async (req : CustomRequest , res : Response) => {
  try{
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({
        success : false,
        message : 'User not found !',
      });
    }

    return res.status(200).json({
      success : true,
      user : {
        id : user._id,
        email : user.email,
      }
    })
  }
  catch(error){
    return res.status(500).json({
      success : false,
      message : `Erro while fetching user info : ${error}`,
    })
  }
};

export const updateProfile = async (req : Request , res : Response) => {
  try{

  }
  catch(error){

  }
};