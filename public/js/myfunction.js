function encrypt(data) {

    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), "PaNd3M1KB4Ck3nD@2020", {
        format: CryptoJSAesJson
    }).toString()
    return encrypted
}

function message(title, message, icon, confirm, redirect) {
    if (redirect == "") {
        Swal.fire({
            title: title,
            text: message,
            icon: icon,
            confirmButtonText: confirm
        }).then((result) => {

        });
    } else {
        Swal.fire({
            title: title,
            text: message,
            icon: icon,
            confirmButtonText: confirm
        }).then((result) => {
            window.location = `${redirect}`
        });
    }
}


function decrypt(data, pass) {
    let decrypted = CryptoJS.AES.decrypt(data, "PaNd3M1KB4Ck3nD@2020", {
        format: CryptoJSAesJson
    }).toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
}