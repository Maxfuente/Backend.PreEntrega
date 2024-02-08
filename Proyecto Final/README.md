# Aplicación ecommerce

Este proyecto es el proyecto final de Backend de Coderhouse aplicando todo lo que hemos visto a lo largo del curso.

## Configuración del Proyecto

Este proyecto utiliza módulos ES6 en Node.js. Asegúrate de tener una versión de Node.js compatible.

# Versión de Node utilizada

v20.9.0

# Packages utilizados 

"bcrypt": "^5.1.1",
"cookie-parser": "^1.4.6",
"cron": "^3.1.6",
"dotenv": "^16.3.1",
"express": "^4.18.2",
"express-compression": "^1.0.2",
"express-handlebars": "^7.1.2",
"jsonwebtoken": "^9.0.2",
"mongoose": "^7.6.1",
"nanoid": "^5.0.3",
"nodemailer": "^6.9.7",
"nodemon": "^3.0.1",
"passport": "^0.6.0",
"passport-jwt": "^4.0.1",
"passport-local": "^1.0.0",
"socket.io": "^4.7.2",
"swagger-jsdoc": "^6.2.8",
"swagger-ui-express": "^5.0.0",
"sweetalert2": "^11.10.1",
"winston": "^3.11.0"
"chai": "^5.0.0",
"mocha": "^10.2.0",
"supertest": "^6.3.3"

## Ruta Acceso Github 

https://github.com/bastianSalinas/BackendCoder/tree/main/Desafios/Proyecto%20Final

## Comandos de Ejecución

Ecommerce Principal - npm start
Ejecución de test - npm run test

## Accesos al sistema

*Al momento de ejecutar aplicación se puede registrar un nuevo usuario*

Admin: admin@admin.cl password: 1234

Usuario:  usuario@usuario.cl password: 1234

Premium: premium@premium.cl password: 1234

## Importante

- Para verificar funcionalidad se deben colocar las rutas con el siguiente formato:

http://localhost:8080/carts 
http://localhost:8080/products
http://localhost:8080/users
http://localhost:8080/tickets

- Para probar las funcionalidades de envio de correos es importante colocar un correo valido para que desde mi correo bast.s.rojas@gmail.com se envie el correo correctamente

- Para ejecutar test completamente se debe ejecutar antes el proyecto con npm start y luego ejecutar npm run test para que funcionen correctamente todos los test

## Documentación de API

Se puede acceder a la documentación de la API con la url http://localhost:8080/apidocs/ 

