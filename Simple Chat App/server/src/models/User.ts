import mongoose , {Document , Schema} from 'mongoose'
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username : string;
  age? : number;
  email : string;
  password : string;
  createdAt? : Date;
  updatedAt? : Date;
}

const userSchema : Schema<IUser> = new mongoose.Schema(
  {
    username : {
      type :  String,
      required : true,
    },
    age : {
      type : Number,
      required : false,
    },
    email : {
      type : String,
      required : true,
    },
    password : {
      type : String,
      required : true,
    }, 
 },

  {
    timestamps : true
 }
);

// Hash the password befor saving

// next is a callback function provided by Mongoose middleware to signal that your middleware is done and the save operation can continue.

userSchema.pre('save' , async function(next) {
  console.log(this); // this is the user document about to be saved
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password , salt);
  next();
});

export default mongoose.model<IUser>('User' , userSchema);