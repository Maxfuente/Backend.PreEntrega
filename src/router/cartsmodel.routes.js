import { Router, request, response } from "express";
import { cartsModel } from "../models/cartsmodel";

const router = Router();

router.get('/', async(request,response)=>{
    try {
        let carts = await cartsModel.find();
        response.send({result: "success", payload: carts});
    } catch(error){
        console.log(error);
    }
});
router.post('/', async (request,response)=>{
    let{description,quantity ,total}= request.body;
    if(!description||!quantity||!total){
        response.send({status:"error", error:"Missing body params"});
    }
    let result = await cartsModel.create({description,quantity,total});
    response.send({ result:"success",payload: result});
});

router.put('/:id_cart', async(request,response)=>{
    let{id_cart} = request.params;

    let cartsToReplace = request.body;
    if(!cartsToReplace.description|| !cartsToReplace.quantity|| !cartsToReplace.total){
        response.send({status:"error", error:"Missing body params"});
    }
    let result = await cartsModel.updateOne({_id: id_cart},cartsToReplace);
    response.send({result:"success",payload:result});
});

router.delete('/:id_cart', async(request, response)=>{
    let {id_cart} = request.params;
    let result = await cartsModel.deleteOne({_id: id_cart});
    response.send({ result:"succes", payload:result});
});


export default router