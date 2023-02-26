import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io();

socket.on("hello", (arg) => {
    console.log(arg)
});

socket.emit("hello", "Obrigado!!!")