/* Base API - Yuta - Channel ( HYSTREAM API )
/* Segue o canal pra ficar por dentro de tudo. 🕊️
/* Não esquece de compartilhar nosso canal para mais conteúdos 😼*/

const express = require("express");
const cheerio = require("cheerio");
const path = require("path");
const axios = require("axios");
const fs = require("fs");

const router = express.Router();
router.get("/", async (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "login.html"));
});

router.get("/docs", async (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "docs.html"));
});

router.get("/apikeys", async (req, res) => {
    try {
        const keysPath = path.resolve(__dirname, "public", "keys.json");
        if (!fs.existsSync(keysPath)) {
            return res.status(404).json({ erro: "Arquivo não encontrado" });
        }
        const keys = fs.readFileSync(keysPath, "utf-8");
        res.setHeader("Content-Type", "application/json");
        res.send(keys);
    } catch (e) {
        console.error("Erro ao acessar keys.json:", e);
        res.status(500).json({ erro: "Erro no servidor interno" });
    }
});

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf[10]);
}

router.get("/api/validar-cpf", (req, res) => {
    const { cpf } = req.query;
    if (!cpf) return res.status(400).json({ erro: "Informe um CPF" });

    const valido = validarCPF(cpf);
    res.json({ cpf, valido });
});

module.exports = router;
