import { Router, request, response } from "express";
import { productsModel } from "../models/productsmodel.js";

const router = Router();

router.get('/', async(request,response)=>{
    try {
        let products = await productsModel.find();
        response.send({result: "success", payload: products});
    } catch(error){
        console.log(error);
    }
});
router.post('/', async (request,response)=>{
    let{description, image, price, stock}= request.body;
    if(!description|| !image|| !price|| !stock){
        response.send({status:"error", error:"Missing body params"});
    }
    let result = await productsModel.create({description, image, price, stock});
    response.send({ result:"success",payload: result});
});

router.put('/:id_prod', async(request,response)=>{
    let{id_prod} = request.params;

    let productsToReplace = request.body;
    if(!productsToReplace.description|| !productsToReplace.image||!productsToReplace.price||!productsToReplace.stock){
        response.send({status:"error", error:"Missing body params"});
    }
    let result = await productsModel.updateOne({_id: id_prod},productsToReplace);
    response.send({result:"success",payload:result});
});

router.delete('/:id_prod', async(request, response)=>{
    let {id_prod} = request.params;
    let result = await productsModel.deleteOne({_id: id_prod});
    response.send({ result:"succes", payload:result});
});


export default router