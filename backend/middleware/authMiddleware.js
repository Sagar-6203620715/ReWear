const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const protect = async (req, res, next) => {
  let token;

  if(
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
  ){
    try{
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token.substring(0, 20) + "...");
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      req.user = await User.findById(decoded.user.id).select("-password");
      console.log("User found:", req.user ? req.user._id : "No user found");
      
      if (!req.user) {
        return res.status(401).json({message:"User not found"});
      }
      
      next();

    }catch(error){
      console.error("token verification failed",error);
      res.status(401).json({message:"not authorized,token failed"});
    }
  }else{
    res.status(401).json({message:"not authorized,no token provided"});
  }
};

//middleware to check if user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({message: "not authorised as an admin"});
  }
};

module.exports = {protect, admin};