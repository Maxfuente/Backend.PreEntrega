import  { promises as fs } from "fs";
import { nanoid } from "nanoid";

class ProductManager {
    constructor() {
        this.path = "./src/models/products.json";
    }

readProducts = async () => {
    let products = await fs.readFile(this.path, "utf-8");
    return JSON.parse(products);
} ;


writeProducts = async (product) => {
    await fs.writeFile(this.path, JSON.stringify(product));
};


addProducts = async (product) =>{
let productsOld = await this.readProducts()  
product.id = nanoid() 
let productAll = [...productsOld, product]
await this.writeProducts(productAll)
return "Producto Agregado Exitosamente"
};

getProducts = async ()=>{
return await this.readProducts()
}
}

export default ProductManager

