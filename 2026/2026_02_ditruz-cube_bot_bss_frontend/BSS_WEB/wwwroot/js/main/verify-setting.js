$(document).ready(function () {
    initComponent();
    clearValidate();
    initInput();
});

function showDateTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1; // เดือนเริ่มที่ 0
    const year = now.getFullYear() + 543; // แปลงเป็น พ.ศ.

    const hours = String(now.getHours()).padStart(2, '0'); // เวลาแบบ 24 ชม.
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    //Date/Time: 15/11/2568 15:45:00
    const formatted = `Date/Time: ${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    document.getElementById("p-setting-datetime").textContent = formatted;
}

// อัปเดตทุก 1 วินาที
setInterval(showDateTime, 1000);
showDateTime();

$.createToast = function (options) {
    var title = options.title;
    var text = options.text;
    var type = options.type;

    toastr.options = {
        "closeButton": true,         // Show close button
        "debug": false,              // Enable debug mode (shows console logs)
        "newestOnTop": true,        // Show newest toast at the top
        "progressBar": true,         // Show progress bar indicating timeout
        "positionClass": "toast-top-center", // Position of the toast container //"toast-top-full-width" toast-top-center toast-bottom-right 
        "preventDuplicates": false,  // Prevent duplicate toasts with the same message
        "onclick": null,             // Callback function on toast click
        "showDuration": "1000",       // Duration of the show animation
        "hideDuration": "1000",      // Duration of the hide animation
        "timeOut": "5000",           // How long the toast stays visible (in ms)
        "extendedTimeOut": "0",   // How long the toast stays visible after mouseover (in ms)
        "showEasing": "swing",       // Easing for the show animation
        "hideEasing": "linear",      // Easing for the hide animation
        "showMethod": "fadeIn",      // Method for the show animation
        "hideMethod": "fadeOut"      // Method for the hide animation
    };


    switch (type) {
        case 'success': {
            toastr.success(text, title);
        }
            break;
        case 'error': {
            toastr.error(text, title);
        }
            break;
        case 'warning': {
            toastr.warning(text, title);
        }
            break;
        case 'info': {
            toastr.info(text, title);
        }
            break;
    }
};

function initComponent() {

    $.enablePageLoader();
    loadMachineLookup(function () {

        $('#ddlSortingMachine').select2({
            theme: "bootstrap-5",
            closeOnSelect: true
        });

        $('input[name="radioBanknoteType"]:eq(0)').prop('checked', true);

        $(".operation-setting-sorting-machine").css('top', '280px');

        $(".operation-setting-submit-button").css('top', '380px');
        $(".operation-setting-logout-button").css('top', '420px');
        $(".container").css('min-height', '500px');

        $.disablePageLoader();
    });
}

function loadMachineLookup(onSuccess) {

    $.requestAjax({
        service: 'MasterMachine/GetMachineByDepartment',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlSortingMachine')
                    .find('option')
                    .remove().end()
                    .append('<option value=""> Please select </option>');

                $.each(response.data, function (index, value) {
                    $('#ddlSortingMachine').append(`<option value="${value.machineId}">${value.machineName}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}

function clearValidate() {
    $('#ddlSortingMachine').removeClass('is-invalid');

    $('#ddlSortingMachine').removeClass('is-valid');
}

function initInput() {
    $('#ddlSortingMachine').on('change', function () {
        $('#ddlSortingMachine').removeClass('is-invalid');
        $('#ddlSortingMachine').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#ddlSortingMachine').addClass('is-valid');
        }
    });
}

$('#btnOperationLogout').click(function (e) {
    $('#confirmLogoutModal').modal('show');
});

$('#btnLogOut').click(function (e) {
    $('#confirmLogoutModal').modal('show');
});

$('#btnConfirmLogout').click(function (e) {
    $('#confirmLogoutModal').modal('hide');

    var rootPath = document.body.getAttribute("data-root-path");
    setTimeout(function () {
        window.location = rootPath + "Logout/Index";
    }, 100);
});

$('#btnSetOperation').click(function (e) {

    if (validateSave()) {
        var requestData = new Object();
        requestData.banknoteTypeSelected = $('input[name="radioBanknoteType"]:checked').val();
        requestData.machineSelected = $('#ddlSortingMachine').val();

        $.enablePageLoader();

        // $("#pageloading").fadeIn();
        var rootPath = document.body.getAttribute("data-root-path");

        $.requestAjax({
            service: 'Main/SubmitForVerifySetting',
            type: 'POST',
            parameter: requestData,
            enableLoader: false,
            onSuccess: function (response) {
                if (response.is_success == true && response.data != null) {
                    setTimeout(function () {
                        window.location = rootPath + "AutoSelling/Index";
                    }, 100);

                } else {
                    setTimeout(function () {
                        $.createToast({
                            text: response.msg_code + ':' + response.msg_desc,
                            title: 'Error',
                            type: 'error'
                        });
                    }, 100);
                }
                setTimeout(function () {
                    $.disablePageLoader();
                }, 50);
            }
        });
    }
});

function validateSave() {
    var isValid = true;
    var invalidCount = 0;
    clearValidate();

    if ($('#ddlSortingMachine').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlSortingMachine').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}