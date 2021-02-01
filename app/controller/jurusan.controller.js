const db = require("../models");
const responseStatus = require("../middleware/responseStatus")
const {
    v4: uuidv4
} = require('uuid');
const decrypt = require("../middleware/decrypt");
const {
    resolve
} = require("path");
const Jurusan = db.jurusan;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken')
const config = require('../config/public.config')

const findJurusanWithCondition = (condition) => {
    return new Promise(async (resolve, reject) => {
        Jurusan.findAll({
                where: condition
            })
            .then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err.message)
            });
    })
}

const createNewJurusan = (data) => {
    return new Promise(async (resolve, reject) => {
        Jurusan.create(data)
            .then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err.message)
            });
    })
}

const updateJurusan = (data, condition) => {
    return new Promise(async (resolve, reject) => {
        Jurusan.update(data, {
                where: condition
            })
            .then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err.message)
            });
    })
}

const changeStatusJurusan = (data, condition) => {
    return new Promise(async (resolve, reject) => {
        Jurusan.update(data, {
            where : condition
        }).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err.message)
        });
    })
}

const deleteJurusan = (condition) => {
    return new Promise(async (resolve, reject) => {
        Jurusan.destroy({
                where: condition
            })
            .then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err.message)
            });
    })
}

exports.create = (req, res) => {
    const token = req.body.token || req.query.token || req.headers['master-token']
    if (token) {
        jwt.verify(token, config.JWTSecret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                })
            } else {
                let data = JSON.parse(decrypt(req.body.data))
                const jurusanData = {
                    jurusan_id: uuidv4(),
                    jurusan_name: data.jurusan_name,
                    jurusan_status: "1"
                }

                const condition = data.jurusan_name ? {
                    jurusan_name: {
                        [Op.like]: `%${data.jurusan_name}%`
                    }
                } : null;

                findJurusanWithCondition(condition)
                    .then((result) => {
                        if (result.length > 0) {
                            return res.status(responseStatus.forbidden).send({
                                success: false,
                                message: "Nama Jurusan Sudah ada"
                            })
                        } else {
                            createNewJurusan(jurusanData)
                                .then(result => {
                                    return res.status(responseStatus.OK).json({
                                        'status': true,
                                        'message': "Jurusan Berhasil Ditambah",
                                        'data': result
                                    });
                                })
                                .catch(err => {
                                    return res.status(responseStatus.forbidden).send({
                                        success: false,
                                        message: err
                                    })
                                })
                        }
                    }).catch((err) => {
                        return res.status(responseStatus.forbidden).send({
                            success: false,
                            message: err
                        })
                    });
            }
        })
    } else {
        return res.status(responseStatus.forbidden).json({
            success: false,
            message: 'No token provided.',
        })
    }
}

exports.update = (req, res) => {
    const token = req.body.token || req.query.token || req.headers['master-token']
    if (token) {
        jwt.verify(token, config.JWTSecret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                })
            } else {
                let data = decrypt(req.body.data)
                const jurusanData = {
                    jurusan_name: data.edit_jurusan_name,
                }

                const condition = data.jurusan_id ? {
                    jurusan_id: {
                        [Op.like]: `%${data.jurusan_id}%`
                    }
                } : null;

                findJurusanWithCondition(condition)
                    .then((result) => {
                        console.log(result)
                        if (result.length > 0) {
                            updateJurusan(jurusanData, condition)
                                .then(result => {
                                    return res.status(responseStatus.OK).json({
                                        'status': true,
                                        'message': "Jurusan Berhasil Di Ubah",
                                        'data': result
                                    });
                                })
                                .catch(err => {
                                    return res.status(responseStatus.forbidden).send({
                                        success: false,
                                        message: err
                                    })
                                })
                        } else {
                            return res.status(responseStatus.forbidden).send({
                                success: false,
                                message: "Nama Jurusan Tidak ada"
                            })
                        }
                    }).catch((err) => {
                        return res.status(responseStatus.forbidden).send({
                            success: false,
                            message: err
                        })
                    });
            }
        })
    } else {
        return res.status(responseStatus.forbidden).json({
            success: false,
            message: 'No token provided.',
        })
    }
}

exports.delete = (req, res) => {
    const token = req.body.token || req.query.token || req.headers['master-token']
    if (token) {
        jwt.verify(token, config.JWTSecret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                })
            } else {
                let data = decrypt(req.body.data)
                const condition = data ? {
                    jurusan_id: {
                        [Op.like]: `%${data}%`
                    }
                } : null;
                deleteJurusan(condition)
                    .then(result => {
                        return res.status(responseStatus.OK).json({
                            'status': true,
                            'message': "Jurusan Berhasil Di Hapus",
                            'data': result
                        });
                    })
                    .catch(err => {
                        return res.status(responseStatus.forbidden).send({
                            success: false,
                            message: err
                        })
                    })
            }
        })
    } else {
        return res.status(responseStatus.forbidden).json({
            success: false,
            message: 'No token provided.',
        })
    }
}

exports.setActive = (req, res) => {
    const token = req.body.token || req.query.token || req.headers['master-token']
    if (token) {
        jwt.verify(token, config.JWTSecret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                })
            } else {
                let data = decrypt(req.body.data)
                const jurusanData = {
                    jurusan_status: "1",
                }
                const condition = data ? {
                    jurusan_id: {
                        [Op.like]: `%${data}%`
                    }
                } : null;
                changeStatusJurusan(jurusanData,condition)
                    .then(result => {
                        return res.status(responseStatus.OK).json({
                            'status': true,
                            'message': "Status Jurusan Berhasil Di Ubah",
                            'data': result
                        });
                    })
                    .catch(err => {
                        return res.status(responseStatus.forbidden).send({
                            success: false,
                            message: err
                        })
                    })
            }
        })
    } else {
        return res.status(responseStatus.forbidden).json({
            success: false,
            message: 'No token provided.',
        })
    }
}

exports.setAnActive = (req, res) => {
    const token = req.body.token || req.query.token || req.headers['master-token']
    if (token) {
        jwt.verify(token, config.JWTSecret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                })
            } else {
                let data = decrypt(req.body.data)
                const jurusanData = {
                    jurusan_status: "0",
                }
                const condition = data ? {
                    jurusan_id: {
                        [Op.like]: `%${data}%`
                    }
                } : null;
                changeStatusJurusan(jurusanData,condition)
                    .then(result => {
                        return res.status(responseStatus.OK).json({
                            'status': true,
                            'message': "Status Jurusan Berhasil Di Ubah",
                            'data': result
                        });
                    })
                    .catch(err => {
                        return res.status(responseStatus.forbidden).send({
                            success: false,
                            message: err
                        })
                    })
            }
        })
    } else {
        return res.status(responseStatus.forbidden).json({
            success: false,
            message: 'No token provided.',
        })
    }
}