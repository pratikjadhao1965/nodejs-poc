const express=require("express")
const multer=require("multer")
const item_controller=require("../controllers/item_controller")
const authShop=require("../middleware/authShop.js")

const router=new express.Router()


router.post("/items",authShop,item_controller.create_item)

router.get("/items",authShop,item_controller.get_items)

router.get("/items/:id",authShop,item_controller.get_item)

router.patch("/items/:id",authShop,item_controller.update_item)

router.delete("/items/:id",authShop,item_controller.delete_item)

//upload image
const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cd){
        // if(!file.originalname.endsWith(".pdf"))
        if(!file.originalname.match(/\.(jpeg|png|jpg)$/)){
            return cd(new Error("please upload image"))
        }
        cd(undefined,true)
    }
})

router.post("/items/:id/image",authShop,upload.single('image'),item_controller.upload_image)

//delete image
router.delete("/items/:id/image",authShop,item_controller.delete_image)

//getting image
router.get("/items/:id/image",item_controller.get_image)


module.exports=router