var hbs = require('hbs');
var fs = require('fs');
const path = require('path');
const db = require("../../models");
const responseStatus = require("../../middleware/responseStatus")
const {
    v4: uuidv4
} = require('uuid');
const decrypt = require("../../middleware/decrypt");
const {
    response
} = require('express');
const Jurusan = db.jurusan;
const Mahasiswa = db.mahasiswa;
const Op = db.Sequelize.Op;

const dataJurusan = () => {
    return new Promise(async (resolve, reject) => {
        Jurusan.findAll()
            .then((result) => {
                if (result.length <= 0) {
                    reject("Data Jurusan Not Found")
                }
                resolve(result)
            }).catch((err) => {
                reject(err.message)
            });
    })
}

const dataMahasiswa = () => {
    return new Promise(async (resolve, reject) => {
        let config = {
            include: {
                model: Jurusan,
                as: 'jurusan',
                attributes: {
                    exclude: ['jurusan_id', 'createdAt', 'updatedAt']
                },
            },
            attributes: {
                exclude: ['jurusan_id', 'createdAt', 'updatedAt']
            },
        }

        Mahasiswa.findAll(config)
            .then((result) => {
                if (result.length <= 0) {
                    reject("Data Jurusan Tidak Ada")
                }
                resolve(result)
            }).catch((err) => {
                reject(err.message)
            });
    })
}

exports.dashboardPage = (req, res) => {

    var partialsDir = path.join(__dirname, '../../view/content');
    var filenames = fs.readdirSync(partialsDir);
    let pageActive, pagePrevius, dataResponse

    if (req._parsedUrl.query === null) {
        pageActive = "Dashboard"
        pagePrevius = ""
        contentData = fs.readFileSync(partialsDir + '/' + "dashboard.content.hbs", 'utf8')
        hbs.registerPartial("content", contentData);
        res.render('../view/dashboard.views.hbs', {
            pageActive: pageActive,
            pagePrevius: pagePrevius,
            dataResponse: dataResponse
        });
    } else {
        if (req._parsedUrl.query == "pages/data-master/data-jurusan") {
            dataJurusan()
                .then(result => {
                    dataResponse = result
                    pageActive = "Data Jurusan"
                    pagePrevius = "Data Master"
                    contentData = fs.readFileSync(partialsDir + '/' + "data_jurusan.content.hbs", 'utf8')
                    hbs.registerPartial("content", contentData);
                    res.render('../view/dashboard.views.hbs', {
                        pageActive: pageActive,
                        pagePrevius: pagePrevius,
                        dataResponse: dataResponse
                    });
                })
                .catch(err => {
                    result = []
                    dataResponse = result
                    pageActive = "Data Jurusan"
                    pagePrevius = "Data Master"
                    contentData = fs.readFileSync(partialsDir + '/' + "data_jurusan.content.hbs", 'utf8')
                    hbs.registerPartial("content", contentData);
                    res.render('../view/dashboard.views.hbs', {
                        pageActive: pageActive,
                        pagePrevius: pagePrevius,
                        dataResponse: dataResponse
                    });
                })
        } else if (req._parsedUrl.query == "pages/data-master/data-mahasiswa") {
            dataMahasiswa()
                .then(result => {
                    dataResponse = result
                    dataJurusan()
                        .then(jurusan => {
                            pageActive = "Data Mahasiswa"
                            pagePrevius = "Data Master"
                            contentData = fs.readFileSync(partialsDir + '/' + "data_mahasiswa.content.hbs", 'utf8')
                            hbs.registerPartial("content", contentData);
                            res.render('../view/dashboard.views.hbs', {
                                pageActive: pageActive,
                                pagePrevius: pagePrevius,
                                dataResponse: dataResponse,
                                dataJurusan: jurusan
                            });
                        })
                        .catch(err => {
                            pageActive = "Data Mahasiswa"
                            pagePrevius = "Data Master"
                            contentData = fs.readFileSync(partialsDir + '/' + "data_mahasiswa.content.hbs", 'utf8')
                            hbs.registerPartial("content", contentData);
                            res.render('../view/dashboard.views.hbs', {
                                pageActive: pageActive,
                                pagePrevius: pagePrevius,
                                dataResponse: dataResponse,
                                dataJurusan: []
                            });
                        })
                })
                .catch(err => {
                    result = []
                    dataResponse = result
                    dataJurusan()
                        .then(jurusan => {
                            pageActive = "Data Mahasiswa"
                            pagePrevius = "Data Master"
                            contentData = fs.readFileSync(partialsDir + '/' + "data_mahasiswa.content.hbs", 'utf8')
                            hbs.registerPartial("content", contentData);
                            res.render('../view/dashboard.views.hbs', {
                                pageActive: pageActive,
                                pagePrevius: pagePrevius,
                                dataResponse: dataResponse,
                                dataJurusan: jurusan
                            });
                        })
                        .catch(err => {
                            pageActive = "Data Mahasiswa"
                            pagePrevius = "Data Master"
                            contentData = fs.readFileSync(partialsDir + '/' + "data_mahasiswa.content.hbs", 'utf8')
                            hbs.registerPartial("content", contentData);
                            res.render('../view/dashboard.views.hbs', {
                                pageActive: pageActive,
                                pagePrevius: pagePrevius,
                                dataResponse: dataResponse,
                                dataJurusan: []
                            });
                        })
                })
        }
    }
}