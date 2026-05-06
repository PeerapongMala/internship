let preparationNumberIds = [];

window.addEventListener('load', async () => {
    $("#pageloading").fadeIn();
    try {
        if (typeof reportPreparationIds !== 'undefined') {
            preparationNumberIds = reportPreparationIds;
        }

        const container = document.getElementById('report-body');
        if (container) {
            const content = container.innerHTML;

            await new Promise(resolve => setTimeout(resolve, 300));

            await window.exportPdfByPlaywright(content, 'PreparationUnsortCANonMember_Report', true);
        }
    } catch (error) {
        console.error("Initial load error:", error);
    } finally {
        // ประกันความเสี่ยงว่า Loading จะถูกปิดแม้เกิด Error
        $("#pageloading").fadeOut();
    }

});

async function exportData() {
    const selected = document.querySelector('input[name="exportType"]:checked');

    if (!selected) {
        return;
    }

    if (selected.value === 'pdf') {
        //await exportPdf('report-body', 'preparation-unsort-ca-non-member-report');
        const container = document.getElementById('report-body');
        if (container) {
            const content = container.innerHTML;
            // เรียกใช้ฟังก์ชันจาก window
            await window.exportPdfByPlaywright(content, 'PreparationUnsortCANonMember_Report');
        }
    }

    if (selected.value === 'excel') {
        await exportExcelFromHtml();
    }
}

function getPreparationIdsFromHidden() {
    const hdnIds = document.getElementById('hdn-preparation-ids');
    if (hdnIds && hdnIds.value) {
        // แปลงจาก string "123,456" กลับเป็น array [123, 456]
        return hdnIds.value.split(',').map(Number);
    }
    return [];
}

async function exportExcelFromHtml() {
    $("#pageloading").fadeIn();
    try {
        const preparationNumberIds = getPreparationIdsFromHidden();

        console.log("Checking IDs before export:", preparationNumberIds);

        if (!preparationNumberIds || preparationNumberIds.length === 0) {
            alert("ไม่พบข้อมูลสำหรับการ Export Excel");
            return;
        }

        // 3. สร้าง Form ชั่วคราวเพื่อส่ง POST (รับข้อมูลได้เยอะที่สุด)
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/Report/PreparationUnsortCANonMemberExportToExcel';
        form.target = '_self'; // ดาวน์โหลดในหน้าเดิม

        // 4. วนลูปสร้าง Input สำหรับทุก ID
        preparationNumberIds.forEach(id => {
            if (id) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'preparationIds'; // ต้องตรงกับชื่อ Parameter ใน Controller
                input.value = id;
                form.appendChild(input);
            }
        });

        // 5. ส่งข้อมูล
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        setTimeout(() => {
            $("#pageloading").fadeOut();
        }, 3000);

    } catch (error) {
        console.error("Export error:", error);
        $("#pageloading").hide();
    }
}

function goBack() {
    window.close();
}

function printPage() {
    const iframe = document.querySelector('iframe');
    // ถ้าแสดง PDF อยู่ ให้สั่งพิมพ์จาก iframe จะชัดกว่า
    if (iframe && iframe.style.display !== 'none') {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    } else {
        window.print();
    }
}


