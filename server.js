import express from "express";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("index");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});