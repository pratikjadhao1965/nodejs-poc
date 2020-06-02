const Cart=require("../models/cart.js")
const User=require("../models/user.js")
const mongoose=require("mongoose")

//create cart without user logged in
exports.create_cart=async(req,res)=>{
    const newCart=new Cart({
    })
    try{
        await newCart.save()
    req.body.cartItems.forEach(async(cartItem)=>{
        await Cart.findOneAndUpdate({_id:newCart._id},{$addToSet:{cartItems:cartItem}})
    })
    const cart=await Cart.findById(newCart._id)
    console.log(cart)
        await cart.save()
        res.status(201).send(cart)
    }catch(error){
        res.status(400).send(error)
    }
}

//placing order by logging in and inserting fields deliveryAddress,payment,checkedout status
exports.submit_cart=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["deliveryAddress","payment"]
    const isValid=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error:"invalid update!"})
    }

    try{
        req.body.owner=req.user._id
        req.body.checkedOut=true
        const cart=await Cart.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!cart){
           return res.status(404).send()
        }
        res.status(201).send(cart)
    }catch(error){
        res.status(500).send(error)
    }

}

//getting all carts
exports.get_allCarts=async(req,res)=>{
    try{      
        const carts=await Cart.find()
        res.send(carts)
    }catch(error){
        res.status(500).send()
    }

}

//getting user cart when he is logged in
exports.get_ownerCart=async(req,res)=>{
    const _id=req.params.id
    try{
        const cart=await Cart.findOne({_id})
        await cart.populate("cartItems._id").execPopulate()
        const address=await User.aggregate([{$project:{_id:0,addresses:1}},{$unwind:"$addresses"},{$match:{'addresses._id':mongoose.Types.ObjectId(cart.deliveryAddress)}}])
        if(!cart){
            return res.status(404).send()
        } 
        res.send({cart,address})
    }catch(error){
        res.status(500).send()
    }
  
}

//delete cart
exports.delete_cart=async(req,res)=>{
    try{
        const cart=await Cart.findOneAndDelete({_id:req.params.id})
        if(!cart){
            return res.status(404).send()
        }
        res.send(cart)
    }catch(error){
        res.status(500).send(error)
    }
}

//update cart items
exports.update_cartItem=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["_id","quantity"]
    const isValid=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error:"invalid update!"})
    }
    try{
        let cartItem
        updates.forEach(async(update)=>{
            if(update==="quantity"){
                cartItem=await Cart.updateOne({"cartItems._id":req.body._id},{$set:{"cartItems.$.quantity":req.body.quantity}})
            }
        })
        if(!cartItem){
            await Cart.findOneAndUpdate({_id:req.params.id},{$addToSet:{cartItems:req.body}})
        }
            const cart=await Cart.findOne({"cartItems._id":req.body._id})
            console.log(cart)
            await cart.save()
            res.status(201).send(cart)
    }catch(error){
        res.status(500).send(error)
    }

}

//delete cart items
exports.delete_cartItem=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["_id"]
    const isValid=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error:"invalid update!"})
    }
    try{
            await Cart.findOneAndUpdate({_id:req.params.id},{$pull:{cartItems:{_id:req.body._id}}})
            const cart=await Cart.findOne({_id:req.params.id})
            console.log(cart)
            await cart.save()
            res.status(201).send(cart)
    }catch(error){
        res.status(500).send(error)
    }

}