const express=require("express")
const cart_controller=require("../controllers/cart_controller")
const auth=require("../middleware/authUser.js")

const router=new express.Router()

router.post("/carts/save",cart_controller.create_cart)

router.patch("/carts/submit/:id",auth,cart_controller.submit_cart)

router.get("/carts",cart_controller.get_allCarts)

router.get("/carts/:id",auth,cart_controller.get_ownerCart)

router.patch("/carts/item/:id",cart_controller.update_cartItem)

router.patch("/carts/deleteItem/:id",cart_controller.delete_cartItem)

router.delete("/carts/:id",cart_controller.delete_cart)

module.exports=router