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

io.on('connection', (socket) => {
    console.log("Nova conexão");

    socket.emit("hello", "Seja bem-vindo");
    socket.on("hello", (arg) => {
        console.log(arg);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});