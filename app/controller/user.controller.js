const db = require("../models");
const responseStatus = require("../middleware/responseStatus")
const {
    v4: uuidv4
} = require('uuid');
const decrypt = require("../middleware/decrypt");
const bcrypt = require('bcrypt');
const User = db.user;
const Role = db.role;
const Auth = db.auth;
const Op = db.Sequelize.Op;
var salt = bcrypt.genSaltSync(10);

const createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {

        const condition = data.user_id ? {
            user_id: {
                [Op.like]: `%${data.user_id}%`
            }
        } : null;

        User.create(data)
            .then((result) => {
                Auth.create(data)
                    .then((result) => {
                        findUserWithCondition(condition)
                            .then(user => {
                                resolve(user)
                            })
                            .catch(err => {
                                reject(err.message)
                            })
                    }).catch((err) => {
                        reject(err.message)
                    });
            }).catch((err) => {
                reject(err.message)
            });
    })
}

const findUserWithCondition = (condition) => {
    return new Promise(async (resolve, reject) => {

        let config = {
            where: condition,
            include: {
                model: Role,
                as: 'role',
                attributes: {
                    exclude: ['role_id', 'createdAt', 'updatedAt']
                },
            },
            attributes: {
                exclude: ['role_id', 'createdAt', 'updatedAt']
            },
        }

        User.findAll(config)
            .then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err.message)
            });
    })
}

const findAllUser = () => {
    return new Promise(async (resolve, reject) => {

        let config = {
            include: {
                model: Role,
                as: 'role',
                attributes: {
                    exclude: ['role_id', 'createdAt', 'updatedAt']
                },
            },
            attributes: {
                exclude: ['role_id', 'createdAt', 'updatedAt']
            },
        }

        User.findAll(config)
            .then((result) => {
                if (result.length <= 0) {
                    reject("User Data Not Found")
                }
                resolve(result)
            }).catch((err) => {
                reject(err.message)
            });
    })
}

exports.createUser = (req, res) => {
    let data = JSON.parse(decrypt(req.body.data))

    if (!data.user_name || !data.user_email || !data.user_phone || !data.user_status || !data.role_id) {
        res.status(responseStatus.badRequest).send({
            status: false,
            message: "Some Data Can't be Empty"
        })
        return
    }

    var passencrypt = bcrypt.hashSync(data.auth_password, salt);

    let userData = {
        user_id: uuidv4(),
        user_name: data.user_name,
        user_email: data.user_email,
        user_phone: data.user_phone,
        user_status: data.user_status,
        role_id: data.role_id,
        auth_id: uuidv4(),
        auth_username: data.auth_username,
        auth_password: passencrypt
    }

    const condition = data.user_email ? {
        user_email: {
            [Op.like]: `%${data.user_email}%`
        }
    } : null;

    findUserWithCondition(condition)
        .then((result) => {
            if (result.length > 0) {
                return res.status(responseStatus.forbidden).send({
                    success: false,
                    message: "Data Already Add"
                })
            } else {
                createNewUser(userData)
                    .then(result => {
                        return res.status(responseStatus.OK).json({
                            'status': true,
                            'message': "User Created",
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

exports.getUser = (req, res) => {
    findAllUser()
        .then(result => {
            return res.status(responseStatus.OK).json({
                'status': true,
                'message': "User Data Found!",
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