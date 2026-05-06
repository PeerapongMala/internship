$(document).ready(function () {
    initComponent();
    clearValidate();
    initInput();
});

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

function initComponent() {

    $.enablePageLoader();
    loadMachineLookup(function () {

        $('#ddlSortingMachine').select2({
            theme: "bootstrap-5",
            closeOnSelect: true
        });

        loadSorterUserLookup(function () {

            $('#ddlSorterUser').select2({
                theme: "bootstrap-5",
                closeOnSelect: true
            });

            $('input[name="radioBanknoteType"]:eq(0)').prop('checked', true);
            $('input[name="radioOperationSelect"]:eq(0)').prop('checked', true);

            if ($('#IsPrepareCentral').val() == "YES") {

                $('#operation-setting-sorting-machine').hide();
                $('#operation-setting-sorter-user').hide();
                $(".operation-setting-submit-button").css('top', '360px');
                $(".operation-setting-logout-button").css('top', '400px');
                $(".container").css('min-height', '480px');

            }
            else {
                $('#operation-setting-sorter-user').hide();
                $('#operation-setting-sorting-machine').show();
                $(".operation-setting-submit-button").css('top', '460px');
                $(".operation-setting-logout-button").css('top', '500px');
                $(".container").css('min-height', '580px');
            }

            $.disablePageLoader();
        });
    });

    //$('input[name="radioBanknoteType"][value="option2"]').prop('checked', true);
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
                    /*.append('<option value=""> Please select </option>')*/;

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

function loadSorterUserLookup(onSuccess) {

    $.requestAjax({
        service: 'Main/GetSorterUsers',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlSorterUser')
                    .find('option')
                    .remove().end()
                    .append('<option value=""> Please select </option>');

                $.each(response.data, function (index, value) {
                    $('#ddlSorterUser').append(`<option value="${value.userId}">${value.firstName} ${value.lastName}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });

    if (onSuccess != undefined) {
        onSuccess();
    }
}

$('input[name="radioOperationSelect"]').on('change', function () {
    // Get the value of the currently selected radio button
    var selectedRadioValue = $('input[name="radioOperationSelect"]:checked').val();

    // You can perform other actions here based on the selected value
    // console.log('Radio button changed! New value: ' + selectedRadioValue);

    // Update the display with the selected value

    if (selectedRadioValue == 'ROL01') {

        if ($('#IsPrepareCentral').val() == "YES") {

            $('#operation-setting-sorting-machine').hide();
            $('#operation-setting-sorter-user').hide();
            $(".operation-setting-submit-button").css('top', '360px');
            $(".operation-setting-logout-button").css('top', '400px');
            $(".container").css('min-height', '480px');
        }
        else {
            $('#operation-setting-sorting-machine').show();
            $('#operation-setting-sorter-user').hide();
            $(".operation-setting-submit-button").css('top', '460px');
            $(".operation-setting-logout-button").css('top', '500px');
            $(".container").css('min-height', '580px');
        }
    }
    else {
        $('#operation-setting-sorting-machine').show();
        $('#operation-setting-sorter-user').show();
        $(".operation-setting-submit-button").css('top', '550px');
        $(".operation-setting-logout-button").css('top', '590px');
        $(".container").css('min-height', '680px');
    }
});

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
        requestData.operationSelected = $('input[name="radioOperationSelect"]:checked').val();
        requestData.machineSelected = $('#ddlSortingMachine').val();

        if ($('input[name="radioOperationSelect"]:checked').val() == 'ROL01') {
            requestData.sorterSelected = "";
        }
        else {
            requestData.sorterSelected = $('#ddlSorterUser').val();
        }

        $.enablePageLoader();

        // $("#pageloading").fadeIn();
        var rootPath = document.body.getAttribute("data-root-path");
        var basePath = document.body.getAttribute("path-base-bss");

        $.requestAjax({
            service: 'Main/SubmitForOperationSetting',
            type: 'POST',
            parameter: requestData,
            enableLoader: false,
            onSuccess: function (response) {
                if (response.is_success == true && response.data != null) {
                    if (response.data.roleCode == "ROL01") {
                        var bnType = $('input[name="radioBanknoteType"]:checked').val();;

                        switch (bnType) {
                            case "CA":
                                window.location = rootPath + "Preparation/PreparationUnsortCAMember";
                                break;
                            case "CN":
                                window.location = rootPath + "Preparation/PreparationUnsortCANonMember";
                                break;
                            case "UC":
                                window.location = rootPath + "Preparation/PreparationUnsoftCC";
                                break;
                            default:
                                window.location = rootPath + "Preparation/PreparationUnfit";;
                        }
                        $.disablePageLoader();
                    }
                    else {
                        $.disablePageLoader();
                        window.location = rootPath + "Reconcilation/Index";
                    }
                } else {
                    setTimeout(function () {
                        $.disablePageLoader();
                        $.createToast({
                            text: response.msg_code + ':' + response.msg_desc,
                            title: 'Error',
                            type: 'error'
                        });
                    }, 50);
                }
            }
        });
    }
});

function clearValidate() {

    $('#ddlSortingMachine').removeClass('is-invalid');
    $('#ddlSorterUser').removeClass('is-invalid');

    $('#ddlSortingMachine').removeClass('is-valid');
    $('#ddlSorterUser').removeClass('is-valid');

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

    $('#ddlSorterUser').on('change', function () {
        $('#ddlSorterUser').removeClass('is-invalid');
        $('#ddlSorterUser').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#ddlSorterUser').addClass('is-valid');
        }
    });

}

function validateSave() {
    var isValid = true;
    var invalidCount = 0;
    clearValidate();


    if ($('input[name="radioOperationSelect"]:checked').val() == 'ROL01') {

        if ($('#IsPrepareCentral').val() == "NO") {
            if ($('#ddlSortingMachine').val() == '') {
                invalidCount = invalidCount + 1;
                $('#ddlSortingMachine').addClass('is-invalid');
            }
        }
    }
    else {

        if ($('#ddlSortingMachine').val() == '') {
            invalidCount = invalidCount + 1;
            $('#ddlSortingMachine').addClass('is-invalid');
        }

        if ($('#ddlSorterUser').val() == '') {
            invalidCount = invalidCount + 1;
            $('#ddlSorterUser').addClass('is-invalid');
        }
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}
