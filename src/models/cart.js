const mongoose=require("mongoose")
const validator=require("validator")
const Item=require("./item")
const cartSchema=new mongoose.Schema({
    cartItems:[{
        _id:{
            type:mongoose.Schema.Types.ObjectId,
           required:true,
           unique:true,
            ref:"Item"
        },
        quantity:{
            type:Number,
            trim:true,
            default:1
        }
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        unique:true,
        ref:"User"
        
    },
    total:{
        type:Number,
        trim:true,
        default:0
    },
    checkedOut:{
        type:Boolean,
        default:false
    },
    deliveryAddress:{
        type:mongoose.Schema.Types.ObjectId
    },
    payment:{
        type:String
    }
},{
    timestamps:true
})

cartSchema.virtual('address',{
    ref:'User',
    localField:'deliveryAddress',
    foreignField:'addresses._id'
})

cartSchema.pre("save",async function(next){
    const cart=this   
    await cart.populate("cartItems._id").execPopulate()
    cart.total=0
    cart.cartItems.forEach(async(item) => {
        cart.total=cart.total+item._id.price*item.quantity
        item._id.stock=item._id.stock-1
        const stock1={stock:item._id.stock}
        await Item.findByIdAndUpdate(item._id._id,stock1,{new:true,runValidators:true})
        
    });
    
    
    next()
})

const Cart=mongoose.model("Cart",cartSchema)

module.exports=Cart