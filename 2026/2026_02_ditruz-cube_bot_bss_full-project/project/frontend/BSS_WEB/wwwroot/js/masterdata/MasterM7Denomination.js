//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterM7Denomination/SearchM7Denomination',
    height: '420px',
    buildFilter: function () {
        var isActiveVal = $('#ddlFilterStatus').val();
        let isActive = null;
        if (isActiveVal === "1") {
            isActive = true;
        } else if (isActiveVal === "0") {
            isActive = false;
        }
        var selDeno = $('#ddlFilterDenomination').val();
        var selSeriesDenomId = $('#ddlFilterSeriesDenom').val();
        return {
            denoId: selDeno ? parseInt(selDeno, 10) : null,
            seriesDenomId: selSeriesDenomId ? parseInt(selSeriesDenomId, 10) : null,
            isActive: isActive
        };
    },
    columns: [

        {
            data: 'm7DenomCode',
            title: 'รหัสชนิดราคาของเครื่องจักร',
            className: 'text-start',
            width: '200px'
        },

        {
            data: 'm7DenomName',
            title: 'ชื่อชนิดราคา',
            className: 'text-start',

        },

        {
            data: 'm7DenomBms',
            title: 'DenominationBms',
            className: 'text-start',
            width: '100px'
        },
        {
            data: 'm7DnBms',
            title: 'DnBms',
            className: 'text-start',
            width: '100px'
        },
        {
            data: 'denominationDesc',
            title: 'ชื่อราคาธนบัตร',
            className: 'text-start',
            width: '100px'
        },
        {
            data: 'isActive',
            title: 'สถานะใช้งาน',
            className: 'text-center',
            orderable: true,
            width: '100px',
            render: function (data, type) {
                // For sorting & filtering
                if (type === 'sort' || type === 'type') {
                    return data ? 1 : 0;
                }

                // For display
                return data
                    ? '<span class="badge badge-active">Active</span>'
                    : '<span class="badge badge-inactive">Inactive</span>';
            }
        },
        {
            title: 'ดำเนินการ',
            width: '100px',
            orderable: false,
            searchable: false,
            className: 'text-center',
            render: function (_, __, value) {
                return `
                     <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.m7DenomId}"
                                    onclick="showViewPopup(${value.m7DenomId},
                                            '${value.m7DenomCode}',
                                            '${value.m7DenomName}',
                                            '${value.m7DenomDescrpt}',
                                            '${value.m7DenomBms}',
                                            '${value.m7DnBms}',
                                            ${value.isActive},
                                            '${value.denoId}',
                                            '${value.denominationCode}',
                                            '${value.denominationDesc}',
                                            ${value.seriesDenomId},
                                            '${value.seriesDenomCode}', 
                                            '${value.seriesDenomDesc}'
                                                    );"
                            data-toggle="tooltip" title="ดูข้อมูล" ><i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                            <button type="button" data-toggle="tooltip" title="แก้ไขข้อมูล" class="actionBtn btn btn-action" id="btnItemEdit_${value.m7DenomId}"
                                            onclick="showEditPopup(${value.m7DenomId},${value.denoId});">
                            <i class="bi bi-pencil-square" fill="currentColor"></i>
                    </button>
                `;
            }
        }
    ],
    onInitComplete: function () {
        //
    }
});
$(document).ready(function () {
    MasterDataTable.init();
    initComponent();
    clearValidate();
    initInput();
});



function initComponent() {

    $('#btnToggleFilter').click(function () {
        $("#filterDisplay").slideToggle();
    });

    $('#ddlFilterStatus').select2({
        theme: "bootstrap-5",
        closeOnSelect: true,
        minimumResultsForSearch: 10
    });



    loadDenominationLookup(function () {
        $('#ddlFilterDenomination').select2({
            theme: "bootstrap-5",
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });

        $('#ddlDenomination').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#addOrEditItemModal'),
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });
    });

    loadSeriesDenomLookup(function () {
        $('#ddlFilterSeriesDenom').select2({
            theme: "bootstrap-5",
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });

        $('#ddlSeriesDenom').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#addOrEditItemModal'),
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });
    });



}

