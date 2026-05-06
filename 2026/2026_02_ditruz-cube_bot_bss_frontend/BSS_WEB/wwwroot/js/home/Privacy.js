
var win = null;

$(document).ready(function () {
    $.enablePageLoader();
    initPage();
});

function initPage() {
    setTimeout(function () {
        $.disablePageLoader();
    }, 500);
}

function openWindow() {

    NewWindow('https://getbootstrap.com/', 'popupWindow', 1920, 1080, 'no', 'center');
    // const windowFeatures = "left=100,top=100,width=1920,height=1080,toolbar=no,menubar=no,scrollbars=no,location=no,resizable=yes";


    // var browser = navigator.appName;
    // if (browser == "Microsoft Internet Explorer") {
    //     window.opener = self;
    // }
    // window.open('https://getbootstrap.com/', 'popupWindow', windowFeatures);
    // window.moveTo(0, 0);
    // window.resizeTo(screen.width, screen.height - 100);
    // self.close();
}



function NewWindow(mypage, myname, w, h, scroll, pos) {
    if (pos == "random") {
        LeftPosition = (screen.width) ? Math.floor(Math.random() * (screen.width - w)) : 100;
        TopPosition = (screen.height) ? Math.floor(Math.random() * ((screen.height - h) - 75)) : 100;
    }

    if (pos == "center") {
        LeftPosition = (screen.width) ? (screen.width - w) / 2 : 100;
        TopPosition = (screen.height) ? (screen.height - h) / 2 : 100;
    } else if ((pos != "center" && pos != "random") || pos == null) {
        LeftPosition = 0;
        TopPosition = 20;
    }

    settings = 'width=' + w + ',height=' + h + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=' + scroll + ',location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=no';
    win = window.open(mypage, myname, settings);
}

$(function () {

    $('#btnShowToast').click(function (e) {
        $.createToast({
            text: 'Updated the data success.',
            title: 'Success Title',
            type: 'success'
        });

        $.createToast({
            text: 'Updated the data warning',
            title: 'Warning Title',
            type: 'warning'
        });

        $.createToast({
            text: 'Updated the data info',
            title: 'Info Title',
            type: 'info'
        });

        $.createToast({
            text: 'Updated the data error',
            title: 'Error Title',
            type: 'error'
        });
    });

    $('#btnShowAlertSuccess').click(function (e) {
        Swal.fire({
            title: "Good job!",
            text: "You clicked the button!",
            icon: "success"
        });
    });

    $('#btnShowAlertError').click(function (e) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="#">Why do I have this issue?</a>'
        });
    });

    $('#btnShowAlertCustom').click(function (e) {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500
        });
    });

    $('#btnShowAlertConfirm').click(function (e) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
    });
});
