window.createServerSideDataTable = function (options) {

    // ✅ LOCAL debounce
    function debounce(fn, delay = 150) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    if (!$.fn.dataTable.ext._errModeDisabled) {
        $.fn.dataTable.ext.errMode = 'none';
        $.fn.dataTable.ext._errModeDisabled = true;
    }

    let table;
    let resizeEventNs;

    const path = document.body.getAttribute("data-root-path");

    const defaults = {
        selector: '.datatable',
        height: '420px',
        url: '',
        columns: [],
        searching: true,
        ordering: true,

        buildFilter: null,
        onInitComplete: null,

        // ✅ features
        autoResize: true,
        resizeDelay: 150,
        usePageLoader: false
    };

    const settings = { ...defaults, ...options };

    const antiForgeryToken =
        $('input[name="__RequestVerificationToken"]').val();

    function init() {

        // ✅ guard against double init
        if ($.fn.DataTable.isDataTable(settings.selector)) {
            $(settings.selector).DataTable().destroy();
        }

        // cleanup old resize handler
        if (resizeEventNs) {
            $(window).off(resizeEventNs);
        }

        table = $(settings.selector).DataTable({
            scrollX: true,
            scrollY: settings.height,
            scrollCollapse: true,
            autoWidth: false,
            processing: true,
            serverSide: true,
            searching: settings.searching,
            ordering: settings.ordering,
            responsive: false,
            language: {
                emptyTable: "ไม่พบข้อมูล",
                zeroRecords: "ไม่พบข้อมูล",
                info: 'รายการที่ _START_ ถึง _END_ จาก _TOTAL_ รายการ',
                infoEmpty: ""
            },
            ajax: {
                url: path + settings.url,
                type: 'POST',
                contentType: 'application/json',
                beforeSend: function (xhr) {
                    if (antiForgeryToken) {
                        xhr.setRequestHeader(
                            'RequestVerificationToken',
                            antiForgeryToken
                        );
                    }
                },
                data: function (d) {

                    const order = d.order?.[0];
                    const sort =
                        order && d.columns?.[order.column]?.data
                            ? [{
                                field: d.columns[order.column].data,
                                direction: order.dir === "desc" ? 1 : 0
                            }]
                            : [];

                    const payload = {
                        draw: d.draw,
                        pageNumber: Math.floor(d.start / d.length) + 1,
                        pageSize: d.length,
                        search: d.search.value || null,
                        sorts: sort,
                        filter: null
                    };

                    if (typeof settings.buildFilter === 'function') {
                        const filter = settings.buildFilter();
                        payload.filter =
                            filter && Object.keys(filter).length > 0
                                ? filter
                                : null;
                    }
                    console.log('DataTable: ' + JSON.stringify(payload));
                    return JSON.stringify(payload);
                },
                error: function (xhr) {
                    console.error('DataTable AJAX error', {
                        status: xhr.status,
                        response: xhr.responseText
                    });
                }
            },
            columns: settings.columns,
            initComplete: function () {

                const api = this.api();
                const container = $(api.table().container());

                // input search ของ DataTables
                const $searchInput = container.find('.dataTables_filter input');

                // ปิด event search เดิมของ DataTables
                $searchInput.off('keyup.DT input.DT');

                let searchTimer;

                // bind debounce search ใหม่
                $searchInput.on('input', function () {

                    clearTimeout(searchTimer);

                    const value = this.value;

                    searchTimer = setTimeout(function () {

                        api.search(value).draw();

                    }, 800); // delay search

                });

                api.columns.adjust();
                settings.onInitComplete?.(table);
            },
            drawCallback: function () {
                const api = this.api();

                $(api.table().container())
                    .find('.dataTables_paginate')
                    .toggle(api.page.info().recordsDisplay > 0);

                api.columns.adjust();
            }
        });

        // ✅ PAGE LOADER HOOK (CORRECT WAY)
        if (settings.usePageLoader) {
            table.on('processing.dt', function (e, s, processing) {
                if (processing) {
                    $.enablePageLoader();
                } else {
                    $.disablePageLoader();
                }
            });
        }

        // ✅ AUTO RESIZE
        if (settings.autoResize) {
            resizeEventNs =
                `resize.dt-${settings.selector.replace(/[#.]/g, '')}`;

            const resizeHandler = debounce(() => {
                if (!table) return;
                table.columns.adjust();
            }, settings.resizeDelay);

            $(window).on(resizeEventNs, resizeHandler);
        }
    }

    function refresh(resetPaging = true) {
        if (!table) return;
        table.ajax.reload(null, resetPaging);
    }

    function adjust() {
        if (!table) return;
        table.columns.adjust();
    }

    return {
        init,
        refresh,
        adjust
    };
};


//i will move to common later
function RenderDataTableThaiDate(data) {
     
    return FormatThaiDate(data);
}
function RenderDataTableActiveBadge(data) {
    return data
        ? '<span class="badge badge-active">Active</span>'
        : '<span class="badge badge-inactive">Inactive</span>';
}
function RenderDataTableYesNoBadge(data) {
    return data
        ? '<span class="badge badge-active">Yes</span>'
        : '<span class="badge badge-inactive">No</span>';
}
function FormatThaiDate(data) {
    if (!data) return '';

    let date = new Date(data);

    // Check invalid date
    if (isNaN(date.getTime())) return '';

    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear() + 543; // Thai year

    return `${day}/${month}/${year}`;
}
function ParseThaiDate(value) {

    if (!value) return null;

    const parts = value.split('/');
    if (parts.length !== 3) return null;

    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1; // JS month is 0-based
    let thaiYear = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(thaiYear)) return null;

    let christianYear = thaiYear - 543;

    const date = new Date(christianYear, month, day);

    return isNaN(date.getTime()) ? null : date;
}

function scrollToFirstInvalid(modalElement) {

    // If jQuery object, convert to DOM
    if (modalElement instanceof jQuery) {
        modalElement = modalElement[0];
    }

    const modalBody = modalElement.querySelector('.modal-body');
    const firstInvalid = modalBody.querySelector('.is-invalid');

    if (!firstInvalid) return;

    const bodyRect = modalBody.getBoundingClientRect();
    const elementRect = firstInvalid.getBoundingClientRect();

    const offset = elementRect.top - bodyRect.top + modalBody.scrollTop - 20;

    modalBody.scrollTo({
        top: offset,
        behavior: 'smooth'
    });

    setTimeout(() => firstInvalid.focus(), 300);
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
function isValidNumber(value) {
    return !isNaN(value) && value.trim() !== '';
}