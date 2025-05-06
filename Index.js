/* Base API - Yuta - Channel ( HYSTREAM API )
/* Segue o canal pra ficar por dentro de tudo. 🕊️
/* Não esquece de compartilhar nosso canal para mais conteúdos 😼*/

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const USERS_FILE = './privado/users.json';
const app = express();
//const port = process.env.PORT || 25581;

//pra ligar no termux👇
const port = 5014;
const mainrouter = require('./main.js');
app.enable('trust proxy');
app.set('json spaces', 2);
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.use('/', mainrouter); app.use((err, req, res, next) => { console.error(err.stack); res.status(500).send('Something broke!'); });

app.use('/docs', mainrouter); app.use((err, req, res, next) => { console.error(err.stack); res.status(500).send('Something broke!'); });

app.get('/users', (req, res) => {
  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    if (err) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: 'Erro ao ler o arquivo de usuários.' });
    }
    const users = JSON.parse(data || '[]');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios.' });
  }

  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    if (err) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: 'Erro ao acessar os usuários.' });
    }

    const users = JSON.parse(data || '[]');
    if (users.some(user => user.username === username)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'Usuário já existe.' });
    }

    users.push({ username, password });
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), err => {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: 'Erro ao salvar o usuário.' });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ success: 'Usuário registrado com sucesso!' });
      res.sendFile(path.join(__dirname, '/login'));
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    if (err) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: 'Erro ao acessar os usuários.' });
    }

    const users = JSON.parse(data || '[]');
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ success: 'Login bem-sucedido!' });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(400).json({ error: 'Usuário ou senha incorretos.' });
      res.sendFile(path.join(__dirname, 'public', 'docs.html'));
    }
  });
});

//Lm Only
app.get('/api/keyerrada', (request, response) => {
    const { apikey } = request.query;

    response.setHeader('Content-Type', 'application/json'); //sla
    
    if (!apikey) // Ver se insiriu a key correto
    {
        return response.status(404).json({
            error: "Cadê a Key?"
        });
    }
    
    //Ler a poha do arquivo em modo sincrono
    fs.readFile('./privado/keys.json', 'utf8', (error, data) => {
        if (error)
        { //Kkkkkkkkkkk
            return response.status(500).json({ 
                error: 'Erro interno.' 
            });
        }
        
        let ApiKeyNk = JSON.parse(data);
        ApiKeyNk = ApiKeyNk.apikeys.find(xvideos => xvideos.apikey === apikey);

        if (!ApiKeyNk) 
        {
            return response.status(404).json({
                message: `📌APIKEY ${apikey} NÃO ENCONTRADO ✨`
            });
        }

        return response.status(200).json({
            result: `🚀 APIKEY VERIFICADA COM SUCESSO ✅ || ✨ TOTAL DE REST API 💎: ` + Number(ApiKeyNk.requests)
        })
    });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
