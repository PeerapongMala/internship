//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterCashPoint/SearchCashPoint',
    height: '100%',
    buildFilter: function () {
        var isActiveVal = $('#ddlFilterStatus').val();
        let isActive = null;
        if (isActiveVal === "1") {
            isActive = true;
        } else if (isActiveVal === "0") {
            isActive = false;
        }
        var selDept = $('#ddlFilterDepartment').val();
        var selInst = $('#ddlFilterInstitution').val();
        return {
            departmentId: selDept ? parseInt(selDept, 10) : null,
            institutionId: selInst ? parseInt(selInst, 10) : null,
            isActive: isActive
        };
    },
    columns: [        
        
        {
            data: 'cashpointName',
            title: 'ชื่อศูนย์เงินสด',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'institutionNameTh',
            title: 'ชื่อธนาคาร',
            className: 'text-start' 
        },
        {
            data: 'departmentName',
            title: 'ชื่อหน่วยงาน',
            className: 'text-start',
        },
        {
            data: 'cbBcdCode',
            title: 'รหัสสัญญา',
            className: 'text-start',
            width: '150px'
        },   
        {
            data: 'branchCode',
            title: 'รหัสสาขาธนาคาร',
            className: 'text-start',
            width: '150px'
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.cashpointId}"
                            onclick="showViewPopup(${value.cashpointId}, 
                                                    '${value.cashpointName}',
                                                    '${value.branchCode}',
                                                     '${value.cbBcdCode ?? ''}',
                                                    ${value.isActive},
                                                    '${value.departmentName}',
                                                    '${value.institutionNameTh}',
                                                    ${value.departmentId},
                                                    ${value.institutionId});"
                            data-toggle="tooltip" title="ดูข้อมูล" ><i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" data-toggle="tooltip" title="แก้ไขข้อมูล" class="actionBtn btn btn-action" id="btnItemEdit_${value.cashpointId}" 
                            onclick="showEditPopup(${value.cashpointId},${value.departmentId},${value.institutionId});">
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

    loadInstitutionLookup(function () {
        $('#ddlFilterInstitution').select2({
            theme: "bootstrap-5",
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });

        $('#ddlInstitution').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#addOrEditItemModal'),
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });

        loadDepartmentLookup(function () {
            $('#ddlFilterDepartment').select2({
                theme: "bootstrap-5",
                closeOnSelect: true,
                minimumResultsForSearch: 10
            });

            $('#ddlDepartment').select2({
                theme: "bootstrap-5",
                dropdownParent: $('#addOrEditItemModal'),
                closeOnSelect: true,
                minimumResultsForSearch: 10
            });

             
        });
    });
}

function initInput() {

    

    $('#txtCashPointName').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtCashPointName').removeClass('is-invalid');
            $('#txtCashPointName').addClass('is-valid');
        } else {
            $('#txtCashPointName').removeClass('is-invalid');
            $('#txtCashPointName').removeClass('is-valid');
        }
    });

    $('#ddlInstitution').on('change', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            branchId = numeral(selectedValue).value();
            $('#ddlInstitution').removeClass('is-invalid');
            $('#ddlInstitution').addClass('is-valid');
        } else {
            $('#ddlInstitution').removeClass('is-invalid');
            $('#ddlInstitution').removeClass('is-valid');
        }
    });

    $('#ddlDepartment').on('change', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#ddlDepartment').removeClass('is-invalid');
            $('#ddlDepartment').addClass('is-valid');
        } else {
            $('#ddlDepartment').removeClass('is-invalid');
            $('#ddlDepartment').removeClass('is-valid');
        }
    });

    $('#txtBranchCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtBranchCode').removeClass('is-invalid');
            $('#txtBranchCode').addClass('is-valid');
        } else {
            $('#txtBranchCode').removeClass('is-invalid');
            $('#txtBranchCode').removeClass('is-valid');
        }
    });

    $('#txtCbBcdCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtCbBcdCode').removeClass('is-invalid');
            $('#txtCbBcdCode').addClass('is-valid');
        } else {
            $('#txtCbBcdCode').removeClass('is-invalid');
            $('#txtCbBcdCode').removeClass('is-valid');
        }
    });
}

function loadInstitutionLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterInstitution/GetInstitutionList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlInstitution')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $('#ddlFilterInstitution')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlFilterInstitution').append(`<option value="${value.institutionId}">${value.institutionNameTh}</option>`);
                    $('#ddlInstitution').append(`<option value="${value.institutionId}">${value.institutionNameTh}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}

function loadDepartmentLookup(onSuccess) {
    var requestData = new Object();
    requestData.companyFilter = '';
    requestData.statusFilter = '';

    $.requestAjax({
        service: 'MasterDepartment/GetDepartmentList',
        type: 'POST',
        parameter: requestData,
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlFilterDepartment')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $('#ddlDepartment')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlFilterDepartment').append(`<option value="${value.departmentId}">${value.departmentName}</option>`);
                    $('#ddlDepartment').append(`<option value="${value.departmentId}">${value.departmentName}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}

