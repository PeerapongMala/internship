

$(document).ready(function () {

    // showLoading();


    // setTimeout(() => {
    //     closeLoading();
    // }, 9000); // Simulate a 1-second delay


    $('#myModal').modal('show');
    $('#myModal').on('show.bs.modal', function () {
        $('#modal-loading-spinner').removeClass('d-none');
        $('#modal-content-area').addClass('d-none');

        // Simulate content loading with a delay
        setTimeout(function () {
            $('#modal-loading-spinner').addClass('d-none');
            $('#modal-content-area').removeClass('d-none');
        }, 12000); // 2 seconds delay
    });


    $("#filterSample").slideUp();
    //$('#filterSample').fadeOut("slow");
    $('#ToggleFilter').click(function () {
        //$('#filterSample').fadeToggle(speed);
        $("#filterSample").slideToggle();
    });


    const myOffcanvas = new bootstrap.Offcanvas('#myOffcanvas');

    $('#openButton').on('click', function () {
        // myOffcanvas.show();
        myOffcanvas.toggle();
    });

    $("#example").DataTable({
        responsive: true,
    });

    $('#ddlSelectDefault').select2({
        closeOnSelect: true
    });

    $('#ddlSelectDisabled').select2({
        closeOnSelect: false
    });

    $('#ddlSelectMultiple').select2({
        closeOnSelect: false,
        maximumSelectionLength: 5,
        placeholder: 'Select an option'
    });
});

function showLoading() {

    $.sweetLoadingShow();
}

function closeLoading() {

    $.sweetLoadingHide();
}

