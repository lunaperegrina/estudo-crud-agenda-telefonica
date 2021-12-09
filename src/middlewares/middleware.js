module.exports.middlewareGlobal = (req, res, next) => {

    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');

    res.locals.user = req.session.user;

    console.log("RES LOCAL USEEER  " + res.locals.user)

    next(); // NAO ESQUECE DO NEXT PRA PODER IR PARA O PROXIMO MIDDLEWARE
}

module.exports.checkCsrfError = (err, req, res, next) => {
    // console.log('ESSE É O ERRO: ' + err)
    // console.log('ESSE É O ERRO: ' + err.code)

    if (err) {
        return res.render('404');
    }
    next();

}

module.exports.csrfMiddleware = (req, res, next) => {
    // console.log("aqui o token: " + req.csrfToken);
    res.locals.csrfToken = req.csrfToken();
    console.log('RES LOCALS CSRF TOKEN ' + res.locals.csrfToken)
    next();
}

exports.loginRequired = (req, res, next) => {

    if (!req.session.user) {
        req.flash('errors', 'Você precisa fazer login.');
        req.session.save(() => res.redirect('/'));
        return;
    }

    next();

}