function clearValidate() { 
    $('#txtCashPointName').removeClass('is-invalid');
    $('#ddlInstitution').removeClass('is-invalid');
    $('#txtBranchCode').removeClass('is-invalid');
    $('#txtCbBcdCode').removeClass('is-invalid');
    $('#ddlDepartment').removeClass('is-invalid');
     
    $('#txtCashPointName').removeClass('is-valid');
    $('#ddlInstitution').removeClass('is-valid');
    $('#txtBranchCode').removeClass('is-valid');
    $('#txtCbBcdCode').removeClass('is-valid');
    $('#ddlDepartment').removeClass('is-valid');
}
 


function LoadInstitutionFilterChange() {

    MasterDataTable.refresh();
}

function LoadDepartmentFilterChange() {

    MasterDataTable.refresh();
}

function LoadStatusFilterChange() {

    MasterDataTable.refresh();
}


function DepartmentChange() {
    if ($('#modeSave').val() == "add") {
        GetCbBcdCode();
    }
}

function InstitutionChange() {
    if ($('#modeSave').val() == "add") {
        GetCbBcdCode();
    }
}

function GetCbBcdCode() {
    var departmentId = $('#ddlDepartment').val();
    var institutionId = $('#ddlInstitution').val();
    var url = 'MasterCompanyDepartment/GetCbBcdCodeByDepartmentInstitution?departmentId=' + departmentId + '&institutionId=' + institutionId;
    console.log(url);
    if (departmentId && institutionId) {
        $.requestAjax({
            service: url,
            type: 'GET',
            enableLoader: false,
            onSuccess: function (response) {
                console.log(JSON.stringify(response));
                var cbBcdCode = '';
                if (response.is_success == true && response.data != null) {
                    cbBcdCode = response.data;
                }
                $('#txtCbBcdCode').val(cbBcdCode);
            }
        });
    } else {
        $('#txtCbBcdCode').val('');
    }
}

function showViewPopup(cashpointId,  cashpointName, branchCode,cbBcdCode, isActive, departmentName, institutionName, departmentId, institutionId) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(cashpointId);

    $('#rowDepartmentIdSelected').val(departmentId);
    $('#rowInstitutionIdSelected').val(institutionId);

    $('#txtViewCashPointId').val(cashpointId);
    $('#txtViewCashPointName').val(cashpointName);
    $('#txtViewBankName').val(institutionName);
    $('#txtViewDepartmentName').val(departmentName);
    $('#txtViewBranchCode').val(branchCode);
    $('#txtViewCbBcdCode').val(cbBcdCode);

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

 
    $('#txtCashPointName').val('');
    $('#ddlInstitution').val('').trigger('change');
    $('#ddlDepartment').val('').trigger('change');
    $('#txtBranchCode').val('');
    $('#txtCbBcdCode').val('');

   

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(cashpointId, departmentId, institutionId) {

    $('#modeSave').val('edit');
    $('#rowItemSelected').val(cashpointId);
    $('#rowDepartmentIdSelected').val(departmentId);
    $('#rowInstitutionIdSelected').val(institutionId);

    $.requestAjax({
        service: 'MasterCashPoint/GetCashPointById?id=' + cashpointId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {
            console.log(JSON.stringify(response));
             

               
                $('#txtCashPointName').val(response.data.cashpointName);
                $('#ddlInstitution').val(response.data.institutionId).trigger('change');
                $('#ddlDepartment').val(response.data.departmentId).trigger('change');
                $('#txtBranchCode').val(response.data.branchCode);
                $('#txtCbBcdCode').val(response.data.cbBcdCode);

              

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
    showEditPopup(numeral($('#rowItemSelected').val()).value(), numeral($('#rowDepartmentIdSelected').val()).value(), numeral($('#rowInstitutionIdSelected').val()).value());
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
        createCashPoint();
    } else {
        editCashPoint();
    }
});

function createCashPoint() {

   
    var requestData = new Object();
    requestData.cashpointId = 0;
    requestData.institutionId = numeral($('#ddlInstitution').val()).value();
    requestData.branchCode = $('#txtBranchCode').val();
    requestData.cbBcdCode = $('#txtCbBcdCode').val();
    requestData.departmentId = numeral($('#ddlDepartment').val()).value(); 
    requestData.cashpointName = $('#txtCashPointName').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterCashPoint/CreateCashPoint',
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

function editCashPoint() {
     
    var requestData = new Object();
    requestData.cashpointId = numeral($('#rowItemSelected').val()).value();
    requestData.institutionId = numeral($('#ddlInstitution').val()).value();
    requestData.branchCode = $('#txtBranchCode').val();
    requestData.cbBcdCode = $('#txtCbBcdCode').val();
    requestData.departmentId = numeral($('#ddlDepartment').val()).value(); 
    requestData.cashpointName = $('#txtCashPointName').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterCashPoint/UpdateCashPoint',
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

   

    if ($('#txtCashPointName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtCashPointName').addClass('is-invalid');
    }

    if ($('#ddlInstitution').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlInstitution').addClass('is-invalid');
    }

    if ($('#txtBranchCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtBranchCode').addClass('is-invalid');
    }
    if ($('#txtCbBcdCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtCbBcdCode').addClass('is-invalid');
    }

    if ($('#ddlDepartment').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlDepartment').addClass('is-invalid');
    }


    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}