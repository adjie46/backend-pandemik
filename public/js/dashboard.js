$(document).ready(function () {
    let logIn = localStorage.getItem('dataSignIn')
    if (!localStorage.hasOwnProperty("dataSignIn")) {
        if (logIn == "") {
            $.LoadingOverlay("show", {
                text: "You don't have access"
            });
            setTimeout(() => {
                window.location.replace('/login');
            }, 2000);
        }
        $.LoadingOverlay("show", {
            text: "You don't have access"
        });
        setTimeout(() => {
            window.location.replace('/login');
        }, 2000);
    } else {
        if (logIn == "" || logIn == "undefined") {
            $.LoadingOverlay("show", {
                text: "You don't have access"
            });
            setTimeout(() => {
                window.location.replace('/login');
            }, 2000);
        }
    }

    let dataSignIn = decrypt(logIn)
    $("#userWelcome").text(`Welcome ${dataSignIn.user_name}`)
    $("#datatable").DataTable();
    


    $(document).on("submit", "#addJurusanFrm", function (event) {
        var form = $(this);
        if (form[0].checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            var data = $(this).serializeJSON();
            var encp = (encrypt(data));
            $.ajax({
                type: "post",
                url: "/api/jurusan",
                headers: {
                    'master-token': dataSignIn.tokenSign
                },
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
                        message("Success", response.message, "success", "oke", "?pages/data-master/data-jurusan");
                    } else {
                        message("Fail", response.message, "error", "coba lagi", "?pages/data-master/data-jurusan");
                    }
                },
                error: function (error) {
                    $.LoadingOverlay("hide");
                    message("Fail", error.responseJSON.message, "error", "coba lagi", "?pages/data-master/data-jurusan");
                }
            });

        }
        form.addClass('was-validated');
        return false;
    });

    $(document).on("click", "#btnEditJurusan", function () {
        nama_jurusan = $(this).data("jurusan-name");
        id_jurusan = $(this).data("jurusan-id");
        $('#edit_jurusan_name').val(nama_jurusan);
    })

    $(document).on("submit", "#editJurusanFrm", function (event) {
        var form = $(this);
        if (form[0].checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            var data = $(this).serializeObject();
            data.jurusan_id = id_jurusan
            var encp = (encrypt(data));
            $.ajax({
                type: "put",
                url: "/api/jurusan",
                headers: {
                    'master-token': dataSignIn.tokenSign
                },
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
                        message("Success", response.message, "success", "oke", "?pages/data-master/data-jurusan");
                    } else {
                        message("Fail", response.message, "error", "coba lagi", "?pages/data-master/data-jurusan");
                    }
                },
                error: function (error) {
                    $.LoadingOverlay("hide");
                    message("Fail", error.responseJSON.message, "error", "coba lagi", "?pages/data-master/data-jurusan");
                }
            });

        }
        form.addClass('was-validated');
        return false;
    })

    $(document).on("click", "#btnHapusJurusan", function (event) {
        var id = $(this).data("jurusan-id")
        var encp = (encrypt(id));
        Swal.fire({
            title: 'Apakah kamu yakin?',
            text: "Data yang hilang tidak bisa dikembalikan lagi!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Saya Yakin!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: "delete",
                    url: "/api/jurusan",
                    headers: {
                        'master-token': dataSignIn.tokenSign
                    },
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
                            message("Success", response.message, "success", "oke", "?pages/data-master/data-jurusan");
                        } else {
                            message("Fail", response.message, "error", "coba lagi", "?pages/data-master/data-jurusan");
                        }
                    },
                    error: function (error) {
                        $.LoadingOverlay("hide");
                        message("Fail", error.responseJSON.message, "error", "coba lagi", "?pages/data-master/data-jurusan");
                    }
                });
            }
        })
    })

    $(document).on("click", "#btnSetActive", function (event) {
        var id = $(this).data("jurusan-id")
        var encp = (encrypt(id));
        Swal.fire({
            title: 'Apakah kamu yakin',
            text: "Untuk Merubah Status Jurusan?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Saya Yakin!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: "put",
                    url: "/api/jurusan/active",
                    headers: {
                        'master-token': dataSignIn.tokenSign
                    },
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
                            message("Success", response.message, "success", "oke", "?pages/data-master/data-jurusan");
                        } else {
                            message("Fail", response.message, "error", "coba lagi", "?pages/data-master/data-jurusan");
                        }
                    },
                    error: function (error) {
                        $.LoadingOverlay("hide");
                        message("Fail", error.responseJSON.message, "error", "coba lagi", "?pages/data-master/data-jurusan");
                    }
                });
            }
        })
    })

    $(document).on("click", "#btnSetAnActive", function (event) {
        var id = $(this).data("jurusan-id")
        var encp = (encrypt(id));
        Swal.fire({
            title: 'Apakah kamu yakin',
            text: "Untuk Merubah Status Jurusan?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Saya Yakin!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: "put",
                    url: "/api/jurusan/disactive",
                    headers: {
                        'master-token': dataSignIn.tokenSign
                    },
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
                            message("Success", response.message, "success", "oke", "?pages/data-master/data-jurusan");
                        } else {
                            message("Fail", response.message, "error", "coba lagi", "?pages/data-master/data-jurusan");
                        }
                    },
                    error: function (error) {
                        $.LoadingOverlay("hide");
                        message("Fail", error.responseJSON.message, "error", "coba lagi", "?pages/data-master/data-jurusan");
                    }
                });
            }
        })
    })

    //MAHASISWA
    $(document).on("submit", "#addMahasiswaFrm", function (event) {
        var form = $(this);
        if (form[0].checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            var data = $(this).serializeJSON();
            var encp = (encrypt(data));
            console.log(encp)
            /* $.ajax({
                type: "post",
                url: "/api/jurusan",
                headers: {
                    'master-token': dataSignIn.tokenSign
                },
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
                        message("Success", response.message, "success", "oke", "?pages/data-master/data-jurusan");
                    } else {
                        message("Fail", response.message, "error", "coba lagi", "?pages/data-master/data-jurusan");
                    }
                },
                error: function (error) {
                    $.LoadingOverlay("hide");
                    message("Fail", error.responseJSON.message, "error", "coba lagi", "?pages/data-master/data-jurusan");
                }
            }); */

        }
        form.addClass('was-validated');
        return false;
    });


})