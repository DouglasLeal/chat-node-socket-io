import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

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

app.get("/sala-csharp", (req, res) => {
    res.render("sala-csharp");
})

app.get("/sala-js", (req, res) => {
    res.render("sala-js");
})

//-------------------------------

let mensagens = { csharp: [], js: [] };
let usuarios = { csharp: [], js: [] };

const csharp = io.of("/sala-csharp").on('connection', (socket) => {
    socket.on("usuarioConectado", (dados) => {
        if (usuarios.csharp.indexOf(dados) < 0) {
            usuarios.csharp.push(dados);

            usuarios.csharp.sort();
        }

        csharp.emit("usuarios", usuarios.csharp);
    });

    socket.on("mudarNomeUsuario", (dados) => {
        usuarios.csharp.splice(usuarios.indexOf(dados.antigo), 1);
        usuarios.csharp.push(dados.novo);
        csharp.emit("usuarios", usuarios);
    });

    socket.on("mensagem", (dados) => {
        mensagens.csharp.push(dados);

        csharp.emit("mensagens", mensagens.csharp);
    });
});

const js = io.of("/sala-js").on('connection', (socket) => {
    socket.on("usuarioConectado", (dados) => {
        if (usuarios.js.indexOf(dados) < 0) {
            usuarios.js.push(dados);

            usuarios.js.sort();
        }

        js.emit("usuarios", usuarios.js);
    });

    socket.on("mudarNomeUsuario", (dados) => {
        usuarios.js.splice(usuarios.indexOf(dados.antigo), 1);
        usuarios.js.push(dados.novo);
        js.emit("usuarios", usuarios);
    });

    socket.on("mensagem", (dados) => {
        mensagens.js.push(dados);

        js.emit("mensagens", mensagens.js);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});