const Contato = require('../models/ContatoModel')

exports.index = async(req, res) => {
    let contatos = new Contato();

    contatos = await contatos.buscaContatos();

    res.render('index', ({ contatos }));
    // res.send(contatos)
}