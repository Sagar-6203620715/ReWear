const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema=new mongoose.Schema(
  {
    name:{
      type:String,
      required:true,
      trim:true,
    },
    email:{
      type:String,
      required:true,
      unique:true,
      trim:true,
      match:[/.+\@.+\..+/,"Please enter a valid email adddress"],
    },
    password:{
      type:String,
      required:true,
      minLength:6,
    },
    role:{
      type:String,
      enum:["customer","admin"],
      default:"customer",
    },
    status:{
      type:String,
      enum:["active","suspended","pending"],
      default:"active",
    },
    profile:{
      avatar:{
        type:String,
        default:"",
      },
      bio:{
        type:String,
        maxLength:500,
        default:"",
      },
      location:{
        type:String,
        default:"",
      },
      phone:{
        type:String,
        default:"",
      },
      preferences:{
        categories:[{
          type:String,
          enum:["Tops", "Bottoms", "Dresses", "Outerwear", "Sweaters", "Accessories", "Shoes", "Bags", "Activewear"]
        }],
        sizes:[{
          type:String,
          enum:["XS", "S", "M", "L", "XL", "XXL", "One Size", "Custom"]
        }]
      }
    },
    stats:{
      itemsListed:{
        type:Number,
        default:0,
      },
      itemsSwapped:{
        type:Number,
        default:0,
      },
      totalSwaps:{
        type:Number,
        default:0,
      },
      memberSince:{
        type:Date,
        default:Date.now,
      }
    },
    // Moderation fields
    suspendedBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    suspendedAt:{
      type:Date
    },
    activatedBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    activatedAt:{
      type:Date
    }
  },
  {timestamps:true}
);

userSchema.pre("save",async function (next) {
  if(!this.isModified("password"))return next();
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
  next();
  
});

userSchema.methods.matchPassword=async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword,this.password);
  
};

module.exports=mongoose.model("User",userSchema);