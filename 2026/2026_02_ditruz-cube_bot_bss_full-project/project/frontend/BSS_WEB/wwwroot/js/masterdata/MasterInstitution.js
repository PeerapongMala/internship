
//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterInstitution/SearchInstitution',
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
            data: 'institutionCode',
            title: 'รหัสธนาคาร(ตัวเลข)',
            className: 'text-start',
            width: '100px'
        },
        {
            data: 'bankCode',
            title: 'รหัสธนาคาร(ตัวอักษร)',
            className: 'text-start',
            width: '150px'
        },
        {
            data: 'institutionShortName',
            title: 'ชื่อย่อธนาคาร',
            className: 'text-start',
            width: '150px'
        },
        {
            data: 'institutionNameTh',
            title: 'ชื่อธนาคาร(ภาษาไทย)',
            className: 'text-start',
            width: '250px'
        },
        {
            data: 'institutionNameEn',
            title: 'ชื่อธนาคาร(ภาษาอังกฤษ)',
            className: 'text-start', 
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
                     <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.institutionId}"
                            onclick="showViewPopup(${value.institutionId}, 
                                                    '${value.institutionCode}', 
                                                    '${value.bankCode}', 
                                                    ${value.isActive}, 
                                                    '${value.institutionNameTh}',
                                                    '${value.institutionNameEn}');"
                            data-toggle="tooltip" title="ดูข้อมูล" >
                            <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.institutionId}" 
                            onclick="showEditPopup(${value.institutionId});"
                            data-toggle="tooltip" title="แก้ไขข้อมูล" >
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
function LoadStatusFilterChange() {
    MasterDataTable.refresh();
}

function clearValidate() {
    $("#txtInstitutionCode").removeClass("is-invalid");
    $("#txtBankCode").removeClass("is-invalid");
    $("#txtInstitutionNameTH").removeClass("is-invalid");
    $("#txtInstitutionNameEN").removeClass("is-invalid");

    $("#txtInstitutionCode").removeClass("is-valid");
    $("#txtBankCode").removeClass("is-valid");
    $("#txtInstitutionNameTH").removeClass("is-valid");
    $("#txtInstitutionNameEN").removeClass("is-valid");
}

function initInput() {

    $('#txtInstitutionCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtInstitutionCode').removeClass('is-invalid');
            $('#txtInstitutionCode').addClass('is-valid');
        } else {
            $('#txtInstitutionCode').removeClass('is-invalid');
            $('#txtInstitutionCode').removeClass('is-valid');
        }
    });

    $('#txtBankCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtBankCode').removeClass('is-invalid');
            $('#txtBankCode').addClass('is-valid');
        } else {
            $('#txtBankCode').removeClass('is-invalid');
            $('#txtBankCode').removeClass('is-valid');
        }
    });

    $('#txtInstitutionNameTH').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtInstitutionNameTH').removeClass('is-invalid');
            $('#txtInstitutionNameTH').addClass('is-valid');
        } else {
            $('#txtInstitutionNameTH').removeClass('is-invalid');
            $('#txtInstitutionNameTH').removeClass('is-valid');
        }
    });

    $('#txtInstitutionNameEN').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtInstitutionNameEN').removeClass('is-invalid');
            $('#txtInstitutionNameEN').addClass('is-valid');
        } else {
            $('#txtInstitutionNameEN').removeClass('is-invalid');
            $('#txtInstitutionNameEN').removeClass('is-valid');
        }
    });
}
 
 

function showViewPopup(institutionId, institutionCode, bankCode, isActive, institutionNameTh, institutionNameEn) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(institutionId);

    //$('#txtViewInstitutionId').val(institutionId);
    $('#txtViewInstitutionCode').val(institutionCode);
    $('#txtViewBankCode').val(bankCode);
    $('#txtViewInstitutionNameTh').val(institutionNameTh);
    $('#txtViewInstitutionNameEn').val(institutionNameEn);

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
    $('#txtInstitutionCode').val('');
    $('#txtBankCode').val('');
    $('#txtInstitutionNameTH').val('');
    $('#txtInstitutionNameEN').val('');

    $('#txtInstitutionCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(institutionId) {

    $('#modeSave').val('edit');
    $('#rowItemSelected').val(institutionId);

    $.requestAjax({
        service: 'MasterInstitution/GetInstitution?id=' + institutionId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

             

                $('#txtInstitutionCode').val(response.data.institutionCode);
                $('#txtBankCode').val(response.data.bankCode);
                $('#txtShortName').val(response.data.institutionShortName);
                $('#txtInstitutionNameTH').val(response.data.institutionNameTh);
                $('#txtInstitutionNameEN').val(response.data.institutionNameEn);

                $('#txtInstitutionCode').prop('disabled', true);

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
        createInstitutiont();
    } else {
        editInstitutiont();
    }
});

function createInstitutiont() { 

    var requestData = new Object();
    requestData.institutionId = 0;
    requestData.institutionCode = $('#txtInstitutionCode').val();
    requestData.institutionShortName = $('#txtShortName').val();
    requestData.bankCode = $('#txtBankCode').val();
    requestData.institutionNameTh = $('#txtInstitutionNameTH').val();
    requestData.institutionNameEn = $('#txtInstitutionNameEN').val();
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterInstitution/CreateInstitution',
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

function editInstitutiont() { 
    var requestData = new Object();
    requestData.institutionId = numeral($('#rowItemSelected').val()).value();
    requestData.institutionCode = $('#txtInstitutionCode').val();
    requestData.institutionShortName = $('#txtShortName').val();
    requestData.bankCode = $('#txtBankCode').val();
    requestData.institutionNameTh = $('#txtInstitutionNameTH').val();
    requestData.institutionNameEn = $('#txtInstitutionNameEN').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterInstitution/UpdateInstitution',
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

    if ($('#txtInstitutionCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtInstitutionCode').addClass('is-invalid');
    }

    if ($('#txtBankCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtBankCode').addClass('is-invalid');
    }

    if ($('#txtInstitutionNameTH').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtInstitutionNameTH').addClass('is-invalid');
    }

    if ($('#txtInstitutionNameEN').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtInstitutionNameEN').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}