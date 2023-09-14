import { Router, request, response } from "express";
import CartManager from "../controllers/CartManager.js";

const CartRouter = Router()
const carts = new CartManager  

CartRouter.post("/", async (request, response)=>{
    response.send (await carts.addCarts())
})

CartRouter.get("/", async (request,response)=>{
    response.send (await carts.readCarts())
})

CartRouter.get("/:id", async (request,response)=>{
    response.send (await carts.getCartsById(request.params.id))
})

CartRouter.post("/:cid/products/:pid", async (request, response)=>{
    let cartId = request.params.cid
    let productId = request.params.pid
    response.send (await carts.addProductInCart(cartId, productId))
})



export default CartRouter