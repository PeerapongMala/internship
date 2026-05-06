
$(document).ready(function () {
    $('#search-user-from-bot').hide();
    $('#no-results').hide();
    $('#has-results').hide();
    $('#my-user-list').hide();

    $('#datepicker').datepicker();

   // jQuery('#sampleDatepicker').datetimepicker();
});

$('#btnSearchUserFromBot').click(function (e) {
    $('#search-user-from-bot').show();
    //$('#no-results').show();
    $('#my-user-list').show();
    $('#has-results').show();
});

function OnSelectItemUser(userName) {

    $('#txtSearchUserFromBot').val(userName);
    $('#search-user-from-bot').hide();
}


$('#btnToastInfo').click(function (e) {
    $.createToast({
        text: 'info message',
        title: 'info Title',
        type: 'info'
    });
});

$('#btnToastSuccess').click(function (e) {
    $.createToast({
        text: 'success message',
        title: 'success Title',
        type: 'success'
    });
});

$('#btnToastWarning').click(function (e) {
    $.createToast({
        text: 'warning message',
        title: 'warning Title',
        type: 'warning'
    });
});

$('#btnToastError').click(function (e) {
    $.createToast({
        text: 'error message',
        title: 'error Title',
        type: 'error'
    });
});