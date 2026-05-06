"use strict";

let errorSound = new Audio("/sounds/bss-error-beep.mp3");
let scannerSound = new Audio("/sounds/scanner-beep.mp3");

function playErrorAlarm() {
    errorSound.play();
    errorSound.loop = false;
}

function playScannerAlarm() {
    scannerSound.play();
    scannerSound.loop = false;
}

$(function () {

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
        "positionClass": "toast-bottom-right", // Position of the toast container //"toast-top-full-width" toast-top-center toast-bottom-right 
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

function NullToString(value) {
    if (value == null) {
        return '';
    }
    else {
        return value;
    }
}

$.textString = {
    ReplaceAll: function (Source, stringToFind, stringToReplace) {
        var temp = Source;
        var index = temp.indexOf(stringToFind);
        while (index != -1) {
            temp = temp.replace(stringToFind, stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
    }

};

$.sweetLoadingShow = function () {
    Swal.fire({
        title: 'Processing ...',
        text: 'Please wait while we complete your request.',
        allowOutsideClick: false, // Prevent closing by clicking outside
        allowEscapeKey: false,   // Prevent closing by pressing Escape key
        didOpen: () => {
            Swal.showLoading();
        }
    });
};
$.sweetLoadingHide = function () {
    // Simulate an AJAX request
    setTimeout(() => {
        // Hide loading spinner after the operation is complete
        Swal.close();

        // Show a success or error message
        //$.sweetSuccess({
        //    text: 'สำเร็จ'
        //});
    }, 50); // Simulate a 2-second delay
};


$.sweetSuccess = function (options) {
    var title = options.title;
    var text = options.text;
    var confirmButtonText = options.confirmButtonText;
    var confirmButtonClass = options.confirmButtonClass;
    var onconfirm = options.onConfirm;

    if (title == null || title == undefined) {
        title = 'Success';
    }

    if (text == null || text == undefined) {
        text = 'ทำรายการสำเร็จ';
    }

    if (confirmButtonText == null || confirmButtonText == undefined) {
        confirmButtonText = 'ตกลง';
    }

    if (confirmButtonClass == null || confirmButtonClass == undefined) {
        confirmButtonClass = 'btn btn-default';
    }

    Swal.fire({
        icon: "success",
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 1500
    });
};

$.sweetWarning = function (options) {
    var title = options.title;
    var text = options.text;
    var confirmButtonText = options.confirmButtonText;
    var confirmButtonClass = options.confirmButtonClass;
    var onconfirm = options.onConfirm;

    if (title == null || title == undefined) {
        title = 'ข้อความแจ้งเตือน';
    }

    if (text == null || text == undefined) {
        text = 'มีบางอย่างไม่ถูกต้อง';
    }

    if (confirmButtonText == null || confirmButtonText == undefined) {
        confirmButtonText = 'ตกลง';
    }

    if (confirmButtonClass == null || confirmButtonClass == undefined) {
        confirmButtonClass = 'btn btn-default';
    }

    Swal.fire({
        icon: "warning",
        title: title,
        text: text
    });

//    Swal.fire({
//        title: title,
//        text: text,
//        icon: "warning",
//        buttonsStyling: true,
//        confirmButtonText: confirmButtonText
///*        confirmButtonClass: confirmButtonClass*/
//    }).then(function (result) {
//        if (result.value) {
//            if (onconfirm != null && onconfirm != undefined) {
//                onconfirm();
//            }
//        }
//    });
};

$.sweetError = function (options) {
    var title = options.title;
    var text = options.text;
    var confirmButtonText = options.confirmButtonText;
    var confirmButtonClass = options.confirmButtonClass;
    var onConfirm = options.onConfirm;

    if (title == null || title == undefined) {
        title = 'เกิดข้อผิดพลาด';
    }

    if (text == null || text == undefined) {
        text = 'เกิดข้อผิดพลาด';
    }

    if (confirmButtonText == null || confirmButtonText == undefined) {
        confirmButtonText = 'ตกลง';
    }

    if (confirmButtonClass == null || confirmButtonClass == undefined) {
        confirmButtonClass = 'btn btn-default';
    }

    Swal.fire({
        icon: "error",
        title: title,
        text: text
    }).then(function (result) {

        if (typeof onConfirm === "function") { 
            onConfirm(result);
        }

        return result; // allow await chaining
    });

    //Swal.fire({
    //    title: title,
    //    text: text,
    //    icon: "error",
    //    buttonsStyling: false,
    //    confirmButtonText: confirmButtonText,
    //    confirmButtonClass: confirmButtonClass
    //}).then(function (result) {
    //    if (result.value) {
    //        if (onconfirm != null && onconfirm != undefined) {
    //            onconfirm();
    //        }
    //    }
    //});
};

$.sweetInfo = function (options) {
    var title = options.title;
    var text = options.text;
    var confirmButtonText = options.confirmButtonText;
    var confirmButtonClass = options.confirmButtonClass;
    var onconfirm = options.onConfirm;

    if (title == null || title == undefined) {
        title = 'ข้อความ';
    }

    if (text == null || text == undefined) {
        text = 'แจ้งข้อมูลทั่วไป';
    }

    if (confirmButtonText == null || confirmButtonText == undefined) {
        confirmButtonText = 'ตกลง';
    }

    if (confirmButtonClass == null || confirmButtonClass == undefined) {
        confirmButtonClass = 'btn btn-default';
    }

    Swal.fire({
        icon: "info",
        title: title,
        text: text
    });

//    Swal.fire({
//        title: title,
//        text: text,
//        icon: "info",
//        buttonsStyling: true,
//        confirmButtonText: confirmButtonText
///*        confirmButtonClass: confirmButtonClass*/
//    }).then(function (result) {
//        if (result.value) {
//            if (onconfirm != null && onconfirm != undefined) {
//                onconfirm();
//            }
//        }
//    });
};

$.sweetQuestion = function (options) {
    var title = options.title;
    var text = options.text;
    var confirmButtonText = options.confirmButtonText;
    var confirmButtonClass = options.confirmButtonClass;
    var cancelButtonText = options.cancelButtonText;
    var cancelButtonClass = options.cancelButtonClass;
    var onconfirm = options.onConfirm;
    var oncancel = options.onCancel;

    if (title == null || title == undefined) {
        title = 'ข้อความยืนยัน';
    }

    if (text == null || text == undefined) {
        text = 'ต้องการทำรายการนี้ใช่หรือไม่';
    }

    if (confirmButtonText == null || confirmButtonText == undefined) {
        confirmButtonText = 'ตกลง';
    }

    if (confirmButtonClass == null || confirmButtonClass == undefined) {
        confirmButtonClass = 'btn btn-primary';
    }

    if (cancelButtonText == null || cancelButtonText == undefined) {
        cancelButtonText = 'ยกเลิก';
    }

    if (cancelButtonClass == null || cancelButtonClass == undefined) {
        cancelButtonClass = 'btn btn-default';
    }

    Swal.fire({
        title: title,
        text: text,
        icon: "question",
        buttonsStyling: true,
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
/*        confirmButtonClass: confirmButtonClass,*/
        cancelButtonText: cancelButtonText,
/*        cancelButtonClass: cancelButtonClass,*/
        reverseButtons: true
    }).then(function (result) {
        if (result.value) {
            if (onconfirm != null && onconfirm != undefined) {
                onconfirm();
            }
        }
        else if (result.dismiss === 'cancel') {
            if (oncancel != null && oncancel != undefined) {
                oncancel();
            }
        }
    });
};




