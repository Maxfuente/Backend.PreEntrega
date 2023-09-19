import express, { request, response } from "express";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import { engine } from "express-handlebars";
import __dirname  from "./utils.js";
import path from "path";
import ProductManager from "./controllers/ProductManager.js";



const app = express();
const PORT = 8080;
const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

app.use("/", express.static(__dirname + "/publics"))


app.get("/", async (request,response)=>{
    let allproducts = await product.getProducts()
    response.render("home",{
        title: "Backend.PreEntrega",
        products: allproducts
    })
} );

app.use("/api/products",ProductRouter);
app.use("/api/carts",CartRouter);

app.listen(PORT, ()=>{
    console.log(`Servidor PortEXpress ${PORT}`);
});

