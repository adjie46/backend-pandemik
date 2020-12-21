const {
    mode
} = require("crypto-js");

module.exports = (sequelize, Sequelize) => {
    const Auth = sequelize.define("auth", {
        auth_id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID
        },
        user_id: {
            allowNull: false,
            type: Sequelize.UUID,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        auth_username: {
            allowNull: false,
            type: Sequelize.STRING(20)
        },
        auth_password: {
            allowNull: false,
            type: Sequelize.STRING(60)
        },
    });

    return Auth;
};