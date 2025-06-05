import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

const connectToDB = async () => {
  try{
    const mongoURI  = process.env.MONGO_URI;
    if(mongoURI){
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected successfully !!');
    }
    else {
      throw new Error('MONGO_URI environment variable is not defined');
    }
  }
  catch {
    console.error('Error connecting MongoDB !!');
    process.exit(1);
  }
};

export default connectToDB;