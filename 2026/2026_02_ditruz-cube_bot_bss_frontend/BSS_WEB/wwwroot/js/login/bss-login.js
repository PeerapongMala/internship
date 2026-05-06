
$(document).ready(function () {
    initComponent();
});

function initComponent() {

    $("#landing-success").hide();
    $("#landing-failed").hide();

    loadUserLoginDropdownLookup(function () {
        $('#ddlUserLoginDropdown').select2({
            theme: "bootstrap-5",
            closeOnSelect: true
        });

        $("#landing-spinner").hide();
    });
}

function loadUserLoginDropdownLookup(onSuccess) {

    $.requestAjax({
        service: 'Login/GetBssUserDropdown',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlUserLoginDropdown').find('option').remove().end()

                $('#ddlUserLoginDropdown').append(`<option value="">กรุณาเลือก</option>`);

                $.each(response.data, function (index, value) {
                    $('#ddlUserLoginDropdown').append(`<option value="${value.userName}">${value.firstName} ${value.lastName} (${value.roleGroupName} - ${value.departmentName}) </option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}

$("#ddlUserLoginDropdown").change(function () {

    var selectedValue = $(this).val().trim();
    var selectedText = $("#ddlUserLoginDropdown option:selected").text();

    console.log("Value:", selectedValue);
    console.log("Text:", selectedText);

    if (selectedValue != '') {
        $("#landing-spinner").show();
        bssLoginUser();
    }
});

function bssLoginUser() {

    var rootPath = document.body.getAttribute("data-root-path");
    var requestData = new Object();
    requestData.userSelected = $('#ddlUserLoginDropdown').val();

    $.requestAjax({
        service: 'Login/BssLogin',
        type: 'POST',
        parameter: requestData,
        enableLoader: true,
        onSuccess: function (response) {

            $('#landing-spinner').hide();
            if (response.is_success == true) {
                $('#landing-success').show();
                setTimeout(function () {
                    if (response.data.includes("Operator")) {
                        window.location.href = rootPath + 'Main/OperationSetting';
                    }
                    else if (response.data.includes("Supervisor")) {
                        window.location.href = rootPath + 'Main/VerifySetting';
                    } else {
                        window.location.href = rootPath + 'Main/Index';
                    }
                }, 500);
            }
            else {

                $('#landing-failed').show();
                setTimeout(function () {
                    if (response.msg_code == "503") {
                        window.location.href = rootPath + "Login/ServiceUnavailablePage";
                    } else if (response.msg_code == "500") {
                        window.location.href = rootPath + "Login/InternalServerErrorPage";
                    } else {
                        window.location.href = rootPath + "Login/UnauthorizedPage";
                    }

                }, 500);
            }
        },
        onError: function (response) {
            showLoginErrorModal('เกิดข้อผิดพลาดในการ Login');
        }
    });
}

function showLoginErrorModal(message) {
    const modalElement = document.getElementById("loginErrorModal");
    if (!modalElement) return;

    const errorSpan = document.getElementById("loginErrorMessageText");
    if (errorSpan) {
        errorSpan.innerText = message || "เกิดข้อผิดพลาด";
    }

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    // ป้องกันการ show ซ้อน
    if (!modalElement.classList.contains("show")) {
        modal.show();
    }
}

//function bssUserAuthen() {

//    var rootPath = document.body.getAttribute("data-root-path");

//    $.requestAjax({
//        service: 'Login/BssUserAuthen',
//        type: 'GET',
//        enableLoader: false,
//        onSuccess: function (response) {

//            $('#landing-spinner').hide();
//            if (response.is_success == true) {
//                $('#landing-success').show();
//                setTimeout(function () {
//                    if (response.data.includes("Operator")) {
//                        window.location.href = rootPath + 'Main/OperationSetting';
//                    }
//                    else if (response.data.includes("Supervisor")) {
//                        window.location.href = rootPath + 'Main/VerifySetting';
//                    } else {
//                        window.location.href = rootPath + 'Main/Index';
//                    }
//                }, 500);
//            }
//            else {

//                $('#landing-failed').show();
//                setTimeout(function () {
//                    if (response.msg_code == "503") {
//                        window.location.href = rootPath + "Login/ServiceUnavailablePage";
//                    } else if (response.msg_code == "500") {
//                        window.location.href = rootPath + "Login/InternalServerErrorPage";
//                    } else {
//                        window.location.href = rootPath + "Login/UnauthorizedPage";
//                    }

//                }, 500);
//            }
//        },
//        onError: function (response) {
//            showLoginErrorModal('เกิดข้อผิดพลาดในการ Login');
//        }
//    });
//}

