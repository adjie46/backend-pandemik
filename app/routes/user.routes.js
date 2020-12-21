const userController = require('../controller/user.controller');

module.exports = app => {

    app
        .route('/api/user')
        .post(userController.createUser)

    app
        .route("/api/user")
        .get(userController.getUser)

}