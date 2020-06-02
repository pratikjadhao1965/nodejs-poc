const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email is invalid")
            }
        }
    },
    password:{
        type:String,
        required:true,  
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("password contains string 'password'")
            }
        }      
    },
    phone:{
        type:Number,
        //required:true,
        trim:true,
    },
    addresses:[{
        housename:{
            type:String,
            unique:true,
            required:true,
            trim:true,
            lowercase:true
        },
        area:{
            type:String,
            required:true,
            trim:true,
            lowercase:true
        },
        pincode:{
            type:Number,
            required:true,
            trim:true
        },
        city:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
        },
        state:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
        },
        name:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
        },
        phone:{
            type:Number,
            required:true,
            trim:true,
        }
    }],
    gender:{
        type:String,
        //required:true,
        trim:true
    },
    age:{
        type:Number,
        required:true,
        trim:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})


userSchema.virtual('cartitems',{
    ref:'Cart',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON= function(){
    const user=this
    const userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

//
userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email})

    if(!user){
        throw new Error("unable to login")
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("unable to login")
    }
    return user
}
//hashing password
userSchema.pre("save",async function(next){
    const user=this

    if(user.isModified("password")){
        user.password=await bcrypt.hash(user.password,8)
    }
    
    next()
})

// delete tasks when user is deleted
userSchema.pre('remove',async function(next){
    const user=this
    await task.deleteMany({owner:user._id})
    next()
})
const User=mongoose.model("User",userSchema)

module.exports=User