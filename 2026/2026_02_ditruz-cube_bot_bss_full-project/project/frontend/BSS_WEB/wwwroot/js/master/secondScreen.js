document.addEventListener('DOMContentLoaded', async () => {

    await initComponent();

    setTimeout(updateMarquee, 1500);

});

let resizeTimer;

window.addEventListener('resize', () => {
    updateData();
});

function updateData() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateMarquee, 200);
}

async function initComponent() {
    refreshScreen();
}

function refreshScreen() {
    const deno = document.getElementById("denoType").value;
    switch (deno.trim()) {
        case "20":
            document.body.style.setProperty("background-color", "#F1F9F1", "important");
            document.body.style.setProperty("color", "#336C32", "important");
            break;
        case "50":
            document.body.style.setProperty("background-color", "#F0F8FF", "important");
            document.body.style.setProperty("color", "#013665", "important");
            break;
        case "100":
            document.body.style.setProperty("background-color", "#FFE8E8", "important");
            document.body.style.setProperty("color", "#732E2E", "important");
            break;
        case "500":
            document.body.style.setProperty("background-color", "#F8F5FF", "important");
            document.body.style.setProperty("color", "#3D2E5B", "important");
            break;
        case "1000":
            document.body.style.setProperty("background-color", "#FBF8F4", "important");
            document.body.style.setProperty("color", "#4F3E2B", "important");
            break;
        default:
            document.body.style.setProperty("background-color", "#f8f9fa", "important");
            document.body.style.setProperty("color", "#003865", "important");
    }
}

function updateMarquee() {
    const allMarquees = document.querySelectorAll('.marquee-content, .extra-content');

    allMarquees.forEach(content => {
        const container = content.parentElement;
        if (!container || !content) return;

        // ล้างสถานะ
        content.classList.remove('is-scrolling', 'extra-scrolling');
        container.style.setProperty('justify-content', 'center', 'important');
        content.removeAttribute('data-text');

        // ฟังก์ชันข้างในสำหรับคำนวณและสั่งวิ่ง
        const runCalculation = () => {
            const containerWidth = container.clientWidth;
            const contentWidth = content.getBoundingClientRect().width; // ใช้ตัวนี้วัดค่าทศนิยมได้แม่นกว่า
            const tolerance = 20;

            if (contentWidth > containerWidth - tolerance) {
                const cleanText = content.innerText.replace(/\n/g, ' ').trim();
                content.setAttribute('data-text', cleanText);

                if (content.classList.contains('extra-content')) {
                    content.classList.add('extra-scrolling');
                } else {
                    content.classList.add('is-scrolling');
                }
                container.style.setProperty('justify-content', 'flex-start', 'important');
            }
        };

        runCalculation();
    });
}

$('#btnRefreshSecondScreen').click(function () {
    setTimeout(function () {
        refreshScreen();
        updateMarquee();
    }, 200);
});
