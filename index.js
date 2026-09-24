const http = require('http');

const servidor = http.createServer((peticion, respuesta) => {
  respuesta.statusCode = 200;
  respuesta.setHeader('Content-Type', 'text/plain');
  respuesta.end('Hola mundo\n');
});

servidor.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});