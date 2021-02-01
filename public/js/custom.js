$(document).ready(function () {
    if(localStorage.hasOwnProperty("dataSignIn") && localStorage.getItem('dataSignIn').length > 0){
        $.LoadingOverlay("show", {
            text: "you have logged, please wait ..."
        });
        setTimeout(() => {
            window.location.replace('/dashboard');
        }, 2000);
    }
    /* if (localStorage.hasOwnProperty("dataSignIn")) {
        let logIn = localStorage.getItem('dataSignIn')
        if (logIn != "") {
            $.LoadingOverlay("show", {
                text: "you have logged, please wait ..."
            });
            setTimeout(() => {
                window.location.replace('/dashboard');
            }, 2000);
        }
    }else{
        if (logIn != "") {
            $.LoadingOverlay("show", {
                text: "You don't have access"
            });
            setTimeout(() => {
                window.location.replace('/dashboard');
            }, 2000);
        }
    } */

    $(document).on("submit", "#loginForm", function (event) {
        var form = $(this);
        if (form[0].checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            var data = $(this).serializeJSON();
            var encp = (encrypt(data));
            $.ajax({
                type: "post",
                url: "api/auth/signin",
                data: {
                    data: encp
                },
                dataType: "json",
                beforeSend: function () {
                    $.LoadingOverlay("show");
                },
                success: function (response) {
                    $.LoadingOverlay("hide");
                    if (response.status) {
                        localStorage.setItem('dataSignIn', response.dataSignIn);
                        message("Success", response.message, "success", "oke", "/dashboard");
                    } else {
                        message("Fail", response.message, "error", "coba lagi", "/");
                    }
                    console.log(response);
                },
                error: function (error) {
                    $.LoadingOverlay("hide");
                    message("Fail", error.responseJSON.message, "error", "coba lagi", "/");
                }
            });

        }
        form.addClass('was-validated');
        return false;
    });
})