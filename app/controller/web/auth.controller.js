exports.LoginPage = (req, res) => {
    res.render('../view/login.views.hbs', {
        pass: process.env.DECRYPT_CODE
    });
}