
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