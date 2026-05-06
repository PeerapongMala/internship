window.jspdf = undefined;

async function exportPdf(reportBodyname, fileName) {
    //window.print();
    const { jsPDF } = window.jspdf;
    const element = document.getElementById(reportBodyname);

    const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: false,
        backgroundColor: "#fff",
    });

    const margin = 40;
    const pdf = new jsPDF("p", "pt", "a4");
    const imgData = canvas.toDataURL("image/png");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = margin;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - margin * 2);

    while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + margin;
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);
    }

    pdf.save(`${fileName}.pdf`);
}

async function fetchRetry(url, options, retry = 3) {
    let lastError;

    for (let i = 0; i <= retry; i++) {
        try {
            const res = await fetch(url, options);
            return res;
        } catch (err) {
            lastError = err;

            if (i < retry) {
                await new Promise(r => setTimeout(r, 1200));
            }
        }
    }

    throw lastError;
}

window.exportPdfByPlaywright = async function (htmlBodyContent, fileNamePrefix, isPreview = false, orientation = "portrait") {
    if (!htmlBodyContent) {
        console.error("No content provided");
        return;
    }

    let styles = "";
    // ดึง CSS ทั้งหมดในหน้าปัจจุบัน
    for (const sheet of document.styleSheets) {
        try {

            if (!sheet.cssRules) continue;

            for (const rule of sheet.cssRules) {
                styles += rule.cssText;
            }

        } catch (e) {
            console.warn("Could not read stylesheet rules (CORS): ", e);
        }
    }

    console.log(htmlBodyContent);

    // กำหนดค่ามาตรฐานของเนื้อหา
    //const orientation = 'portrait'
    const contentWidth = orientation === 'landscape'
        ? 1123   // A4 landscape
        : 794;   // A4 portrait

    const fullHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <style>
                    @page {
                        size: A4 ${orientation};
                        margin: 1cm;
                    }
                    body {
                        overflow: visible !important;
                    }
                    html, body {
                        margin: 0;
                        padding: 0;
                        width: ${contentWidth}px;
                        font-family: 'Pridi', sans-serif !important;
                        background: white;
                    }
                    ${styles}
                    
                    /* Utility Classes */
                    .top-toolbar, .print-toolbar, .btn-export, hr { display: none !important; }
                    
                   
                </style>
            </head>
            <body>
                <div id="report-body">${htmlBodyContent}</div>
            </body>
        </html>`;



    try {
        await new Promise(r => setTimeout(r, 500));

        const response = await fetchRetry('/Report/ExportPdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dataBody: fullHtml,
                fileName: fileNamePrefix
            })
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // --- ส่วนที่ใช้ตรวจสอบ isPreview ---
            if (isPreview) {
                // สำหรับแสดงผลใน iframe ทันที
                const iframe = document.querySelector('iframe'); // หรือระบุ ID เช่น document.getElementById('pdf-iframe')
                const reportBody = document.getElementById('report-body');

                if (iframe) {
                    iframe.src = url;
                    iframe.style.display = 'block';

                    //// ถ้าต้องการซ่อนเนื้อหา HTML เดิม
                    //if (reportBody) {
                    //    reportBody.style.display = 'none';
                    //}

                    // ปิด Loading status ถ้าคุณทำไว้
                    const loadingArea = document.getElementById('loading-area');
                    if (loadingArea) loadingArea.style.display = 'none';
                }
            } else {
                // สำหรับ Download ปกติ
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileNamePrefix}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            }
        } else {
            if (!response.ok) {
                const errorText = await response.text();
                console.log("Server error:", errorText);
            }
            alert("Export PDF Failed (Status: " + response.status + ")");
        }
    } catch (error) {
        console.error("Export Error:", error);
    }
};

async function checkSupervisorIsOnlineAsync() {
    return new Promise(function (resolve, reject) {
        $.requestAjax({
            service: 'Report/CheckSupervisorOnline',
            type: 'GET',
            enableLoader: false,
            onSuccess: function (response) {
                resolve(response);
            },
            onError: function (err) {
                reject(err);
            }
        });
    });
}

function showSupervisorOffLineErrorModal(message) {
    const errorSpan = document.getElementById("barcodeErrorMessageText");
    if (errorSpan) {
        errorSpan.innerText = message || "เกิดข้อผิดพลาด";
    }

    const modalElement = document.getElementById("barcodeErrorModal");
    if (!modalElement) return;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}