function initInput() {

    $('#txtM7DenominationCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtM7DenominationCode').removeClass('is-invalid');
            $('#txtM7DenominationCode').addClass('is-valid');
        } else {
            $('#txtM7DenominationCode').removeClass('is-invalid');
            $('#txtM7DenominationCode').removeClass('is-valid');
        }
    });

    $('#txtM7DenominationName').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtM7DenominationName').removeClass('is-invalid');
            $('#txtM7DenominationName').addClass('is-valid');
        } else {
            $('#txtM7DenominationName').removeClass('is-invalid');
            $('#txtM7DenominationName').removeClass('is-valid');
        }
    });

    $('#txtM7DenominationDescrpt').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtM7DenominationDescrpt').removeClass('is-invalid');
            $('#txtM7DenominationDescrpt').addClass('is-valid');
        } else {
            $('#txtM7DenominationDescrpt').removeClass('is-invalid');
            $('#txtM7DenominationDescrpt').removeClass('is-valid');
        }
    });

    $('#txtM7DenominationBms').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtM7DenominationBms').removeClass('is-invalid');
            $('#txtM7DenominationBms').addClass('is-valid');
        } else {
            $('#txtM7DenominationBms').removeClass('is-invalid');
            $('#txtM7DenominationBms').removeClass('is-valid');
        }
    });

    $('#txtM7DnBms').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtM7DnBms').removeClass('is-invalid');
            $('#txtM7DnBms').addClass('is-valid');
        } else {
            $('#txtM7DnBms').removeClass('is-invalid');
            $('#txtM7DnBms').removeClass('is-valid');
        }
    });

    $('#ddlDenomination').on('change', function () {
        var selectedValue = $(this).val();
        if (selectedValue != '') {
            branchId = numeral(selectedValue).value();
            $('#ddlDenomination').removeClass('is-invalid');
            $('#ddlDenomination').addClass('is-valid');
        } else {
            $('#ddlDenomination').removeClass('is-invalid');
            $('#ddlDenomination').removeClass('is-valid');
        }
    });
    $('#ddlSeriesDenom').on('change', function () {
        var selectedValue = $(this).val();
        if (selectedValue != '') {
            branchId = numeral(selectedValue).value();
            $('#ddlSeriesDenom').removeClass('is-invalid');
            $('#ddlSeriesDenom').addClass('is-valid');
        } else {
            $('#ddlSeriesDenom').removeClass('is-invalid');
            $('#ddlSeriesDenom').removeClass('is-valid');
        }
    });

}

function loadDenominationLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterDenomination/GetDenominationList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlDenomination')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $('#ddlFilterDenomination')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlFilterDenomination').append(`<option value="${value.denominationId}">${value.denominationDesc}</option>`);
                    $('#ddlDenomination').append(`<option value="${value.denominationId}">${value.denominationDesc}</option>`);
                });
            }


        }
    });
}


function loadSeriesDenomLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterSeriesDenom/GetAll',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlSeriesDenom')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $('#ddlFilterSeriesDenom')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlFilterSeriesDenom').append(`<option value="${value.seriesDenomId}">${value.seriesCode}</option>`);
                    $('#ddlSeriesDenom').append(`<option value="${value.seriesDenomId}">${value.seriesCode}</option>`);
                });
            }


        }
    });
}

function clearValidate() {
    $('#txtM7DenominationCode').removeClass('is-invalid');
    $('#txtM7DenominationName').removeClass('is-invalid');
    $('#txtM7DenominationDescrpt').removeClass('is-invalid');
    $('#txtM7DenominationBms').removeClass('is-invalid');
    $('#txtM7DnBms').removeClass('is-invalid');
    $('#ddlDenomination').removeClass('is-invalid');
    $('#ddlSeriesDenom').removeClass('is-invalid');

    $('#txtM7DenominationCode').removeClass('is-valid');
    $('#txtM7DenominationName').removeClass('is-valid');
    $('#txtM7DenominationDescrpt').removeClass('is-valid');
    $('#txtM7DenominationBms').removeClass('is-valid');
    $('#txtM7DnBms').removeClass('is-valid');
    $('#ddlDenomination').removeClass('is-valid');
    $('#ddlSeriesDenom').removeClass('is-valid');
}

