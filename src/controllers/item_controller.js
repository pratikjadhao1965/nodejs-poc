const sharp=require("sharp") 
const Item=require("../models/item.js")

//create item using shop authentication
exports.create_item=async(req,res)=>{
    const item=new Item({
        ...req.body,
        shopId:req.shop._id
    })
    try{
        await item.save()
        res.status(201).send(item)
    }catch(error){
        res.status(400).send(error)
    }
}

//get shop items 
//by matching catagory="catagory_name"
//by sorting sortBy=createdAt:desc
exports.get_items=async(req,res)=>{
    const match={}
    const sort={}
    if(req.query.catagory){
        match.catagory=req.query.catagory
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(":")
        sort[parts[0]]=parts[1]==="desc" ? -1 : 1
    }
    try{
        await req.shop.populate({
            path:"shopItems",
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.shop.shopItems)
    }catch(error){
        res.status(500).send()
    }
}

//get item using id
exports.get_item=async(req,res)=>{
    const _id=req.params.id
    try{
        const item=await Item.findOne({_id,shopId:req.shop._id})
        if(!item){
            return res.status(404).send()
        } 
        res.send(item)
    }catch(error){
        res.status(500).send()
    }
}

//update shop item using id
exports.update_item=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["name","price","catagory","productioninfo","description","quantity"]
    const isValid=updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error:"invalid update!"})
    }

    try{
        const item=await Item.findById({_id:req.params.id,shopId:req.shop._id})
        if(!item){
           return res.status(404).send()
        }
        updates.forEach((update)=>item[update]=req.body[update])
        item.save()
        res.status(201).send(item)
    }catch(error){
        res.status(500).send(error)
    }

}

//delete shop item sing id
exports.delete_item=async(req,res)=>{
    try{
        const item=await Item.findOneAndDelete({_id:req.params.id,shopId:req.shop._id})
        if(!item){
            return res.status(404).send()
        }
        res.send(item)
    }catch(error){
        res.status(500).send(error)
    }
}

//upload item image using id
exports.upload_image=async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer()

    const item=await Item.findOne({_id:req.params.id,shopId:req.shop._id})
    item.image=buffer
    await item.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({"error":error.message})
}

//delete item image using id
exports.delete_image=async(req,res)=>{
    const item=await Item.findOne({_id:req.params.id,shopId:req.shop._id})
    item.image=undefined
    await item.save()
    res.status(200).send()
 }

 //get item image using id
 exports.get_image= async(req,res)=>{
    const item=await Item.findById(req.params.id)
    if(!item||!item.image){
        throw new Error("not found")
    }
    res.set("Content-Type","image/png")
    res.send(item.image)
}