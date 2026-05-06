//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterBanknoteTypeSend/SearchBanknoteTypeSend',
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
            data: 'banknoteTypeSendCode',
            title: 'รหัสประเภทธนบัตรที่ส่งไประบบ CBMS',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'bssBntypeCode',
            title: 'รหัส BSS',
            className: 'text-start',
            width: '200px'
        },
        
        {
            data: 'banknoteTypeSendDesc',
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.banknoteTypeSendId}"
                                onclick="showViewPopup(${value.banknoteTypeSendId},
                                                    '${value.banknoteTypeSendCode}',
                                                    '${value.bssBntypeCode}',
                                                    ${value.isActive},
                                                    '${value.banknoteTypeSendDesc}');"
                                data-toggle="tooltip" title="ดูข้อมูล" >
                            <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.banknoteTypeSendId}"
                                onclick="showEditPopup(${value.banknoteTypeSendId});"
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
    $('#txtBanknoteTypeSendCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtBanknoteTypeSendCode').removeClass('is-invalid');
            $('#txtBanknoteTypeSendCode').addClass('is-valid');
        } else {
            $('#txtBanknoteTypeSendCode').removeClass('is-invalid');
            $('#txtBanknoteTypeSendCode').removeClass('is-valid');
        }
    });
    $('#txtBssBntypeCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtBssBntypeCode').removeClass('is-invalid');
            $('#txtBssBntypeCode').addClass('is-valid');
        } else {
            $('#txtBssBntypeCode').removeClass('is-invalid');
            $('#txtBssBntypeCode').removeClass('is-valid');
        }
    });
}
function LoadStatusFilterChange() {
    MasterDataTable.refresh();
}
function clearValidate() {
    $("#txtBanknoteTypeSendCode").removeClass("is-invalid");
    $('#txtBanknoteTypeSendCode').removeClass('is-valid');
    $("#txtBssBntypeCode").removeClass("is-invalid");
    $('#txtBssBntypeCode').removeClass('is-valid');
    
}
 
 

function showViewPopup(banknoteTypeSendId, banknoteTypeSendCode, bssBntypeCode, isActive, banknoteTypeSendDesc) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(banknoteTypeSendId);

    //$('#txtViewBanknoteTypeSendId').val(banknoteTypeSendId);
    $('#txtViewBanknoteTypeSendCode').val(banknoteTypeSendCode);
    $('#txtViewBssBntypeCode').val(bssBntypeCode);    
    $('#txtViewBanknoteTypeSendDescription').val(banknoteTypeSendDesc);

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

    $('#txtBanknoteTypeSendCode').val('');
    $('#txtBssBntypeCode').val('');
    
    $('#txtBanknoteTypeSendDescription').val('');
    $('#txtBssBntypeCode').val(''); 
    $('#txtBanknoteTypeSendCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(banknoteTypeSendId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(banknoteTypeSendId);

    $.requestAjax({
        service: 'MasterBanknoteTypeSend/GetBanknoteTypeSendById?id=' + banknoteTypeSendId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

             

                $('#txtBanknoteTypeSendCode').val(response.data.banknoteTypeSendCode);
                $('#txtBssBntypeCode').val(response.data.bssBntypeCode);
                $('#txtBanknoteTypeSendDescription').val(response.data.banknoteTypeSendDesc);                
                $('#txtBanknoteTypeSendCode').prop('disabled', true);

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
        createBanknoteTypeSend();
    } else {
        editBanknoteTypeSend();
    }
});

function validateSave() {
    var isValid = true;
    var invalidCount = 0;

    clearValidate();

    if ($('#txtBanknoteTypeSendCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtBanknoteTypeSendCode').addClass('is-invalid');
    }
    if ($('#txtBssBntypeCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtBssBntypeCode').addClass('is-invalid');
    }
    
    if ($('#txtBanknoteTypeSendDescription').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtBanknoteTypeSendDescription').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}

function createBanknoteTypeSend() {
     
    var requestData = new Object(); 
    requestData.banknoteTypeSendCode = $('#txtBanknoteTypeSendCode').val();
    requestData.bssBntypeCode = $('#txtBssBntypeCode').val(); 
    requestData.banknoteTypeSendDesc = $('#txtBanknoteTypeSendDescription').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterBanknoteTypeSend/CreateBanknoteTypeSend',
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

function editBanknoteTypeSend() {
    

    var requestData = new Object();
    requestData.banknoteTypeSendId = numeral($('#rowItemSelected').val()).value();
    requestData.banknoteTypeSendCode = $('#txtBanknoteTypeSendCode').val();
    requestData.bssBntypeCode = $('#txtBssBntypeCode').val(); 
    requestData.banknoteTypeSendDesc = $('#txtBanknoteTypeSendDescription').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterBanknoteTypeSend/UpdateBanknoteTypeSend',
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