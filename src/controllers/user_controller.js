const sharp=require("sharp") 
const User=require("../models/user.js")
const {sendWelcomeEmail,sendCancelationEmail}=require("../emails/account.js")

//create user
exports.create_user=async(req,res)=>{
    const user =new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(error){
        res.status(400).send(error)
    }
}
    
//login user
exports.login_user=async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()

        res.status(200).send({user,token})
    }catch(e){
        res.status(400).send()
    }
}

//logout all user
exports.logoutAll_users=async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
}

//logout user
exports.logout_user=async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
            res.status(500).send()
    }
}

//get user profile
exports.get_userProfile=async(req,res)=>{
    res.send(req.user)
}

//get user using id
exports.get_user=async(req,res)=>{
    const _id=req.params.id

    try{
        const user=await User.findById({_id})
        if(!user){
            res.status(404).send()
        }   
        res.send(user)    
    }catch(error){
        res.status(500).send(error)
    }
}

//update user profile
exports.update_userProfile=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["name","email","password","age","gender"]
    const isValid=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error:"invalid update!"})
    }
    try{
        updates.forEach((update)=>req.user[update]=req.body[update])
        req.user.save()
        res.status(201).send(req.user)
    }catch(error){
        res.status(500).send(error)
    }

}

//update addresses in user
exports.update_userAddress=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["housename","area","pincode","city","state","name","phone"]
    const isValid=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error:"invalid update!"})
    }
    try{
        updates.forEach(async(update)=>{
         if(update==="housename"){
         await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.housename":req.body[update]}})
         }
         else if(update==="area"){
            await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.area":req.body[update]}})
            }
            else if(update==="pincode"){
                await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.pincode":req.body[update]}})
            }else if(update==="city"){
                await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.city":req.body[update]}})
            }else if(update==="state"){
                await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.state":req.body[update]}})
            }else if(update==="name"){
                await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.name":req.body[update]}})
            }else {
                await User.updateOne({"addresses._id":req.params.id},{$set:{"addresses.$.phone":req.body[update]}})
            } 
        })
        const user=await User.findById(req.user._id)
        res.status(201).send(user)
    }catch(error){
        res.status(500).send(error)
    }
}

//add address to user
exports.add_userAddress=async(req,res)=>{
    
    try{
        const user= await User.findOne({"addresses.housename":req.body.housename})
        console.log(user)
            if(!user){
            await User.findOneAndUpdate({_id:req.user._id},{$addToSet:{addresses:req.body}})
            const address= await User.findById(req.user._id)
            res.status(201).send(address)
        }else{
            throw error("address present")
        }
    }catch(error){
        res.status(500).send(error)
    }

}

//delete user address
exports.delete_userAddress=async(req,res)=>{
    try{
        const user=await User.findOneAndUpdate({"addresses._id":req.params.id},{$pull:{addresses:{_id:req.params.id}}})
        console.log(user)
            await user.save()
            res.status(201).send(user)
    }catch(error){
        res.status(500).send(error)
    }

}

//delete user profile
exports.delete_profile=async(req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.user.id)
        sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(error){
        res.status(500).send(error)
    }
}

//upload avatar
exports.upload_avatar=async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer()

    req.user.avatar=buffer
    await req.user.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({"error":error.message})
}

//delete avatar
exports.delete_avatar=async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.status(200).send()
 }

 //get avatar
exports.get_avatar=async(req,res)=>{
    const user=await User.findById(req.params.id)
    if(!user||!user.avatar){
        throw new Error("not found")
    }
    res.set("Content-Type","image/png")
    res.send(user.avatar)
}