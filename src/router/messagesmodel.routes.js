import { Router, request, response } from "express";
import { messagesModel } from "../models/messagesmodel";

const router = Router();

router.get('/', async(request,response)=>{
    try {
        let messages = await messagesModel.find();
        response.send({result: "success", payload: messages});
    } catch(error){
        console.log(error);
    }
});
router.post('/', async (request,response)=>{
    let{user, message}= request.body;
    if(!user||!message){
        response.send({status:"error", error:"Missing body params"});
    }
    let result = await messagesModel.create({user,message});
    response.send({ result:"success",payload: result});
});

router.put('/:id_msg', async(request,response)=>{
    let{id_msg} = request.params;

    let messagesToReplace = request.body;
    if(!messagesToReplace.user|| !messagesToReplace.message){
        response.send({status:"error", error:"Missing body params"});
    }
    let result = await messagesModel.updateOne({_id: id_msg},messagesToReplace);
    response.send({result:"success",payload:result});
});

router.delete('/:id_msg', async(request, response)=>{
    let {id_msg} = request.params;
    let result = await messagesModel.deleteOne({_id: id_msg});
    response.send({ result:"succes", payload:result});
});


export default router