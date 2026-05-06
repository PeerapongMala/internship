"use strict";

//var connection = new signalR.HubConnectionBuilder().withUrl("/NotificationHub").build();
let iCount = 0;
$(function () {
    /*
    connection.start().then(function () {
        console.log('Connected to NotificationHub');
    }).catch(function (err) {
        return console.error(err.toString());
    });
    */
});
/*
connection.on("ReceivedMessage", function (type, message, status) {
    var rowId = GetRowId(type);
    var statusContent = GetStatusContent(status);

    $('#' + rowId + ' td:nth-child(2)').text(message);
    $('#' + rowId + ' td:nth-child(3)').html(statusContent);

    if (status == 'completed') {
        iCount++;
        $('#noitCount').html(iCount);
        $('#' + rowId).css('color', 'green');
        $.createToast({
            text: message,
            title: 'Success Title',
            type: 'success'
        });
    }
    else if (status == 'error') {
        $('#' + rowId).css('color', 'red');
        $.createToast({
            text: message,
            title: 'Error Title',
            type: 'error'
        });
    }
    else if (status == 'warning') {
        $('#' + rowId).css('color', '#E9BD0C');
        $.createToast({
            text: message,
            title: 'warning Title',
            type: 'warning'
        });
    }
    else if (status == 'info') {
        $('#' + rowId).css('color', '#3498DB');
        $.createToast({
            text: message,
            title: 'info Title',
            type: 'info'
        });
    }
});
*/
function GetRowId(type) {
    var rowId = '';
    switch (type) {
        case 'Retrieve': {
            rowId = 'trRetrieve';
        }
            break;
        case 'Calculate': {
            rowId = 'trCalculate';
        }
            break;
        case 'Update': {
            rowId = 'trUpdate';
        }
            break;
        case 'Logs': {
            rowId = 'trLogs';
        }
            break;
        case 'Emails': {
            rowId = 'trEmails';
        }
            break;
    }

    return rowId;
}

function GetStatusContent(status) {
    var content = '';
    if (status == 'started') {
        content = '<img src="/Images/processing.gif" width="24px" height="24px" /> working on...';
    }
    else if (status == 'completed') {
        content = '<img src="/Images/completed.png" width="24px" height="24px" /> completed';
    }
    else if (status == 'error') {
        content = '<img src="/Images/error.png" width="24px" height="24px" /> error';
    }

    return content;
}

