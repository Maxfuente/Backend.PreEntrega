import express, { request, response } from "express";
import ProductManager from "./controllers/ProductManager.js";
import res from "express/lib/response.js";
import { parse } from "path";
import req from "express/lib/request.js";

const product = new ProductManager();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/products", async (request,response)=>{
    response.send (await product.getProducts())
})
app.get("/products/:id", async (request,response)=>{
    let id =  request.params.id
    response.send (await product.getProductsById(id))
})



app.post("/products", async (request,response)=>{
   let newProduct = request.body
   response.send (await product.addProducts(newProduct))
});

app.delete("/products/:id", async (request,response)=>{
    let id = request.params.id
    response.send (await product.deleteProducts(id))
});

app.listen(PORT, ()=>{
    console.log(`Servidor PortEXpress ${PORT}`);
});

