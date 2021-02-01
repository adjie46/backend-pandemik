const jurusanController = require('../controller/jurusan.controller');

module.exports = app => {

    app
        .route('/api/jurusan')
        .post(jurusanController.create)

    app
        .route('/api/jurusan')
        .put(jurusanController.update)

    app
        .route('/api/jurusan')
        .delete(jurusanController.delete)

    app
        .route('/api/jurusan/active')
        .put(jurusanController.setActive)

    app
        .route('/api/jurusan/disactive')
        .put(jurusanController.setAnActive)

}