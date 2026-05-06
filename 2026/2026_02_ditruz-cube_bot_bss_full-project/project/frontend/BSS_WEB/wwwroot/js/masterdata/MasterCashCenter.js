//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterCashCenter/SearchCashCenter',
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
            data: 'cashCenterCode',
            title: 'รหัสศูนย์เงินสด',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'cashCenterName',
            title: 'ชื่อศูนย์เงินสด',
            className: 'text-start',
        },        
        {
            data: 'departmentName',
            title: 'ชื่อหน่วยงาน',
            className: 'text-start',
        },
        {
            data: 'institutionNameTh',
            title: 'ชื่อธนาคาร',
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.cashCenterId}"
                                onclick="showViewPopup(${value.cashCenterId}, 
                                                    '${value.cashCenterCode}', 
                                                    '${value.cashCenterName}', 
                                                    ${value.isActive}, 
                                                    '${value.departmentName}', 
                                                    '${value.institutionNameTh}',
                                                    ${value.departmentId},
                                                    ${value.institutionId});"
                                data-toggle="tooltip" title="ดูข้อมูล" >
                                <i class="bi bi-eye" fill="currentColor"></i>
                        </button>
                    <button type="button" data-toggle="tooltip" title="แก้ไขข้อมูล" class="actionBtn btn btn-action" id="btnItemEdit_${value.cashCenterId}" 
                        onclick="showEditPopup(${value.cashCenterId},${value.departmentId},${value.institutionId});">
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
    $("#filterDisplay").hide();
    initComponent();
    clearValidate();
    initInput();
});

$('#btnToggleFilter').click(function () {
    $("#filterDisplay").slideToggle();
});

function initComponent() {

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

function clearValidate() {
    $('#txtCashCenterCode').removeClass('is-invalid');
    $('#txtCashCenterName').removeClass('is-invalid');
    $('#ddlInstitution').removeClass('is-invalid');
    $('#ddlDepartment').removeClass('is-invalid');

    $('#txtCashCenterCode').removeClass('is-valid');
    $('#txtCashCenterName').removeClass('is-valid');
    $('#ddlInstitution').removeClass('is-valid');
    $('#ddlDepartment').removeClass('is-valid');
}

function initInput() {

    $('#txtCashCenterCode').on('input', function () {
        $('#txtCashCenterCode').removeClass('is-invalid');
        $('#txtCashCenterCode').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtCashCenterCode').addClass('is-valid');
        }
    });

    $('#txtCashCenterName').on('input', function () {
        $('#txtCashCenterName').removeClass('is-invalid');
        $('#txtCashCenterName').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtCashCenterName').addClass('is-valid');
        }
    });

    $('#ddlInstitution').on('change', function () {
        $('#ddlInstitution').removeClass('is-invalid');
        $('#ddlInstitution').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#ddlInstitution').addClass('is-valid');
        }
    });

    $('#ddlDepartment').on('change', function () {
        $('#ddlDepartment').removeClass('is-invalid');
        $('#ddlDepartment').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#ddlDepartment').addClass('is-valid');
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

function setInitializationDatatable() {
     
    /*

    // Initialize tooltips for buttons within the datatable
    $('#dtCashCenter').on('mouseenter', '.actionBtn', function () {
        $(this).tooltip({
            title: $(this).data('tooltip-content'), // Get content from data attribute
            placement: 'top' // Position the tooltip
        }).tooltip('show');
    });

    $('#dtCashCenter').on('mouseleave', '.actionBtn', function () {
        $(this).tooltip('hide');
    });
    */
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

function showViewPopup(cashCenterId, cashCenterCode, cashCenterName, isActive, departmentName, bankName, departmentId, institutionId) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(cashCenterId);

    $('#rowDepartmentIdSelected').val(departmentId);
    $('#rowInstitutionIdSelected').val(institutionId);

    $('#txtViewCashCenterId').val(cashCenterId);
    $('#txtViewCashCenterCode').val(cashCenterCode);
    $('#txtViewCashCenterName').val(cashCenterName);
    $('#txtViewBankName').val(bankName);
    $('#txtViewDepartmentName').val(departmentName);

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

    $('#txtCashCenterCode').val('');
    $('#txtCashCenterName').val('');
    $('#ddlInstitution').val('').trigger('change');
    $('#ddlDepartment').val('').trigger('change');

    $('#txtCashCenterCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(cashCenterId, departmentId, institutionId) {

    $('#modeSave').val('edit');
    $('#rowItemSelected').val(cashCenterId);
    $('#rowDepartmentIdSelected').val(departmentId);
    $('#rowInstitutionIdSelected').val(institutionId);

    $.requestAjax({
        service: 'MasterCashCenter/GetCashCenterById?id=' + cashCenterId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

           

                $('#txtCashCenterCode').val(response.data.cashCenterCode);
                $('#txtCashCenterName').val(response.data.cashCenterName);
                $('#ddlInstitution').val(response.data.institutionId).trigger('change');
                $('#ddlDepartment').val(response.data.departmentId).trigger('change');

                $('#txtCashCenterCode').prop('disabled', true);

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
        createCashCenter();
    } else {
        editCashCenter();
    }
});


function createCashCenter() {

   
    var requestData = new Object();
    requestData.cashCenterId = 0;
    requestData.institutionId = numeral($('#ddlInstitution').val()).value();
    requestData.departmentId = numeral($('#ddlDepartment').val()).value();
    requestData.cashCenterCode = $('#txtCashCenterCode').val();
    requestData.cashCenterName = $('#txtCashCenterName').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterCashCenter/CreateCashCenter',
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


function editCashCenter() {

     
    var requestData = new Object();
    requestData.cashCenterId = numeral($('#rowItemSelected').val()).value();
    requestData.institutionId = numeral($('#ddlInstitution').val()).value();
    requestData.departmentId = numeral($('#ddlDepartment').val()).value();
    requestData.cashCenterCode = $('#txtCashCenterCode').val();
    requestData.cashCenterName = $('#txtCashCenterName').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterCashCenter/UpdateCashCenter',
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

    if ($('#txtCashCenterCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtCashCenterCode').addClass('is-invalid');
    }

    if ($('#txtCashCenterName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtCashCenterName').addClass('is-invalid');
    }

    if ($('#ddlInstitution').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlInstitution').addClass('is-invalid');
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