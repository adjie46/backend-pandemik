const roleController = require('../controller/role.controller');

module.exports = app => {

    app
        .route('/api/role')
        .post(roleController.create)

    app
        .route("/api/role")
        .get(roleController.findAll)

}