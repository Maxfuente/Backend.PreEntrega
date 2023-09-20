const socket = io();
socket.emit("message","Hola estamos conectados atraves de websocket")

socketServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Manejar eventos del formulario de agregar producto
    socket.on('add-product', (productName) => {
        // Aquí puedes agregar la lógica para guardar el producto en tu base de datos o en memoria
        console.log(`Producto agregado: ${productName}`);

        // Enviar un mensaje a todos los clientes para actualizar la lista de productos
        socketServer.emit('update-products', productName);
    });

    // Manejar eventos del formulario de eliminar producto
    socket.on('delete-product', (productName) => {
        // Aquí puedes agregar la lógica para eliminar el producto de tu base de datos o en memoria
        console.log(`Producto eliminado: ${productName}`);

        // Enviar un mensaje a todos los clientes para actualizar la lista de productos
        socketServer.emit('update-products', productName);
    });
});

// Manejar la presentación de la lista de productos en la página
socketServer.on('update-products', (productName) => {
    // Actualizar la lista de productos en la página
    const productList = document.getElementById('product-list');
    const listItem = document.createElement('li');
    listItem.textContent = productName;
    productList.appendChild(listItem);
});

// Manejar el envío del formulario de agregar producto
const addProductForm = document.getElementById('add-product-form');
addProductForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const productName = document.getElementById('product-name').value;

    // Enviar el nombre del producto al servidor WebSocket para agregarlo
    socket.emit('add-product', productName);

    // Limpiar el campo del formulario
    document.getElementById('product-name').value = '';
});
