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
};

getProductsById = async (id)=>{
let products = await this.readProducts()
let productById = products.find(prod => prod.id === id)
if (!productById) return " No esta el producto"
return productById
};

deleteProducts = async (id)=>{
    let products = await this.readProducts();
    let existProducts = products.some(prod => prod.id === id)
    if (existProducts){
    let filterProducts = products.filter(prod => prod.id != id)
    await   this.writeProducts(filterProducts)
    return "producto borrado"
    }   
    return "producto que se desea borrar no existe"
}
}

export default ProductManager

