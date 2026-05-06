
$(function () {
    $('#btnProcessLoans').click(function (e) {
        var url = 'Admin/ProcessDatas';
        $.post(url, function (response) {
            console.log(response);
        });
    });

    $('[data-toggle="popover"]').popover({
        html: true,
        content: function () {
            return $('#popover-content').html();
        }
    });

    $('[data-toggle="tooltip"]').tooltip();
});
