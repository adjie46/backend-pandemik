const db = require("../models");
const responseStatus = require("../middleware/responseStatus")
const {
    v4: uuidv4
} = require('uuid');
const decrypt = require("../middleware/decrypt");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const configs = require('../config/public.config')
const encrypt = require('../middleware/encrypt')
const Handlebars = require('handlebars')
const Auth = db.auth;
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const EXPIRES_IN_MINUTES = '1440m'

const signIn = (data) => {
    return new Promise(async (resolve, reject) => {

        let config = {
            where: data.condition,
            include: {
                model: User,
                as: 'user',
                attributes: {
                    exclude: ['role_id', 'createdAt', 'updatedAt']
                },
                include: {
                    model:Role,
                    as: 'role',
                    attributes: {
                        exclude: ['role_id', 'createdAt', 'updatedAt']
                    },
                }
            },
            attributes: {
                exclude: ['user_id', 'createdAt', 'updatedAt','auth_username']
            },
        }

        Auth.findOne(config)
            .then((result) => {
                var validPassword = bcrypt.compareSync(data.auth_password, result.auth_password);
                const payload = {
                    userName: result.user.user_name,
                    roleName: result.user.role.role_name,
                    authId: result.auth_id,
                    userId: result.user.user_id
                }

                const signInToken = jwt.sign(payload, configs.JWTSecret, {
                    expiresIn: EXPIRES_IN_MINUTES,
                })

                let dataSignIn = {
                    auth_id : result.auth_id,
                    user_id : result.user.user_id,
                    user_name : result.user.user_name,
                    user_email : result.user.user_email,
                    user_phone : result.user.user_phone,
                    user_role : result.user.role.role_name,
                    tokenSign : signInToken
                }

             
                if(validPassword){
                    resolve(encrypt(dataSignIn))
                }else{
                    reject("Your Password Does'nt Match")
                }

            }).catch((err) => {
                reject(err.message)
            });
    })
}

exports.signIn = (req, res) => {

    let data = JSON.parse(decrypt(req.body.data))
    
    const condition = data.auth_username ? {
        auth_username: {
            [Op.like]: `%${data.auth_username}%`
        }
    } : null;
    
    data.condition = condition

    signIn(data)
        .then((result) => {
            return res.status(responseStatus.OK).json({
                'status': true,
                'message': "Sign In Success!",
                'dataSignIn': result
            });
        }).catch((err) => {
            return res.status(responseStatus.forbidden).send({
                success: false,
                message: err
            })
        });
};

exports.LoginPage = (req, res) => {
    res.render('../views/pages/login.views.hbs', {
        secretCode: configs.encryptedCode,
    });
}

