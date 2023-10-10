import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js"; 

const ProductRouter = Router();
const product = new ProductManager();


ProductRouter.get("/", async (request,response)=>{
    response.send (await product.getProducts())
})
ProductRouter.get("/:id", async (request,response)=>{
    let id =  request.params.id
    response.send (await product.getProductsById(id))
})

ProductRouter.post("/", async (request,response)=>{
   let newProduct = request.body
   response.send (await product.addProducts(newProduct))
});

ProductRouter.put("/:id", async (request,response)=>{
let id = request.params.id;
let updateProduct = request.body;
response.send (await product.updateProducts(id, updateProduct));
});


ProductRouter.delete("/:id", async (request,response)=>{
    let id = request.params.id
    response.send (await product.deleteProducts(id))
});


export default ProductRouter