module.exports = (sequelize, Sequelize) => {
    const Mahasiswa = sequelize.define("mahasiswa", {
        nim_mahasiswa: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING(20)
        },
        nama_mahasiswa: {
            allowNull: false,
            type: Sequelize.STRING(100)
        },
        jurusan_id: {
            allowNull: false,
            type: Sequelize.UUID,
            references: {
                model: 'jurusans',
                key: 'jurusan_id'
            }
        },
        email_mahasiswa: {
            allowNull: false,
            type: Sequelize.STRING(20)
        },
        phone_mahasiswa: {
            allowNull: false,
            type: Sequelize.STRING(13)
        },
        pass_mahasiswa: {
            allowNull: false,
            type: Sequelize.STRING(60)
        },
    });

    return Mahasiswa;
};