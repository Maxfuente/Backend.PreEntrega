import express from "express";


const router = express.Router()

router.get("/realtimeproducts", (request,response) => {
    response.render("realtimeProducts")

})



export default router