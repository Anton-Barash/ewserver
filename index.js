const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const indexRouter = require("./element/router");
const cors = require('cors');

const app = express();

// Разрешить запросы с определенного источника
const corsOptions = {
    origin: 'http://localhost:5173',
  };
  
  // Использовать CORS middleware с опциями
  app.use(cors(corsOptions))

app.use(express.json());
app.use('/api', indexRouter);


const server = http.createServer(app);
const io = socketIo(server);



io.on('connection', (socket) => {
    console.log('Пользователь подключился');

    socket.on('message', (data) => {
        console.log('Получено сообщение: ' + data);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

