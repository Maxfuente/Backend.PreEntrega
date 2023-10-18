document.getElementById('username-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const userInputElement = document.getElementById('username');
    const messageInputElement = document.getElementById('message');
  
    const user = userInputElement.value;
    const message = messageInputElement.value;
  
    try {
      const response = await fetch('/api/msg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, message }),
      });
  
      if (response.ok) {
        // Procesar la respuesta si es necesario
      } else {
        // Manejar errores si la respuesta no es exitosa
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  });
  