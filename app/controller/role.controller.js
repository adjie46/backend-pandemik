const db = require("../models");
const responseStatus = require("../middleware/responseStatus")
const {
    v4: uuidv4
} = require('uuid');
const decrypt = require("../middleware/decrypt");
const {
    resolve
} = require("path");
const Role = db.role;
const Op = db.Sequelize.Op;

const createNewRole = (data) => {
    return new Promise(async (resolve, reject) => {
        Role.create(data)
            .then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err.message)
            });
    })
}

const findRoleWithCondition = (condition) => {
    return new Promise(async (resolve, reject) => {
        Role.findAll({
                where: condition
            })
            .then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err.message)
            });
    })
}

const findAllRole = () => {
    return new Promise(async (resolve, reject) => {
        Role.findAll()
        .then((result) => {
            if (result.length <= 0) {
                reject("Role Data Not Found")
            }
            resolve(result)
        }).catch((err) => {
            reject(err.message)
        });
    })
}

exports.create = (req, res) => {

    let data = JSON.parse(decrypt(req.body.data))
    if (!data.roleName) {
        res.status(responseStatus.badRequest).send({
            status: false,
            message: "Some Data Can't be Empty"
        })
        return
    }

    const roleData = {
        role_id: uuidv4(),
        role_name: data.roleName
    }

    const condition = data.roleName ? {
        role_name: {
            [Op.like]: `%${data.roleName}%`
        }
    } : null;

    findRoleWithCondition(condition)
        .then((result) => {
            if (result.length > 0) {
                return res.status(responseStatus.forbidden).send({
                    success: false,
                    message: "Role Name Already Add"
                })
            } else {
                createNewRole(roleData)
                    .then(result => {
                        return res.status(responseStatus.OK).json({
                            'status': true,
                            'message': "Role Created",
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
};

exports.findAll = (req, res) => {
    findAllRole()
        .then(result => {
            return res.status(responseStatus.OK).json({
                'status': true,
                'message': "Role Data Found!",
                'data': result
            });
        })
        .catch(err => {
            return res.status(responseStatus.forbidden).send({
                success: false,
                message: err
            })
        })
};

exports.findOne = (req, res) => {

};

exports.update = (req, res) => {

};

exports.delete = (req, res) => {

};

exports.deleteAll = (req, res) => {

};

exports.findAllPublished = (req, res) => {

};