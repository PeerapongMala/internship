$(document).ready(function () {
    // 1. ฟังก์ชันอัปเดตตัวเลข พร้อมไอคอนที่ดูเป็นทางการ
    function updateCounter(input) {
        const $input = $(input);
        const maxLength = $input.attr('maxlength');
        const currentLength = $input.val().length;

        // วิ่งไปหา span.char-counter ที่อยู่ในกลุ่ม mb-3 เดียวกัน
        let $counter;
        const $group = $input.closest('.mb-3');

        // ถ้ามี row อยู่ใน mb-3
        if ($group.hasClass('row')) {
            $counter = $input.closest('[class*="col"]').find('.char-counter');
        }
        else {
            $counter = $group.find('.char-counter');
        }

        if (maxLength && $counter.length) {
            // ใช้ไอคอนดินสอมาตรฐาน (✎) ปรับให้หนาด้วย fw-bold และใช้ opacity-75 ให้ดูไม่เด่นเกินไป
            // จัดการระยะห่างด้วย me-1
            const iconHtml = `<span class="fw-bold opacity-75 me-1" style="font-size: 1.1rem; line-height: 0;">✎</span>`;
            $counter.html(`${iconHtml}${currentLength} / ${maxLength}`);

            // ล้าง Class สีเดิมออกก่อน
            $counter.removeClass('text-muted text-warning text-danger fw-bold');

            const ratio = currentLength / maxLength;

            // การจัดการสถานะสี (UX Best Practice)
            if (ratio >= 1) {
                $counter.addClass('text-danger fw-bold');
            } else if (ratio >= 0.8) {
                $counter.addClass('text-warning');
            } else {
                $counter.addClass('text-muted');
            }
        }
    }

    // 2. สั่งให้ทำงานทันทีที่โหลดหน้าหลัก
    $('input[maxlength], textarea[maxlength]').each(function () {
        updateCounter(this);
    });

    // 3. ดักจับเหตุการณ์ตอนเปิด Modal
    $(document).on('shown.bs.modal', '.modal', function () {
        $(this).find('input[maxlength], textarea[maxlength]').each(function () {
            updateCounter(this);
        });
    });

    // 4. ดักจับเหตุการณ์พิมพ์ (Event Delegation)
    $(document).on('input', 'input[maxlength], textarea[maxlength]', function () {
        updateCounter(this);
    });
});

$(document).ready(function () {
    // ดักจับการพิมพ์ เฉพาะช่องที่มีคลาส 'number-only'
    $(document).on('input', '.number-only', function () {
        // กรองเอาเฉพาะตัวเลข 0-9 เท่านั้น
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // 1. ดักจับตอนพิมพ์: ป้องกันการเคาะ Spacebar ในช่อง Email
    $(document).on('input', '.email-only', function () {
        this.value = this.value.replace(/\s/g, '');
    });

    // 2. ดักจับตอนออกจากช่อง (blur): เพื่อเช็ค Format ว่าถูกต้องไหม
    $(document).on('blur', '.email-only', function () {
        const $input = $(this);
        const emailFilter = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
        const emailValue = $input.val();

        if (emailValue !== "") {
            if (!emailFilter.test(emailValue)) {
                // ถ้า Format ผิด: ใส่คลาสแดงของ Bootstrap และโชว์ข้อความเตือน
                $input.addClass('is-invalid').removeClass('is-valid');
            } else {
                // ถ้า Format ถูก: ใส่คลาสเขียว (ถ้าต้องการ) หรือเอาคลาสแดงออก
                $input.removeClass('is-invalid').addClass('is-valid');
            }
        } else {
            // ถ้าเป็นค่าว่าง (และไม่ใช่ field required) ให้ล้างคลาสออก
            $input.removeClass('is-invalid is-valid');
        }
    });
});