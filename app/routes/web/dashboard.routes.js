const dashboardController = require('../../controller/web/dashboard.controller');

module.exports = app => {

    app
        .route('/dashboard')
        .get(dashboardController.dashboardPage)

}