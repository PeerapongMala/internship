$(function () {

    const currentTime = document.querySelector("h2");

    setInterval(() => {
        let date = new Date(),
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds(),
            ampm = "AM";
        if (h >= 12) {
            h = h - 12;
            ampm = "PM";
        }
        h = h == 0 ? h = 12 : h;
        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        currentTime.innerText = `${h}:${m}:${s} ${ampm}`;

        // if (alarmTime === `${h}:${m} ${ampm}`) {
        //     ringtone.play();
        //     ringtone.loop = true;
        // }
    });

    //var telephoneNo = NullToString(value.C48cHomePhoneNo);
    // var p_totAmt = $.textString.ReplaceAll(val_lblBatchAmountTotal, ' บาท', '');
    // p_totAmt = $.textString.ReplaceAll(p_totAmt, ',', '');
});
