import express, { request, response } from "express";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import { engine } from "express-handlebars";
import __dirname  from "./utils.js";
import * as path from "path";
import ProductManager from "./controllers/ProductManager.js";
import {Server} from "socket.io";
import viewsRouter from "./router/views.routes.js"
import mongoose from "mongoose";
import productsRouter from "./router/productsmodel.routes.js";
import messagesRouter from "./router/messagesmodel.routes.js";
import cartsRouter from "./router/cartsmodel.routes.js";


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