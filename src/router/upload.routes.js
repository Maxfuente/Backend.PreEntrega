import { Router, request, response } from "express";
import { uploader } from "../controllers/multer.js";

const router = Router();

let products =[];

router.get("/", (request, response)=>{
    response.send({ status:"success", payload: products});
})

router.post("/upload", uploader.single("file"),(request, response)=>{

    if (!request.file){
        return response.status(400).send({ status: "error", error: "No se guardo la imagen"});
    }
    let prod = request.body;
    prod.profile = request.file.path;
    products.push(prod);
    response.send({ status:"success", message: "La imagen ha sido guardada"});
});

export default router