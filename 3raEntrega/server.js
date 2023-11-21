import http from 'http';

const server = http.createServer((request, response) => {
  response.end('Mi primer hola mundo desde el backend.');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
