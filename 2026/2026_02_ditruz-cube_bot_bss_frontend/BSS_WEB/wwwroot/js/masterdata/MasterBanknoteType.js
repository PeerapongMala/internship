//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterBanknoteType/SearchBanknoteType',
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
            data: 'banknoteTypeCode',
            title: 'รหัส',
            className: 'text-start',
            width: '250px'
        },
        {
            data: 'bssBanknoteTypeCode',
            title: 'รหัส BSS',
            className: 'text-start',
            width: '250px'
        },
        /*
        {
            data: 'banknoteTypeName',
            title: 'ชื่อประเภทธนบัตร',
            className: 'text-start',
            width: '250px'
        },
        */
        {
            data: 'banknoteTypeDesc',
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
                      <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.banknoteTypeId}"
                                    onclick="showViewPopup(${value.banknoteTypeId},
                                                            '${value.banknoteTypeName}',
                                                             '${value.banknoteTypeCode}',
                                                              '${value.bssBanknoteTypeCode}',
                                                             '${value.banknoteTypeDesc}',
                                                            ${value.isActive},
                                                           );"
                                    data-toggle="tooltip" title="ดูข้อมูล" >
                                    <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.banknoteTypeId}"
                                    onclick="showEditPopup(${value.banknoteTypeId});"
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
    $('#txtBanknoteTypeName').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtBanknoteTypeName').removeClass('is-invalid');
            $('#txtBanknoteTypeName').addClass('is-valid');
        } else {
            $('#txtBanknoteTypeName').removeClass('is-invalid');
            $('#txtBanknoteTypeName').removeClass('is-valid');
        }
    });
    
    $('#txtBanknoteTypeCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtBanknoteTypeCode').removeClass('is-invalid');
            $('#txtBanknoteTypeCode').addClass('is-valid');
        } else {
            $('#txtBanknoteTypeCode').removeClass('is-invalid');
            $('#txtBanknoteTypeCode').removeClass('is-valid');
        }
    });
    $('#txtBssBanknoteTypeCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtBssBanknoteTypeCode').removeClass('is-invalid');
            $('#txtBssBanknoteTypeCode').addClass('is-valid');
        } else {
            $('#txtBssBanknoteTypeCode').removeClass('is-invalid');
            $('#txtBssBanknoteTypeCode').removeClass('is-valid');
        }
    });
}
function LoadStatusFilterChange() {
    MasterDataTable.refresh();
}

function clearValidate() {
    $("#txtBanknoteTypeName").removeClass("is-invalid");
    $('#txtBanknoteTypeCode').removeClass('is-invalid');
    $('#txtBssBanknoteTypeCode').removeClass('is-invalid');
}
 

function showViewPopup(banknoteTypeId, banknoteTypeName, banknoteTypeCode, bssBanknoteTypeCode, banknoteTypeDesc, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(banknoteTypeId);

    //$('#txtViewBanknoteTypeId').val(banknoteTypeId);
    $('#txtViewBanknoteTypeName').val(banknoteTypeName);
    $('#txtViewBanknoteTypeCode').val(banknoteTypeCode);
    $('#txtViewBssBanknoteTypeCode').val(bssBanknoteTypeCode);
    $('#txtViewBanknoteTypeDescription').val(banknoteTypeDesc);

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

    $('#txtBanknoteTypeName').val('');
    $('#txtBanknoteTypeCode').val('');
    $('#txtBssBanknoteTypeCode').val('');
    $('#txtBanknoteTypeDescription').val('');


    $('#txtBanknoteTypeName').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('In Active');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(banknoteTypeId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(banknoteTypeId);

    $.requestAjax({
        service: 'MasterBanknoteType/GetBanknoteTypeById?id=' + banknoteTypeId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

             

                $('#txtBanknoteTypeName').val(response.data.banknoteTypeName);
                $('#txtBanknoteTypeCode').val(response.data.banknoteTypeCode);
                $('#txtBssBanknoteTypeCode').val(response.data.bssBanknoteTypeCode);
                $('#txtBanknoteTypeDescription').val(response.data.banknoteTypeDesc);
               

                $('#txtBanknoteTypeName').prop('disabled', true);

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
        createBanknoteType();
    } else {
        editBanknoteType();
    }
});

function validateSave() {
    var isValid = true;
    var invalidCount = 0;

    clearValidate();

    if ($('#txtBanknoteTypeName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtBanknoteTypeName').addClass('is-invalid');
    }
    if ($('#txtBanknoteTypeCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtBanknoteTypeCode').addClass('is-invalid');
    }
    if ($('#txtBssBanknoteTypeCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtBssBanknoteTypeCode').addClass('is-invalid');
    }

    if ($('#txtBanknoteTypeDescription').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtBanknoteTypeDescription').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}

function createBanknoteType() { 
    var requestData = new Object();
    requestData.banknoteTypeId = 0;
    requestData.banknoteTypeCode = $('#txtBanknoteTypeCode').val();
    requestData.bssBanknoteTypeCode = $('#txtBssBanknoteTypeCode').val();
    requestData.banknoteTypeName = $('#txtBanknoteTypeName').val();
    requestData.banknoteTypeDesc = $('#txtBanknoteTypeDescription').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterBanknoteType/CreateBanknoteType',
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

function editBanknoteType() {
    

    var requestData = new Object();
    requestData.banknoteTypeId = numeral($('#rowItemSelected').val()).value();
    requestData.banknoteTypeCode = $('#txtBanknoteTypeCode').val();
    requestData.bssBanknoteTypeCode = $('#txtBssBanknoteTypeCode').val();
    requestData.banknoteTypeName = $('#txtBanknoteTypeName').val();
    requestData.banknoteTypeDesc = $('#txtBanknoteTypeDescription').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterBanknoteType/UpdateBanknoteType',
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