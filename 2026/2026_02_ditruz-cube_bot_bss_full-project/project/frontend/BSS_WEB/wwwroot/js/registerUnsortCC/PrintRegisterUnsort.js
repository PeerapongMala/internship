
window.addEventListener('load', async () => {
    $("#pageloading").fadeIn();
    try {
        const container = document.getElementById('report-body');
        if (container) {
            const content = container.innerHTML;

            await new Promise(resolve => setTimeout(resolve, 300));

            await window.exportPdfByPlaywright(content, 'Print_RegisterUnsortCC', true);
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
        //await exportPdf('report-body', 'unsort-cc-report');
        const container = document.getElementById('report-body');
        if (container) {
            const content = container.innerHTML;
            // ถ้าเป็นการกดปุ่มเอง อาจจะส่ง false เพื่อให้ Download ไฟล์จริง
            await window.exportPdfByPlaywright(content, 'Print_RegisterUnsortCC', false);
        }
    }

    if (selected.value === 'excel') {
        await exportExcelFromHtml();
    }
}

function getIdsFromHidden() {
    const hdnIds = document.getElementById('hdn-ids');
    if (hdnIds && hdnIds.value) {
        // แปลงจาก string "123,456" กลับเป็น array [123, 456]
        return hdnIds.value.split(',').map(Number);
    }
    return [];
}

async function exportExcelFromHtml() {
    $("#pageloading").fadeIn();
    try {
        const NumberIds = getIdsFromHidden();

        console.log("Checking IDs before export:", NumberIds);


        // ใช้ POST เพื่อรองรับ IDs จำนวนมาก
        if (!NumberIds || NumberIds.length === 0) {
            alert("ไม่พบข้อมูลสำหรับการ Export Excel");
            return;
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/Report/RegisterUnsortCCExportToExcel';

        NumberIds.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'Ids';
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
    window.print();
}



