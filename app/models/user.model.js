const {
    mode
} = require("crypto-js");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        user_id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID
        },
        user_name: {
            allowNull: false,
            type: Sequelize.STRING(20)
        },
        user_email: {
            allowNull: false,
            type: Sequelize.STRING(20)
        },
        user_phone: {
            allowNull: false,
            type: Sequelize.STRING(13)
        },
        user_status: {
            allowNull: false,
            type: Sequelize.ENUM('New Registed', 'Active', 'Suspend', 'Block')
        },
        role_id: {
            allowNull: false,
            type: Sequelize.UUID,
            references: {
                model: 'roles',
                key: 'role_id'
            }
        }
    });

    return User;
};