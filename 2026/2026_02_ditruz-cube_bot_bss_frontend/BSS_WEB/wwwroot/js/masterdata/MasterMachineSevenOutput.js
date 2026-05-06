//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterMachineSevenOutput/SearchMachineSevenOutput',
    height: '100%',
    buildFilter: function () {
        var isActiveVal = $('#ddlFilterStatus').val();
        let isActive = null;
        if (isActiveVal === "1") {
            isActive = true;
        } else if (isActiveVal === "0") {
            isActive = false;
        }
       
        return { 
            isActive: isActive
        };
    },
    columns: [
 
        {
            data: 'mSevenOutputCode',
            title: 'รหัส M7 Output Data',
            className: 'text-start',
            width: '250px'
        },
        {
            data: 'mSevenOutputDescrpt',
            title: 'คำอธิบายเพิ่มเติม',
            className: 'text-start',
        },
        {
            data: 'isActive',
            title: 'สถานะใช้งาน',
            className: 'text-center',
            orderable: true,
            width: '120px',
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
            width: '120px',
            orderable: false,
            searchable: false,
            className: 'text-center',
            render: function (_, __, value) {
                return `
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.mSevenOutputId}"
                                    onclick="showViewPopup(${value.mSevenOutputId},
                                                        '${value.mSevenOutputCode}',
                                                        '${value.mSevenOutputDescrpt}',
                                        ${value.isActive});"
                    data-toggle="tooltip" title="ดูข้อมูล" >
                    <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.mSevenOutputId}"
                                onclick="showEditPopup(${value.mSevenOutputId});"
                                data-toggle="tooltip" title="แก้ไขข้อมูล">
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
}
function LoadStatusFilterChange() {

    MasterDataTable.refresh();
}

function initInput() {
    $('#txtMachineSevenOutputCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtMachineSevenOutputCode').removeClass('is-invalid');
            $('#txtMachineSevenOutputCode').addClass('is-valid');
        } else {
            $('#txtMachineSevenOutputCode').removeClass('is-invalid');
            $('#txtMachineSevenOutputCode').removeClass('is-valid');
        }
    });

}

function clearValidate() {
    $("#txtMachineSevenOutputCode").removeClass("is-invalid");

    $('#txtMachineSevenOutputCode').removeClass('is-valid');
}

function setInitializationDatatable() {
    $('#dtMachineSevenOutputLists').DataTable({
        responsive: true,
        language: {
            lengthMenu: "แสดง _MENU_ รายการ/หน้า",
            info: "รายการที่ _START_ ถึง _END_ จาก _TOTAL_ รายการ",
            infoEmpty: 'ไม่พบรายการที่มีอยู่',
            infoFiltered: '(ค้นหา จาก _MAX_ ทั้งหมด รายการ)',
            zeroRecords: 'ขออภัย! ข้อมูลไม่พร้อมใช้งาน',
            search: "ค้นหาข้อมูล:"
        }
    });

    // Initialize tooltips for buttons within the datatable
    $('#dtMachineSevenOutputLists').on('mouseenter', '.actionBtn', function () {
        $(this).tooltip({
            title: $(this).data('tooltip-content'), // Get content from data attribute
            placement: 'top' // Position the tooltip
        }).tooltip('show');
    });

    $('#dtMachineSevenOutputLists').on('mouseleave', '.actionBtn', function () {
        $(this).tooltip('hide');
    });
}
 

function showViewPopup(mSevenOutputId, mSevenOutputCode, mSevenOutputDescrpt, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(mSevenOutputId);

    //$('#txtViewMachineSevenOutputId').val(mSevenOutputId);
    $('#txtViewMachineSevenOutputCode').val(mSevenOutputCode);
    $('#txtViewMachineSevenOutputDescription').val(mSevenOutputDescrpt);

    if (isActive) {
        $('#spanViewStatus').removeClass("badge-inactive");
        $('#spanViewStatus').addClass('badge-active');
        $('#spanViewStatus').text('Active');

    } else {
        $('#spanViewStatus').removeClass("badge-active");
        $('#spanViewStatus').addClass('badge-inactive');
        $('#spanViewStatus').text('Inactive');
    }

    $('#ViewItemDetailModal').modal('show');
}

function showCreatePopup() {
    clearValidate();

    $('#txtMachineSevenOutputCode').val('');
    $('#txtMachineSevenOutputDescription').val('');

    $('#txtMachineSevenOutputCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(mSevenOutputId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(mSevenOutputId);

    $.requestAjax({
        service: 'MasterMachineSevenOutput/GetMachineSevenOutputById?id=' + mSevenOutputId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {
             

                $('#txtMachineSevenOutputCode').val(response.data.mSevenOutputCode);
                $('#txtMachineSevenOutputDescription').val(response.data.mSevenOutputDescrpt);

                $('#txtMachineSevenOutputCode').prop('disabled', true);

                if (response.data.isActive) {
                    $('#checkIsActive').prop('checked', true);
                    $('#spanStatus').removeClass("badge-inactive");
                    $('#spanStatus').addClass('badge-active');
                    $('#spanStatus').text('Active');

                } else {
                    $('#checkIsActive').prop('checked', false);
                    $('#spanStatus').removeClass("badge-active");
                    $('#spanStatus').addClass('badge-inactive');
                    $('#spanStatus').text('Inactive');
                }

                clearValidate();
                $('#titleModalLabel').text('แก้ไขข้อมูล');
                $('#addOrEditItemModal').modal('show');
             
        }
    });

}

$('#btnEditDetail').click(function (e) {

    $('#ViewItemDetailModal').modal('hide');
    showEditPopup(numeral($('#rowItemSelected').val()).value());
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
        createMachineSevenOutput();
    } else {
        editMachineSevenOutput();
    }
});



function validateSave() {
    var isValid = true;
    var invalidCount = 0;

    clearValidate();

    if ($('#txtMachineSevenOutputCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtMachineSevenOutputCode').addClass('is-invalid');
    }

    if ($('#txtMachineSevenOutputDescription').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtMachineSevenOutputDescription').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}

function createMachineSevenOutput() { 

    var requestData = new Object(); 
    requestData.mSevenOutputCode = $('#txtMachineSevenOutputCode').val();
    requestData.mSevenOutputDescrpt = $('#txtMachineSevenOutputDescription').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterMachineSevenOutput/CreateMachineSevenOutput',
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

function editMachineSevenOutput() { 

    var requestData = new Object();
    requestData.mSevenOutputId = numeral($('#rowItemSelected').val()).value();
    requestData.mSevenOutputCode = $('#txtMachineSevenOutputCode').val();
    requestData.mSevenOutputDescrpt = $('#txtMachineSevenOutputDescription').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterMachineSevenOutput/UpdateMachineSevenOutput',
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
