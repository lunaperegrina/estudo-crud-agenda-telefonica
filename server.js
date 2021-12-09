require('dotenv').config() // O modulo la pra esconder as senhas do github

const express = require('express');
const app = express(); // Coloca o express no app

const path = require('path'); // Coleta o caminho absoluto das pastas
const session = require('express-session'); // Salva sessao com cookies
const MongoStore = require('connect-mongo'); // conecta no MongoDB
const flash = require('connect-flash'); // Envia mensagem para o usuario e é deletada logo dpeois
const helmet = require('helmet')

const csrf = require('csurf')

const routes = require('./routes'); // Coleta todas as rotas da aplicação
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware') // coleta os middlewares

const mongoose = require('mongoose'); // modulo do MongoDB
// const db = require('./db');

/* --------------------------------------------------------------------------------------------------------  */

mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true }) // conexão com o MongoDB
    .then(() => {
        console.log('contectou no Mongo')
        app.emit('pronto') // emite um alerta para o express. A aplicação só é iniciada depois da conexão com o banco de dados
    })
    .catch(err => console.log(err))



const sessionOptions = session({ // SALVA A SESSÃO
    secret: '123',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
})

/* --------------------------------------------------------------------------------------------------------  */

app.use(express.urlencoded({ extended: true })); // melhora a visualização dos JSON
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public'))); // todos os arquivos estaticos q podem ser acessados diretamente, como css, js, imagens
app.use(sessionOptions); // Adiciona as seções no app
app.use(flash()); // adiciona as mensagens rapidas no app
app.use(helmet());
app.use(csrf());
app.use(middlewareGlobal); // adiciona os middlewares no app (funções q passam por toda a aplicação)
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes); // define as rotas da aplicação no express

app.set('views', path.resolve(__dirname, 'src', 'views')); // define qual é a pasta com as views
app.set('view engine', 'ejs'); // define a engine de renderização do express

/* --------------------------------------------------------------------------------------------------------  */

app.on('pronto', () => { // depois de receber o emit(), a aplicação começa a ouvir na porta selecionada
    app.listen(3000, function() {
        console.log('Servidor online')
    })
})