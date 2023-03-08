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
    socket.on("usuarioConectado", (nome) => {
        let id = socket.id;

        usuarios.csharp.push({ id, nome});

        csharp.emit("usuarios", usuarios.csharp);
        csharp.emit("mensagens", mensagens.csharp);
    });

    socket.on("mudarNomeUsuario", (dados) => {
        let id = socket.id;

        usuarios.csharp.forEach((u, index) => {
            if (u.id == id) {
                usuarios.csharp[index].nome = dados;
            }            
        })
        csharp.emit("usuarios", usuarios.csharp);
    });

    socket.on("mensagem", (dados) => {
        if(mensagens.csharp.length == 100){
            mensagens.js.shift();
        }

        mensagens.csharp.push(dados);

        csharp.emit("mensagens", mensagens.csharp);
    });

    socket.on("disconnect", () => {        
        let id = socket.id;

        usuarios.csharp.forEach((u, index) => {
            if (u.id == id) {
                usuarios.csharp.splice(index, 1);
            }
        })

        csharp.emit("usuarios", usuarios.csharp);
    });
});

const js = io.of("/sala-js").on('connection', (socket) => {
    socket.on("usuarioConectado", (nome) => {
        let id = socket.id;

        usuarios.js.push({ id, nome});

        js.emit("usuarios", usuarios.js);
        js.emit("mensagens", mensagens.js);
    });

    socket.on("mudarNomeUsuario", (dados) => {
        let id = socket.id;

        usuarios.js.forEach((u, index) => {
            if (u.id == id) {
                usuarios.js[index].nome = dados;
            }            
        })
        js.emit("usuarios", usuarios.js);
    });

    socket.on("mensagem", (dados) => {
        if(mensagens.js.length == 100){
            mensagens.js.shift();
        }

        mensagens.js.push(dados);

        js.emit("mensagens", mensagens.js);
    });

    socket.on("disconnect", () => {        
        let id = socket.id;

        usuarios.js.forEach((u, index) => {
            if (u.id == id) {
                usuarios.js.splice(index, 1);
            }
        })

        js.emit("usuarios", usuarios.js);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});