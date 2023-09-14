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
    response.send (await carts.getPCartsById(request.params.id))
})



export default CartRouter