document.addEventListener("DOMContentLoaded", async () => {
    await initComponent();
});

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