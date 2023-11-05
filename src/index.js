import express, { request, response } from "express";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import { engine } from "express-handlebars";
import __dirname, {authorization,passportCall}  from "./utils.js";
import * as path from "path";
import ProductManager from "./controllers/ProductManager.js";
import {Server} from "socket.io";
import viewsRouter from "./router/views.routes.js"
import mongoose from "mongoose";
import productsRouter from "./router/productsmodel.routes.js";
import messagesRouter from "./router/messagesmodel.routes.js";
import cartsRouter from "./router/cartsmodel.routes.js";
import uploadRouter from "./router/upload.routes.js";
import passport from "passport"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import initializePassport from "./config/passport.config.js"

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT,()=>console.log(`Servidor PortEXpress 8080`));
const product = new ProductManager();
const SocketServer = new Server(httpServer);


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));
app.set("views", __dirname+"/views");
app.use("/", viewsRouter);

app.use("/", express.static(__dirname + "/publics"));
app.get("/realtimeproducts", (request, response)=> {
    response.render("realtimeproducts")
});

app.get("/", async (request,response)=>{
    let allproducts = await product.getProducts()
    response.render("home",{
        title: "Backend.PreEntrega",
        products: allproducts
    })
} );

SocketServer.on("connection", (socket) => {
    console.log(`Usuario ${socket.id}`);

    socket.on("addProduct", async (productData) => {
        console.log('Datos del producto recibidos en el servidor:', productData)
        const result = await product.addProducts(productData);

        if (result === "Producto Agregado") {
            // Emitir un mensaje a través de WebSocket para actualizar la lista de productos en tiempo real
            SocketServer.emit("productAdded", productData);
        }
    });
});
mongoose.connect("mongodb+srv://maxfuentesa:7PSeJHxrZzPR9rmw@cluster0.l1les1f.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log("base de datos conectada")
})
.catch(error=>{
    console.error("Error en conexion con BD"+error)
});

app.use("/api/products",ProductRouter);
//app.use("/api/carts",CartRouter);

app.use("/api/carts",cartsRouter)
app.use("/api/msg",messagesRouter)
app.use("/api/prod",productsRouter)

app.get("/api/chat", async (request,response)=>{
    response.render("chat",{
        title:"Chat con mongoose"
    })
})

app.use("/upload", uploadRouter);


const users = [
    {id:1, email:"test@example.com", password:"pass123", role: "user"}
]

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Secret-key"
}

passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload, done)=>{
        const user = users.find((user) =>user.email ===jwt_payload.email)
        if(!user)
        {
            return done(null, false, {message:"Usuario no encontrado"})
        }
        return done(null, user)
    })
)


app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.post("/login", (req,res)=>{
    const {email, password} = req.body
    const user = users.find((user) => user.email === email)
    if(!user || user.password !== password){
        return res.status(401).json({message: "Error de autenticacion"})
    }
    const token = jwt.sign({email,password, role:"user"}, "Secret-key", {expiresIn: "24h"})
    res.cookie("token", token, {httpOnly: true, maxAge: 60*60*1000})
    console.log(token)
    res.json({token})   
})
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: app.get('views') });
});
app.get('/current', passportCall('jwt'), authorization('user'), (req,res) =>{
    res.send(req.user)
})