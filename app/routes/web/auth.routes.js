const authController = require('../../controller/web/auth.controller');

module.exports = app => {

    app
        .route('/')
        .get(authController.LoginPage)
    
    app
        .route('/login')
        .get(authController.LoginPage)

}