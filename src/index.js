import express, { request, response } from "express";
import ProductManager from "./controllers/ProductManager.js";
import res from "express/lib/response.js";

const product = new ProductManager();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/products", async (request,response)=>{
    response.send (await product.getProducts())
})

app.post("/products", async (request,response)=>{
   let newProduct = request.body
   response.send (await product.addProducts(newProduct))
})

app.listen(PORT, ()=>{
    console.log(`Servidor PortEXpress ${PORT}`);
});

