import express from 'express'
import mongoose from 'mongoose'
import config from './config/config.js'
import passport from "passport"
import cookieParser from "cookie-parser"
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'
import usersRouter from './routes/users.router.js'
import ticketsRouter from './routes/tickets.router.js'
import UserMongo from "./dao/mongo/users.mongo.js"
import ProdMongo from "./dao/mongo/products.mongo.js"
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import __dirname, { authorization, passportCall, transport } from "./utils.js"
import initializePassport from "./config/passport.config.js"
import * as path from "path"
import {generateAndSetToken} from "./jwt/token.js"
import UserDTO from './dao/DTOs/user.dto.js'
import { engine } from "express-handlebars"
import {Server} from "socket.io"
import { createHash, isValidPassword } from './utils.js'
import compression from 'express-compression'
import { nanoid } from 'nanoid'
import loggerMiddleware from "./loggerMiddleware.js";
const app = express()
const port = 8081

const users = new UserMongo()
const products = new ProdMongo()


mongoose.connect(config.mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Secret-key"
}

passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload, done)=>{
        const user = users.findJWT((user) =>user.email ===jwt_payload.email)
        if(!user)
        {
            return done(null, false, {message:"Usuario no encontrado"})
        }
        return done(null, user)
    })
)


app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))
app.use(cookieParser());
app.use(compression());
initializePassport();
app.use(passport.initialize());
app.use(loggerMiddleware);

const httpServer = app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})
//---------------------------------------Socket.io-----------------------------------//

const socketServer = new Server(httpServer)

//-------------------------------Prueba conexión-------------------------------------------//
socketServer.on("connection", socket => {
    console.log("Socket Conectado")
//------Recibir información del cliente----------//
    socket.on("message", data => {
        console.log(data)
    })
//-----------------------------------------------//

    socket.on("newProd", (newProduct) => {
        products.addProduct(newProduct)
        socketServer.emit("success", "Producto Agregado Correctamente");
    });
    socket.on("updProd", ({id, newProduct}) => {
        products.updateProduct(id, newProduct)
        socketServer.emit("success", "Producto Actualizado Correctamente");
    });
    socket.on("delProd", (id) => {
        products.deleteProduct(id)
        socketServer.emit("success", "Producto Eliminado Correctamente");
    });

    socket.on("newEmail", async({email, comment}) => {
        let result = await transport.sendMail({
            from:'Chat Correo <bast.s.rojas@gmail.com>',
            to:email,
            subject:'Correo con Socket y Nodemailer',
            html:`
            <div>
                <h1>${comment}</h1>
            </div>
            `,
            attachments:[]
        })
        socketServer.emit("success", "Correo enviado correctamente");
    });
//-----------------------------Enviar información al cliente----------------------------------//
    socket.emit("test","mensaje desde servidor a cliente, se valida en consola de navegador")
//--------------------------------------------------------------------------------------------//
})
//Prueba Back con endpoint
app.use("/carts", cartsRouter)
app.use("/products", productsRouter)
app.use("/users", usersRouter)
app.use("/tickets", ticketsRouter)

//Prueba Front
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const emailToFind = email;
    const user = await users.findEmail({ email: emailToFind });

    if (!user) {
      req.logger.error("Error de autenticación: Usuario no encontrado");
      return res.status(401).json({ message: "Error de autenticación" });
    }

    // Comparar la contraseña proporcionada con la contraseña almacenada encriptada
    try {
        const passwordMatch = isValidPassword(user, password);

        if (!passwordMatch) {
            req.logger.error("Error de autenticación: Contraseña incorrecta");
            return res.status(401).json({ message: "Error de autenticación" });
        }

        // Si la contraseña coincide, puedes continuar con la generación de token y otras operaciones
        const token = generateAndSetToken(res, email, password);  // Aquí se encripta la contraseña antes de usarla
        const userDTO = new UserDTO(user);
        const prodAll = await products.get();
        res.json({ token, user: userDTO, prodAll });

        // Log de éxito
        req.logger.info("Inicio de sesión exitoso para el usuario: " + emailToFind);
    } catch (error) {
        // Manejo de errores relacionados con bcrypt
        req.logger.error("Error al comparar contraseñas: " + error.message);
        console.error("Error al comparar contraseñas:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});
app.post("/api/register", async (req, res) => {
    const { first_name, last_name, email, age, password, rol } = req.body;
    const emailToFind = email;
    const exists = await users.findEmail({ email: emailToFind });

    if (exists) {
        req.logger.warn("Intento de registro con un correo electrónico ya existente: " + emailToFind);
        return res.send({ status: "error", error: "Usuario ya existe" });
    }

    const hashedPassword = await createHash(password);
    const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        rol
    };

    try {
        users.addUser(newUser);
        const token = generateAndSetToken(res, email, password);
        res.send({ token });

        // Log de éxito
        req.logger.info("Registro exitoso para el usuario: " + emailToFind);
    } catch (error) {
        req.logger.error("Error al intentar registrar al usuario: " + error.message);
        console.error("Error al intentar registrar al usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
app.get('/', (req, res) => {
    req.logger.info("Se inicia página de Inicio de Login");
    res.sendFile('index.html', { root: app.get('views') });
});
app.get('/register', (req, res) => {
    req.logger.info("Se inicia página de Registro de Usuarios");
    res.sendFile('register.html', { root: app.get('views') });
});
app.get('/current',passportCall('jwt', { session: false }), authorization('user'),(req,res) =>{
    req.logger.info("Se inicia página de Usuario");
    authorization('user')(req, res,async() => {      
        const prodAll = await products.get();
        res.render('home', { products: prodAll });
    });
})
app.get('/admin',passportCall('jwt'), authorization('user'),(req,res) =>{
    req.logger.info("Se inicia página de Administrador");
    authorization('user')(req, res,async() => {    
        const prodAll = await products.get();
        res.render('admin', { products: prodAll });
    });
})
//-----------------------------------Mocking--------------------------------//
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
app.get("/mockingproducts", async(req,res)=>{

    const products = [];

    for (let i = 0; i < 50; i++) {
        const product = {
            id: nanoid(),
            description: `Product ${i + 1}`,
            image: 'https://example.com/image.jpg',
            price: getRandomNumber(1, 1000),
            stock: getRandomNumber(1, 100),
            category: `Category ${i % 5 + 1}`,
            availability: 'in_stock'
        };

        products.push(product);
    }

    res.send(products);
})
//-------------------------------------Mocking-----------------------------//