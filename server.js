import express from "express";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";

const app = express();

app.use(cors());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static('public'));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.get("/", (req, res) => {
    res.render("index");
})

//-------------------------------

let mensagens = [];
let usuarios = [];

io.on('connection', (socket) => {
    socket.on("usuarioConectado", (dados) => {
        if(usuarios.indexOf(dados) < 0){
            usuarios.push(dados);
            io.emit("usuarios", usuarios);

            usuarios.sort();
        }       
    });

    socket.on("mudarNomeUsuario", (dados) => {
        usuarios.splice(usuarios.indexOf(dados.antigo), 1);
        usuarios.push(dados.novo);
        io.emit("usuarios", usuarios);     
    });

    socket.on("mensagem", (dados) => {
        mensagens.push(dados);

        io.emit("mensagens", mensagens);
    });

    io.emit("usuarios", usuarios);
    io.emit("mensagens", mensagens);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});