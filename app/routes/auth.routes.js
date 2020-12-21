const authController = require('../controller/auth.controller');

module.exports = app => {

    app
        .route('/api/auth/signIn')
        .post(authController.signIn)

}