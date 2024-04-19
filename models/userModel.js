const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String
    },
    mobile:{
        type:String,
        required:true
    },
    address:{
        required:true,
        type:String
    },
    citizenshipNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','voter'],
        default:'voter'
    },
    isVoted:{
        default:false,
        required:true,
        type:Boolean
    }

});
userSchema.pre("save", async function(next){
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      next();
    } catch(error) {
          return next(error);
    }
  });
  userSchema.methods.comparePassword = async function(candidatePassword){
      try{
          const isMatch = await bcrypt.compare(candidatePassword,this.password);
          return isMatch;
      }catch(err){
          throw err;
      }
  }
const User = mongoose.model('User',userSchema);
module.exports = User;