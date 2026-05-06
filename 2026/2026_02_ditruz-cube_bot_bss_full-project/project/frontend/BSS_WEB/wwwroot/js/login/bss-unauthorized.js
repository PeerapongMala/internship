$(document).ready(function () {
    //initComponent();
});

//function closeWindow() {

//    window.open('', '_parent', '').close();
//    window.close();
//}

$('#btnCloseApp').click(function (e) {
    window.location.href = "about:blank";
    window.close();

    //let win = window.open("https://example.com");
    //setTimeout(() => {
    //    win.close();
    //}, 200);

});



function closePage() {
    if (confirm("คุณต้องการปิดหน้านี้หรือไม่?")) {
        window.open('', '_self'); // เปิดหน้าเปล่าแทน
        window.close();           // แล้วค่อยปิด
    }
}