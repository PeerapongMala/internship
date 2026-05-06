let mocContainer = [
    { id: 1, container: 'PPL9909', date: '10/09/2568' },
    { id: 2, container: 'PPP1006', date: '10/09/2568' }
];

let mocUnsortNote = [
    { id: 1, containerId: 1, bankName: 'ธ.กรุงไทย', priceType: 100, bundle: 5, date: '10/09/2568', createBy: 'ไพศาล' },
    { id: 2, containerId: 1, bankName: 'ธ.กรุงไทย', priceType: 500, bundle: 3, date: '10/09/2568', createBy: 'ไพศาล' },
    { id: 3, containerId: 2, bankName: 'ธ.กสิกร', priceType: 1000, bundle: 2, date: '10/09/2568', createBy: 'ไพศาล' },
    { id: 4, containerId: 1, bankName: 'ธ.กสิกร', priceType: 50, bundle: 10, date: '10/09/2568', createBy: 'ไพศาล' }
];

let mocWaybill = [
    { id: 1, waybillCode: 'UCC256XXXXXX1', dateWaybill: '10/09/2568 14:10', bank: 'ธนาคารกรุงเทพ', createBy: 'ไพศาล', container: [{ id: 101, container: 'PPL1001', date: '10/09/2568', bundle: 5 }, { id: 102, container: 'PPP1002', date: '10/09/2568', bundle: 3 }] },
    { id: 2, waybillCode: 'UCC256XXXXXX2', dateWaybill: '11/09/2568 09:00', bank: 'ธนาคารไทยพาณิชย์', createBy: 'ไพศาล', container: [{ id: 201, container: 'PPP2001', date: '11/09/2568', bundle: 8 }] },
    { id: 3, waybillCode: 'UCC256XXXXXX3', dateWaybill: '11/09/2568 10:30', bank: 'ธนาคารกรุงเทพ', createBy: 'ไพศาล', container: [{ id: 301, container: 'PPL3001', date: '11/09/2568', bundle: 6 }, { id: 302, container: 'PPP3001', date: '11/09/2568', bundle: 4 }] },
    { id: 4, waybillCode: 'UCC256XXXXXX4', dateWaybill: '10/09/2568 15:30', bank: 'ธนาคารกสิกรไทย', createBy: 'ไพศาล', container: [{ id: 401, container: 'PPL4001', date: '11/09/2568', bundle: 10 }, { id: 402, container: 'PPP4002', date: '11/09/2568', bundle: 2 }] },
    { id: 5, waybillCode: 'UCC256XXXXXX5', dateWaybill: '10/09/2568 15:30', bank: 'ธนาคารกสิกรไทย', createBy: 'ไพศาล', container: [{ id: 501, container: 'PPL5001', date: '11/09/2568', bundle: 10 }, { id: 502, container: 'PPP5002', date: '11/09/2568', bundle: 2 }] },
    { id: 6, waybillCode: 'UCC256XXXXXX6', dateWaybill: '10/09/2568 15:30', bank: 'ธนาคารกสิกรไทย', createBy: 'ไพศาล', container: [{ id: 601, container: 'PPL6001', date: '11/09/2568', bundle: 10 }, { id: 602, container: 'PPP6002', date: '11/09/2568', bundle: 12 }, { id: 603, container: 'PPP6003', date: '11/09/2568', bundle: 20 }, { id: 604, container: 'PPP6004', date: '11/09/2568', bundle: 30 }, { id: 605, container: 'PPP6005', date: '11/09/2568', bundle: 10 }, { id: 606, container: 'PPP6006', date: '11/09/2568', bundle: 5 }] }
];

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

async function initComponent() {
    loadPrintData();
}

function loadPrintData() {
    const params = new URLSearchParams(window.location.search);
    const waybillId = params.get('waybillId');
    const containerId = params.get('containerId');

    if (waybillId) {
        const item = mocWaybill.find(w => w.id == waybillId);
        if (item) {
            updateUIForWaybill(item);
        } else {
            console.error("ไม่พบข้อมูล waybillId:", waybillId);
        }
    }
    // กรณีที่ 2: หน้าลงทะเบียน
    else if (containerId) {
        const containerData = mocContainer.find(c => c.id == containerId);
        const data = mocUnsortNote.filter(x => x.containerId == containerId);
        if (containerData) {
            updateUIForContainer(containerData, data);
        } else {
            console.error("ไม่พบข้อมูล containerId:", containerId);
        }
    }
}

function updateUIForWaybill(item) {
    if (document.getElementById('reportTitle')) document.getElementById('reportTitle').textContent = "ใบส่งมอบ UNSORT CC";
    if (document.getElementById('ContainerCode')) document.getElementById('ContainerCode').textContent = item.waybillCode;
    if (document.getElementById('dateRegister')) document.getElementById('dateRegister').textContent = item.dateWaybill;

    if (document.getElementById('operatorName')) document.getElementById('operatorName').textContent = item.createBy;

    const tbody = document.getElementById('printTableBody');
    if (tbody) {
        tbody.innerHTML = item.container.map((c, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.bank}</td>
                <td>${c.date}</td>
                <td>-</td> 
                <td>${c.bundle}</td>
                <td>${item.createBy}</td> </tr>
        `).join('');
    }

    if (document.getElementById('ContainerCodeSummary')) document.getElementById('ContainerCodeSummary').textContent = item.waybillCode;
    const totalBundles = item.container.reduce((sum, c) => sum + (c.bundle || 0), 0);
    if (document.getElementById('txtBundleCount')) document.getElementById('txtBundleCount').textContent = totalBundles;
    if (document.getElementById('countBank')) document.getElementById('countBank').textContent = "1";
}

function updateUIForContainer(containerData, data) {
    if (document.getElementById('reportTitle')) document.getElementById('reportTitle').textContent = "ใบลงทะเบียน UNSORT CC";
    if (document.getElementById('ContainerCode')) document.getElementById('ContainerCode').textContent = containerData.container;
    if (document.getElementById('ContainerCodeSummary')) document.getElementById('ContainerCodeSummary').textContent = containerData.container;
    if (document.getElementById('dateRegister')) document.getElementById('dateRegister').textContent = containerData.date;

    const tbody = document.getElementById('printTableBody');
    if (tbody) {
        tbody.innerHTML = data.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.bankName}</td>
                <td>${item.date}</td>
                <td>${item.priceType}</td>
                <td>${item.bundle}</td>
                <td>${item.createBy}</td>
            </tr>
        `).join('');
    }

    const totalBundles = data.reduce((sum, i) => sum + i.bundle, 0);
    if (document.getElementById('txtBundleCount')) document.getElementById('txtBundleCount').textContent = totalBundles;

    const uniqueBanks = [...new Set(data.map(i => i.bankName))];
    if (document.getElementById('countBank')) document.getElementById('countBank').textContent = uniqueBanks.length;
}

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

//async function exportExcelFromHtml() {
//    const params = new URLSearchParams(window.location.search);
//    window.location.href = `/Report/RegisterUnsortCCExportToExcel${window.location.search}`;
//}

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



