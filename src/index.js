import express, { request, response } from "express";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import { engine } from "express-handlebars";
import __dirname  from "./utils.js";
import path from "path";
import ProductManager from "./controllers/ProductManager.js";
import viewsRouter from "./router/views.router.js";
import {Server} from "socket.io";


const app = express();
const httpServer = app.listen(8080,()=>console.log(`Servidor PortEXpress 8080`));
const socketServer = new Server(httpServer);
const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.use("/", express.static(__dirname + "/publics"));
app.use("/", viewsRouter);

socketServer.on('connection',(socket)=>{
    console.log('Nuevo cliente conectado');

    
});

app.get("/", async (request,response)=>{
    let allproducts = await product.getProducts()
    response.render("home",{
        title: "Backend.PreEntrega",
        products: allproducts
    })
} );

app.use("/api/products",ProductRouter);
app.use("/api/carts",CartRouter);



