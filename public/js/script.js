import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();

let modal = document.querySelector(".modal");
let btnSalvarUsuario = document.querySelector(".btn-salvar-usuario");
let btnEnviar = document.querySelector(".btn-enviar");
let inputNomeUsuario = document.querySelector("input.nome-usuario");
let helpNomeUsuario = document.querySelector(".help-nome-usuario");
let inputMensagem = document.querySelector(".input-mensagem");
let mensagensDiv = document.querySelector(".mensagens");
let usuariosDiv = document.querySelector(".usuarios-lista");
let btnMudarNome = document.querySelector(".btn-mudar-nome");

let nomeUsuario = null;

if(localStorage.getItem("mychat-nome-usuario")){
    modal.classList.remove("is-active");
    nomeUsuario = localStorage.getItem("mychat-nome-usuario");
    socket.emit("usuarioConectado", nomeUsuario);
}

function salvarNome(nome){
    let nomeAntigo = nomeUsuario;
    localStorage.setItem("mychat-nome-usuario", nome);
    nomeUsuario = nome;

    if(nome == null){
        socket.emit("usuarioConectado", nomeUsuario);
    }else{
        socket.emit("mudarNomeUsuario", {
            antigo: nomeAntigo,
            novo: nomeUsuario
        });
    }
}

btnMudarNome.onclick = () => {
    modal.classList.add("is-active");
    inputNomeUsuario.value = nomeUsuario;
}

btnSalvarUsuario.onclick = () => {
    let nome = inputNomeUsuario.value;

    if(nome.length < 3){
        helpNomeUsuario.classList.remove("d-none");
        return;
    }

    helpNomeUsuario.classList.add("d-none");
    modal.classList.remove("is-active");

    salvarNome(nome);
}

btnEnviar.onclick = () => {
    if(inputMensagem.value.length > 0){
        enviarNovaMensagem();
    }
}

inputMensagem.onkeypress = (event) => {
    if(event.key === "Enter" && inputMensagem.value.length > 0){
        enviarNovaMensagem();
    }
}

function enviarNovaMensagem(){
    socket.emit("mensagem", {
        usuario: nomeUsuario,
        mensagem: inputMensagem.value
    });

    inputMensagem.value = "";
}

socket.on("mensagens", (dados) => {
    limparMensagens();

    dados.forEach(e => {
        let mensagem = document.createElement("p");
        mensagem.innerHTML = `
        <span class="has-text-weight-bold mr-2">${e.usuario}:</span>
        <span>${e.mensagem}</span>
        `;

        mensagensDiv.appendChild(mensagem);
    });
});

socket.on("usuarios", (dados) => {
    limparUsuarios();

    dados.forEach(e => {
        let usuario = document.createElement("li");
        usuario.classList.add("has-text-weight-bold");
        usuario.classList.add("mb-3");
        usuario.innerText = e;

        usuariosDiv.appendChild(usuario);
    });
});

function limparMensagens(){
    let mensagens = document.querySelectorAll(".mensagens p");

    mensagens.forEach(m => {
        m.remove();
    })
}

function limparUsuarios(){
    let usuarios = document.querySelectorAll(".usuarios-lista li");

    usuarios.forEach(u => {
        u.remove();
    })
}