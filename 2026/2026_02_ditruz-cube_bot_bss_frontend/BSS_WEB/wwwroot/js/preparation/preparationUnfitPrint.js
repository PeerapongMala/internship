let preparationNumberIds = [];

window.addEventListener('load', async () => {
    $("#pageloading").fadeIn();
    try {
        await new Promise(resolve => setTimeout(resolve, 200));

        if (typeof reportPreparationIds !== 'undefined') {
            preparationNumberIds = reportPreparationIds;
        }

        const container = document.getElementById('report-body');
        if (container) {
            const content = container.innerHTML;

            await new Promise(resolve => setTimeout(resolve, 200));

            await window.exportPdfByPlaywright(content, 'PreparationUnfit_Report', true);
        }
    } catch (error) {
        console.error("Initial load error:", error);
    } finally {
        // ประกันความเสี่ยงว่า Loading จะถูกปิดแม้เกิด Error
        $("#pageloading").fadeOut();
    }
});

async function exportData() {
    // ตรวจสอบ Radio button ว่าเลือก PDF หรือ Excel
    const selectedInput = document.querySelector('input[name="exportType"]:checked');
    if (!selectedInput) return;

    const type = selectedInput.value;

    if (type === "pdf") {
        const container = document.getElementById('report-body');
        if (container) {
            const content = container.innerHTML;
            // ถ้าเป็นการกดปุ่มเอง อาจจะส่ง false เพื่อให้ Download ไฟล์จริง
            await window.exportPdfByPlaywright(content, 'PreparationUnfit_Report', false);
        }
    } else if (type === "excel") {
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


        // ใช้ POST เพื่อรองรับ IDs จำนวนมาก
        if (!preparationNumberIds || preparationNumberIds.length === 0) {
            alert("ไม่พบข้อมูลสำหรับการ Export Excel");
            return;
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/Report/PreparationUnfitExportToExcel';

        preparationNumberIds.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'preparationIds';
            input.value = id;
            form.appendChild(input);
        });

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