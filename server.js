const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app); //Definição do protocolo 'http'.
const io = require('socket.io')(server); //Definição do protocolo 'werbsocket ou wss (protocolo do socket.io)'.

//Definição do diretório onde ficarão os arquivos front-end da aplicação.
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile); //Definição da engine padrão do 'ejs'.
app.set('views engine', 'html');

app.use('/',(req, res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(3000);