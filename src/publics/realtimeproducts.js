const socket = io();
socket.emit("message","Hola estamos conectados atraves de websocket")

socketServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

})
