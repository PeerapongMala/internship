//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterCashType/SearchCashType',
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
            data: 'cashTypeCode',
            title: 'รหัสประเภทธนบัตร',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'cashTypeName',
            title: 'ชื่อประเภทธนบัตร',
            className: 'text-start',
        },
        {
            data: 'cashTypeDesc',
            title: 'คำอธิบายประเภทธนบัตร',
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.cashTypeId}"
                    onclick="showViewPopup(${value.cashTypeId},
                                            '${value.cashTypeCode}',
                                            '${value.cashTypeName}',
                                            ${value.isActive},
                                            '${value.cashTypeDesc}');"
                    data-toggle="tooltip" title="ดูข้อมูล" >
                    <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.cashTypeId}" 
                        onclick="showEditPopup(${value.cashTypeId});" 
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

function LoadStatusFilterChange() {
    MasterDataTable.refresh();
}
function initComponent() {
    $('#ddlFilterStatus').select2({
        theme: "bootstrap-5",
        closeOnSelect: true,
        minimumResultsForSearch: 10
    });
    $('#btnToggleFilter').click(function () {
        $("#filterDisplay").slideToggle();
    });  
}

function initInput() {
    $('#txtCashTypeCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtCashTypeCode').removeClass('is-invalid');
            $('#txtCashTypeCode').addClass('is-valid');
        } else {
            $('#txtCashTypeCode').removeClass('is-invalid');
            $('#txtCashTypeCode').removeClass('is-valid');
        }
    });

    $('#txtCashTypeName').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtCashTypeName').removeClass('is-invalid');
            $('#txtCashTypeName').addClass('is-valid');
        } else {
            $('#txtCashTypeName').removeClass('is-invalid');
            $('#txtCashTypeName').removeClass('is-valid');
        }
    });
}

function clearValidate() {
    $("#txtCashTypeCode").removeClass("is-invalid");
    $("#txtCashTypeName").removeClass("is-invalid");

    $('#txtCashTypeCode').removeClass('is-valid');
    $('#txtCashTypeName').removeClass('is-valid');
}

function setInitializationDatatable() {
    $('#dtCashTypeLists').DataTable({
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
    $('#dtCashTypeLists').on('mouseenter', '.actionBtn', function () {
        $(this).tooltip({
            title: $(this).data('tooltip-content'), // Get content from data attribute
            placement: 'top' // Position the tooltip
        }).tooltip('show');
    });

    $('#dtCashTypeLists').on('mouseleave', '.actionBtn', function () {
        $(this).tooltip('hide');
    });
}
 

function showViewPopup(cashTypeId, cashTypeCode, cashTypeName, isActive, cashTypeDesc) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(cashTypeId);

    $('#txtViewCashTypeId').val(cashTypeId);
    $('#txtViewCashTypeCode').val(cashTypeCode);
    $('#txtViewCashTypeName').val(cashTypeName);
    $('#txtViewCashTypeDescription').val(cashTypeDesc);

    if (isActive) {
        $('#spanViewStatus').removeClass("badge-inactive");
        $('#spanViewStatus').addClass('badge-active');
        $('#spanViewStatus').text('Active');

    } else {
        $('#spanViewStatus').removeClass("badge-active");
        $('#spanViewStatus').addClass('badge-inactive');
        $('#spanViewStatus').text('In Active');
    }

    $('#ViewItemDetailModal').modal('show');
}

function showCreatePopup() {
    clearValidate();

    $('#txtCashTypeCode').val('');
    $('#txtCashTypeName').val('');
    $('#txtCashTypeDescription').val('');

    $('#txtCashTypeCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('In Active');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(cashTypeId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(cashTypeId);

    $.requestAjax({
        service: 'MasterCashType/GetCashTypeById?id=' + cashTypeId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

             

                $('#txtCashTypeCode').val(response.data.cashTypeCode);
                $('#txtCashTypeName').val(response.data.cashTypeName);
                $('#txtCashTypeDescription').val(response.data.cashTypeDesc);

                $('#txtCashTypeCode').prop('disabled', true);

                if (response.data.isActive) {
                    $('#checkIsActive').prop('checked', true);
                    $('#spanStatus').removeClass("badge-inactive");
                    $('#spanStatus').addClass('badge-active');
                    $('#spanStatus').text('Active');

                } else {
                    $('#checkIsActive').prop('checked', false);
                    $('#spanStatus').removeClass("badge-active");
                    $('#spanStatus').addClass('badge-inactive');
                    $('#spanStatus').text('In Active');
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
        $('#spanStatus').text('In Active');
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
        createCashType();
    } else {
        editCashType();
    }
});



function validateSave() {
    var isValid = true;
    var invalidCount = 0;

    clearValidate();

    if ($('#txtCashTypeCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtCashTypeCode').addClass('is-invalid');
    }

    if ($('#txtCashTypeName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtCashTypeName').addClass('is-invalid');
    }

    if ($('#txtCashTypeDescription').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtCashTypeDescription').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}

function createCashType() { 
    var requestData = new Object();
    requestData.cashTypeId = 0;
    requestData.cashTypeCode = $('#txtCashTypeCode').val();
    requestData.cashTypeName = $('#txtCashTypeName').val();
    requestData.cashTypeDesc = $('#txtCashTypeDescription').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterCashType/CreateCashType',
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

function editCashType() {
     

    var requestData = new Object();
    requestData.cashTypeId = numeral($('#rowItemSelected').val()).value();
    requestData.cashTypeCode = $('#txtCashTypeCode').val();
    requestData.cashTypeName = $('#txtCashTypeName').val();
    requestData.cashTypeDesc = $('#txtCashTypeDescription').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterCashType/UpdateCashType',
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