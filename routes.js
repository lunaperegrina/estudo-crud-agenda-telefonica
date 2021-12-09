const express = require('express');
const { route } = require('express/lib/application');
const routes = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

const { loginRequired } = require('./src/middlewares/middleware');

// HOME
routes.get('/', homeController.index);

// LOGIN
routes.get('/login/index', loginController.index);
routes.post('/login/register', loginController.register);
routes.post('/login/login', loginController.login);
routes.get('/login/logout', loginController.logout);

// CONTATO 

routes.get('/contato/index', loginRequired, contatoController.index);
routes.post('/contato/register', loginRequired, contatoController.register);
routes.get('/contato/index/:id', loginRequired, contatoController.editIndex);
routes.post('/contato/edit/:id', loginRequired, contatoController.edit);
routes.get('/contato/delete/:id', loginRequired, contatoController.delete);

module.exports = routes;