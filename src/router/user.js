const express=require("express")
const multer=require("multer")
const user_controller=require("../controllers/user_controller")
const auth=require("../middleware/authUser.js")


const router=new express.Router()

router.post("/users",user_controller.create_user)

router.post("/users/login",user_controller.login_user)

router.post("/users/logoutAll",auth,user_controller.logoutAll_users)
 
router.post("/users/logout",auth,user_controller.logout_user)

router.get("/users/me",auth,user_controller.get_userProfile)

router.get("/users/:id",user_controller.get_user)

router.patch("/users/me",auth,user_controller.update_userProfile)

router.patch("/users/me/address/:id",auth,user_controller.update_userAddress)

router.patch("/users/me/deleteAddress/:id",auth,user_controller.delete_userAddress)

router.patch("/users/me/addAddress",auth,user_controller.add_userAddress)

router.delete("/users/me",auth,user_controller.delete_profile)

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
router.post("/users/me/avatar",auth,upload.single('avatar'),user_controller.upload_avatar)

//delete image
router.delete("/users/me/avatar",auth,user_controller.delete_avatar)

//getting image
router.get("/users/:id/avatar",user_controller.get_avatar)

module.exports=router