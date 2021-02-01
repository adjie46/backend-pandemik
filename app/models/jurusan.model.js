module.exports = (sequelize, Sequelize) => {
    const Jurusan = sequelize.define("jurusan", {
        jurusan_id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID
        },
        jurusan_name: {
            allowNull: false,
            type: Sequelize.STRING(100)
        },
        jurusan_status: {
            allowNull: false,
            type: Sequelize.ENUM('0', '1')
        }
    })
    return Jurusan;
}