module.exports = (sequelize, Sequelize) => {
    const role = sequelize.define("roles", {
        role_id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID
        },
        role_name: {
            allowNull: false,
            type: Sequelize.STRING(20)
        }
    });
    return role;
};