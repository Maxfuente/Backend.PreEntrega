import { Express, request, response } from "express";
import UserManager from "../controllers/UserManager.js";
import { Router } from "express";
import { createHash,isValidPassword } from "../utils.js";
import passport from "passport"

const userRouter = Router()
const user = new UserManager()

userRouter.post("/register", passport.authenticate("register",{failureRedirect:"/failregister"}), async ( request,response)=>{
try
    {
        const { first_name, last_name, email, age, password, rol }= request.body
        if (!first_name || !last_name || !email || !age)  return response.status(400).send({ status: 400, error: 'Faltan datos' })
        response.redirect("/login")
    } catch (error) 
    {
        response.status(500).send("Error al acceder al registrar: " + error.message);
    }
})
userRouter.get("/failregister",async(request,response)=>{
    console.log("Failed Strategy")
    response.send({error: "Failed"})
})

userRouter.post("/login", passport.authenticate("login", {failureRedirect:"/faillogin"}),async (req, res) => {
    try 
    {
        if(!req.user) return res.status(400).send({status:"error", error: "Credenciales invalidas"})
        
        if(req.user.rol === 'admin'){
            req.session.emailUsuario = req.user.email
            req.session.nomUsuario = req.user.first_name
            req.session.apeUsuario = req.user.last_name
            req.session.rolUsuario = req.user.rol
            res.redirect("/profile")
        }
        else{
            req.session.emailUsuario = req.user.email
            req.session.rolUsuario = req.user.rol
            res.redirect("/products")
        }

    } 
    catch (error) 
    {
        res.status(500).send("Error al acceder al perfil: " + error.message);
    }
})
userRouter.get("/faillogin",async(req,res)=>{
    res.send({error: "Failed Login"})
})

userRouter.get("/logout", async (req, res) => {
    req.session.destroy((error) =>{
        if(error)
        {
            return res.json({ status: 'Logout Error', body: error})
        }
        res.redirect('../../login')
    })    
})
userRouter.get("/github", passport.authenticate("github", {scope:["user:email"]}),async (req, res) => {})

userRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}),async (req, res) => {
    req.session.user = req.user
    req.session.emailUsuario = req.session.user.email
    req.session.rolUsuario = req.session.user.rol
    res.redirect("/products")
})

export default userRouter