function LoadDenominationFilterChange() {
    MasterDataTable.refresh();
}

function LoadStatusFilterChange() {
    MasterDataTable.refresh();
}


function showViewPopup(m7DenomId, m7DenomCode, m7DenomName, m7DenomDescrpt, m7DenomBms, m7DnBms, isActive, denoId, denominationCode, denominationDesc, seriesDenomId, seriesDenomCode, seriesDenomDesc) {
    $('#modeSave').val('view');
    $('#rowItemSelected').val(m7DenomId);
    $('#rowDenominationIdSelected').val(denoId);

    // เติมค่าลงใน input (readonly)
    //$('#txtViewM7DenominationId').val(m7DenomId);
    $('#txtViewM7DenominationCode').val(m7DenomCode);
    $('#txtViewM7DenominationName').val(m7DenomName);
    $('#txtViewM7DenominationDescrpt').val(m7DenomDescrpt);
    $('#txtViewM7DenominationBms').val(m7DenomBms);
    $('#txtViewM7DnBms').val(m7DnBms);
    $('#txtViewDenominationDesc').val(denominationDesc);
    $('#txtViewSeriesDenomDesc').val(seriesDenomCode);



    if (isActive) {
        $('#spanViewStatus')
            .removeClass("badge-inactive")
            .addClass("badge-active")
            .text("Active");
    } else {
        $('#spanViewStatus')
            .removeClass("badge-active")
            .addClass("badge-inactive")
            .text("Inactive");
    }

    // แสดง modal
    $('#ViewItemDetailModal').modal('show');
}

