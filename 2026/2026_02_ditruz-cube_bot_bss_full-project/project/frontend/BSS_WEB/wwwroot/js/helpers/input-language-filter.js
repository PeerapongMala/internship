document.addEventListener("input", function (e) {

    if (e.target.classList.contains("thai-only")) {
        e.target.value = e.target.value.replace(/[^ก-๙\s\.\-\(\)]/g, '');
    }

    if (e.target.classList.contains("en-only")) {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s\.\-\(\)]/g, '');
    }

});