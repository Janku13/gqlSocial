const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const {UserInputError} = require("apollo-server")
const {validateRegisterInput,validateLoginInput} = require('../../util/validators')

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;


function generateToken(user) {
  return jwt.sign({
        id: res.id,
        email: res.email,
        username: res.username,
      },SECRET_KEY,{expiresIn:'3h'});
  
}

module.exports = {
  Mutation: {
    async login(_,{username,password}){

      const {errors,valid} = validateLoginInput(username,password)
      if(!valid){
        throw new UserInputError('Wrong data')
      }
      const user = await User.findOne({username})
      if(!user){
        errors.general = 'User not found'
        throw new UserInputError('User not found')
      }
      const match = await bcrypt.compare(password,user.password)
      if(!match){
        errors.general = 'Wrong inf'
        throw new UserInputError("Wrong credentials",{errors})
      }
      const token = generateToken(user)
       return {
        ...user._doc,
        id:user._id,
        token
       }
    },
    async register(
      _,
      { 
        registerInput: { username, email, password, confirmePassword } 
      },
    ) {
      const {valid,errors} = validateRegisterInput(username,email,password,confirmePassword)
      if(!valid){
        throw new UserInputError('Errors',{errors})
      }
      const user = await User.findOne({username})
      const mail = await User.findOne({email})
      if(user){
        throw new UserInputError('Username is taken',{
          errors:{
            username: 'This username is taken'
          }
        })
      }
      if(mail){
        throw new UserInputError('email is registred',{
          errors:{
            email: 'This email is registred'
          }
        })
      }
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateToken(res)
      
      return {
        ...res._doc,
        id:res._id,
        token
       }
    },


    //TODO: validate user data
    //TODO: Make sure user doesnt exist
    //todo: hash password and create and auth token
  },
};
