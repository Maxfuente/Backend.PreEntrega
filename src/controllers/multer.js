import multer from "multer";
import __dirname from "../utils.js";

const storage = multer.diskStorage({
    destination: function(request, file, cb){
        cb(null, __dirname+ "/publics/files")
    },
    filename: function(request, file, cb){
        cb(null, file.originalname)
    }
})

export const uploader = multer({storage})