function showCreatePopup() {
    clearValidate();

    $('#txtM7DenominationCode').val('');
    $('#txtM7DenominationName').val('');
    $('#txtM7DenominationDescrpt').val('');
    $('#txtM7DenominationBms').val('');
    $('#txtM7DnBms').val('');
    $('#ddlDenomination').val('').trigger('change');
    $('#ddlSeriesDenom').val('').trigger('change');

    $('#txtM7DenominationCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(m7DenomId, denoId) {

    $('#modeSave').val('edit');
    $('#rowItemSelected').val(m7DenomId);
    $('#rowDenominationIdSelected').val(denoId);

    $.requestAjax({
        service: 'MasterM7Denomination/GetM7DenominationById?id=' + m7DenomId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {



            var data = response.data;

            $('#txtM7DenominationCode').val(data.m7DenomCode).prop('disabled', true);
            $('#txtM7DenominationName').val(data.m7DenomName);
            $('#txtM7DenominationDescrpt').val(data.m7DenomDescrpt);
            $('#txtM7DenominationBms').val(data.m7DenomBms);
            $('#txtM7DnBms').val(data.m7DnBms);

            // Dropdown Denomination
            $('#ddlDenomination').val(data.denoId).trigger('change');
            $('#ddlSeriesDenom').val(data.seriesDenomId).trigger('change');


            if (data.isActive) {
                $('#checkIsActive').prop('checked', true);
                $('#spanStatus')
                    .removeClass("badge-inactive")
                    .addClass("badge-active")
                    .text("Active");
            } else {
                $('#checkIsActive').prop('checked', false);
                $('#spanStatus')
                    .removeClass("badge-active")
                    .addClass("badge-inactive")
                    .text("Inactive");
            }

            // เคลียร์ validation
            clearValidate();

            // แก้ไข title modal และ show
            $('#titleModalLabel').text('แก้ไขข้อมูล');
            $('#addOrEditItemModal').modal('show');

        }
    });
}


$('#btnEditDetail').click(function (e) {

    $('#ViewItemDetailModal').modal('hide');
    showEditPopup(numeral($('#rowItemSelected').val()).value(), numeral($('#rowDenominationIdSelected').val()).value());
});

$('#checkIsActive').change(function () {
    if (this.checked) {
        $('#spanStatus').removeClass("badge-inactive");
        $('#spanStatus').addClass('badge-active');
        $('#spanStatus').text('Active');
    } else {
        $('#spanStatus').removeClass("badge-active");
        $('#spanStatus').addClass('badge-inactive');
        $('#spanStatus').text('Inactive');
    }
});

$('#btnSave').click(function (e) {
    if (validateSave()) {
        $('#confirmSaveModal').modal('show');
        $('#addOrEditItemModal').modal('hide');
    }
});

$('#btnConfirmClose').click(function (e) {
    $('#confirmSaveModal').modal('hide');
    $('#addOrEditItemModal').modal('show');
});

$('#btnConfirmSave').click(function (e) {
    $('#confirmSaveModal').modal('hide');

    if ($('#modeSave').val() == "add") {
        createM7Denomination();
    } else {
        editM7Denomination();
    }
});

function createM7Denomination() {

    var requestData = new Object();
    requestData.denoId = numeral($('#ddlDenomination').val()).value();
    requestData.m7DenomCode = $('#txtM7DenominationCode').val();
    requestData.m7DenomName = $('#txtM7DenominationName').val();
    requestData.m7DenomDescrpt = $('#txtM7DenominationDescrpt').val();
    requestData.m7DenomBms = $('#txtM7DenominationBms').val();
    requestData.m7DnBms = $('#txtM7DnBms').val();
    requestData.seriesDenomId = numeral($('#ddlSeriesDenom').val()).value();
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterM7Denomination/CreateM7Denomination',
        type: 'POST',
        parameter: requestData,
        enableLoader: true,
        onSuccess: function (response) {
            MasterDataTable.refresh();
        },
        onError: function (response) {
            $('#addOrEditItemModal').modal('show');
        }
    });
}

function editM7Denomination() {
    var requestData = new Object();
    requestData.m7DenomId = numeral($('#rowItemSelected').val()).value();
    requestData.denoId = numeral($('#ddlDenomination').val()).value();
    requestData.m7DenomCode = $('#txtM7DenominationCode').val();
    requestData.m7DenomName = $('#txtM7DenominationName').val();
    requestData.m7DenomDescrpt = $('#txtM7DenominationDescrpt').val();
    requestData.m7DenomBms = $('#txtM7DenominationBms').val();
    requestData.m7DnBms = $('#txtM7DnBms').val();
    requestData.seriesDenomId = numeral($('#ddlSeriesDenom').val()).value();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    console.log(JSON.stringify(requestData));
    $.requestAjax({
        service: 'MasterM7Denomination/UpdateM7Denomination',
        type: 'POST',
        parameter: requestData,
        enableLoader: true,
        onSuccess: function (response) {
            MasterDataTable.refresh(false);
        },
        onError: function (response) {
            $('#addOrEditItemModal').modal('show');
        }
    });
}

function validateSave() {
    var isValid = true;
    var invalidCount = 0;
    clearValidate();

    if ($('#txtM7DenominationCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtM7DenominationCode').addClass('is-invalid');
    }

    if ($('#txtM7DenominationName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtM7DenominationName').addClass('is-invalid');
    }

    if ($('#txtM7DenominationDescrpt').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtM7DenominationDescrpt').addClass('is-invalid');
    }

    if ($('#txtM7DenominationBms').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtM7DenominationBms').addClass('is-invalid');
    }

    if ($('#txtM7DnBms').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtM7DnBms').addClass('is-invalid');
    }

    if ($('#ddlDenomination').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlDenomination').addClass('is-invalid');
    }
    if ($('#ddlSeriesDenom').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlSeriesDenom').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}
function LoadSeriesDenomFilterChange() {
    MasterDataTable.refresh();
}
