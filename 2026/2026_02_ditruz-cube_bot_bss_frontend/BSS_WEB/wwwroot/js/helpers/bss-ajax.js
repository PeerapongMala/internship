"use strict";
$.ajaxSetup({
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
    /*
    , beforeSend: function (xhr) {
        const token = $('input[name="__RequestVerificationToken"]').val();
        if (token) {
            xhr.setRequestHeader('RequestVerificationToken', token);
        }
    }
    */
});

const _commonErrorMessage = 'Internal Server Error';
let isRefreshing = false;
let refreshQueue = [];

$.enablePageLoader = function (options) {
    $("#pageloading").fadeIn();
};

$.disablePageLoader = function () {
    $("#pageloading").fadeOut();
};

var rootPath = document.body.getAttribute("data-root-path");
var basePath = document.body.getAttribute("path-base-bss");

$.requestAjax = function (options) {
    var service = options.service;
    var parameter = options.parameter;
    var enableLoader = options.enableLoader;
    var async = options.async;
    var type = options.type;
    var ajaxTimeout = options.ajaxTimeout;
    var successCallback = options.onSuccess;
    var errorCallback = options.onError;

    if (parameter == null || parameter == undefined) {
        parameter = {};
    }

    if (async == null || async == undefined) {
        async = true;
    }

    if (type == null || type == undefined) {
        type = 'POST';
    }

    if (ajaxTimeout == null || ajaxTimeout == undefined) {
        ajaxTimeout = 0;
    }

    if (enableLoader) {
        $.enablePageLoader();
    }


    var url = rootPath + service;
    console.log('requestAjax url:' + url);
    $.ajax({
        url: url, 
        
        data: JSON.stringify(parameter),
        cache: false,
        async: async,
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        processData: true,
        type: type,
        timeout: ajaxTimeout,
        complete: function () {
            console.log('requestAjax complete');
            if (enableLoader) {
                $.disablePageLoader();
            }
        }
    }).done(function (data) {
        console.log('requestAjax done : ' + JSON.stringify(data));
        if (data && data.is_success === true) {
            if (typeof successCallback === "function") {
                successCallback(data);
            }
        } else {
            const msgDesc = data?.msg_desc || "";
            const fullMessage = (data?.msg_code || "") + " : " + msgDesc;

            // 🔎 ตรวจสอบว่ามีคำว่า Warning หรือไม่ (ไม่สน case)
            if (msgDesc.toLowerCase().includes("warning")) {

                // ===== ใช้ Modal ของหน้าต้นทาง =====
                $('#errorMessage').html(msgDesc.replace('Warning:', ''));
                $('#ErrorModal').modal('show');

                $('#ErrorModal').on('shown.bs.modal', function () {
                    $('.modal-backdrop').last().css('z-index', 2090);
                });

            } else {

                // ===== ใช้ sweetError เหมือนเดิม =====
                $.sweetError({
                    text: fullMessage + ' / ' + (msgDesc.toLowerCase().includes("warning")),
                    onConfirm: function () {
                        if (typeof errorCallback === "function") {
                            errorCallback(data);
                        }
                    }
                });

            }
        }  

    }).fail(function (jqXHR) {
        console.log('requestAjax fail', jqXHR.status);
        console.log(JSON.stringify(jqXHR)); 

        // HANDLE 401 WITH REFRESH
        if (
            jqXHR.status === 401 &&
            !options._retry &&
            !(service && service.toLowerCase().endsWith("refreshtoken"))
        ) {

            options._retry = true;

            refreshToken()
                .then(function () {
                    console.log("Token refreshed → retry original request");
                    const newOptions = { ...options };
                    delete newOptions._retry;

                    $.requestAjax(newOptions);
                })
                .catch(function () {
                    window.location.replace(rootPath + "Login");
                });

            return;
        }

        // Normal error handling
        $.handlerAjaxError({
            errorCode: jqXHR.status,
            jqXHR: jqXHR
        });

    });
};


$.handlerAjaxError = function (options) {

    console.log("AJAX ERROR:", options);

    let message = _commonErrorMessage; 

    $.sweetError({
        text: message
    });
}; 


function refreshToken() {

    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;

    return new Promise((resolve, reject) => {

        $.ajax({
            url: rootPath + "Login/RefreshToken",
            type: "POST"
        })
            .done(function () {

                isRefreshing = false;

                resolve();

                refreshQueue.forEach(p => p.resolve());
                refreshQueue = [];

            })
            .fail(function () {

                isRefreshing = false;

                reject();

                refreshQueue.forEach(p => p.reject());
                refreshQueue = [];
            });

    });
} 