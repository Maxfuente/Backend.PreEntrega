import  { promises as fs } from "fs";
import { nanoid } from "nanoid";

class CartManager {
    constructor(){
        this.path = "./src/models/carts.json";
    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    };

    writeCarts = async (carts) => {
        await fs.writeFile(this.path, JSON.stringify(carts));
    };

    exist = async (id)=>{
        let carts = await this.readCarts()
        return carts.find(cart => cart.id === id)    
    };

    addCarts = async()=>{
        let cartsOld = await this.readCarts();
        let id  = nanoid()
        let cartsConcat = [{id :id, products : []}, ...cartsOld]
        await this.writeCarts(cartsConcat)
        return "Carro agregado"

    }

    getPCartsById = async (id)=>{
        let cartById = await this.exist(id)
        if (!cartById) return "No esta el carro"
        return cartById
        };
}

export default CartManager