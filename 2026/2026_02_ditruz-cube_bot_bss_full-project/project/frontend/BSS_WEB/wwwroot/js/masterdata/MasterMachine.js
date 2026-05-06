//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterMachine/SearchMachine',
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
        var selMachineType = $('#ddlFilterMachineType').val();
        return {
            departmentId: selDept ? parseInt(selDept, 10) : null,
            machineTypeId: selMachineType ? parseInt(selMachineType, 10) : null,
            isActive: isActive
        };
    },
    columns: [
       
        {
            data: 'machineCode',
            title: 'รหัสเครื่องจักร',
            className: 'text-start',
            width: '100px'
        },
        {
            data: 'machineName',
            title: 'ชื่อเครื่องจักร',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'departmentName',
            title: 'ชื่อหน่วยงาน',
            className: 'text-start',
            width: '250px'
        },
        {
            data: 'machineTypeName',
            title: 'ชื่อประเภทเครื่องจักร',
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.machineId}"
                                    onclick="showViewPopup(${value.machineId},
                                                        '${value.departmentId}',
                                                        '${value.machineTypeId}',
                                                        '${value.departmentName}',
                                                        '${value.machineTypeName}',
                                                        '${value.machineCode}',
                                                        '${value.machineName}',
                                                        '${value.hcLength}',                                                       
                                                        '${value.pathnameBss ?? ""}',
                                                        '${value.pathnameCompleted ?? ""}',
                                                        '${value.pathnameError ?? ""}',
                                                        ${value.isEmergency},
                                                        ${value.isActive});"
                                    data-toggle="tooltip" title="ดูข้อมูล" >
                                    <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" data-toggle="tooltip" title="แก้ไขข้อมูล" class="actionBtn btn btn-action" id="btnItemEdit_${value.cashpointId}"
                                            onclick="showEditPopup(${value.machineId},${value.departmentId},${value.machineTypeId});">
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
$('#btnToggleFilter').click(function () {
    $("#filterDisplay").slideToggle();
});

function initComponent() {
     

    $('#ddlFilterStatus').select2({
        theme: "bootstrap-5",
        closeOnSelect: true
    });

    loadMachineTypeLookup(function () {
        $('#ddlFilterMachineType').select2({
            theme: "bootstrap-5",
            closeOnSelect: true
        });

        $('#ddlMachineType').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#addOrEditItemModal'),
            closeOnSelect: true
        });

        loadDepartmentLookup(function () {
            $('#ddlFilterDepartment').select2({
                theme: "bootstrap-5",
                closeOnSelect: true
            });

            $('#ddlDepartment').select2({
                theme: "bootstrap-5",
                dropdownParent: $('#addOrEditItemModal'),
                closeOnSelect: true
            });

             
        });
    });
}

function LoadStatusFilterChange() {
    MasterDataTable.refresh();
}
function LoadMachineTypeFilterChange() {

    MasterDataTable.refresh();
}

function LoadDepartmentFilterChange() {

    MasterDataTable.refresh();
}

function initInput() {
    $('#txtMachineCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtMachineCode').removeClass('is-invalid');
            $('#txtMachineCode').addClass('is-valid');
        } else {
            $('#txtMachineCode').removeClass('is-invalid');
            $('#txtMachineCode').removeClass('is-valid');
        }
    });

    $('#txtMachineName').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtMachineName').removeClass('is-invalid');
            $('#txtMachineName').addClass('is-valid');
        } else {
            $('#txtMachineName').removeClass('is-invalid');
            $('#txtMachineName').removeClass('is-valid');
        }
    });

    $('#ddlMachineType').on('change', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#ddlMachineType').removeClass('is-invalid');
            $('#ddlMachineType').addClass('is-valid');
        } else {
            $('#ddlMachineType').removeClass('is-invalid');
            $('#ddlMachineType').removeClass('is-valid');
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
}

function loadMachineTypeLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterMachineType/GetMachineTypeList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlMachineType')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $('#ddlFilterMachineType')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlFilterMachineType').append(`<option value="${value.machineTypeId}">${value.machineTypeName}</option>`);
                    $('#ddlMachineType').append(`<option value="${value.machineTypeId}">${value.machineTypeName}</option>`);
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

    $("#ddlDepartment").removeClass("is-invalid");
    $("#ddlMachineType").removeClass("is-invalid");
    $("#txtMachineCode").removeClass("is-invalid");
    $("#txtMachineName").removeClass("is-invalid");

    $('#ddlDepartment').removeClass('is-valid');
    $('#ddlMachineType').removeClass('is-valid');
    $('#txtMachineCode').removeClass('is-valid');
    $('#txtMachineName').removeClass('is-valid');
}

function setInitializationDatatable() {
    $('#dtMachineLists').DataTable({
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
    $('#dtMachineLists').on('mouseenter', '.actionBtn', function () {
        $(this).tooltip({
            title: $(this).data('tooltip-content'), // Get content from data attribute
            placement: 'top' // Position the tooltip
        }).tooltip('show');
    });

    $('#dtMachineLists').on('mouseleave', '.actionBtn', function () {
        $(this).tooltip('hide');
    });
}
 


function showViewPopup(machineId, departmentId, machineTypeId, departmentName, machineTypeName, machineCode, machineName, hcLength, 
    pathnameBss, pathnameCompleted, pathnameError,isEmergency, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(machineId);

    $('#rowDepartmentIdSelected').val(departmentId);
    $('#rowMachineTypeIdIdSelected').val(machineTypeId);

    $('#txtViewMachineId').val(machineId);
    $('#txtViewDepartment').val(departmentName);
    $('#txtViewMachineType').val(machineTypeName);
    $('#txtViewMachineCode').val(machineCode);
    $('#txtViewMachineName').val(machineName);
    $('#txtViewHcLength').val(hcLength);  
    $('#txtViewFilenameBSS').val(pathnameBss);
    $('#txtViewPathnameCompleted').val(pathnameCompleted);
    $('#txtViewPathnameError').val(pathnameError);
    if (isEmergency) {
        $('#spanViewEmergency').removeClass("badge-inactive");
        $('#spanViewEmergency').addClass('badge-active');
        $('#spanViewEmergency').text('Yes');

    } else {
        $('#spanViewEmergency').removeClass("badge-active");
        $('#spanViewEmergency').addClass('badge-inactive');
        $('#spanViewEmergency').text('No');
    }
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

    $('#ddlDepartment').val('').trigger('change');
    $('#ddlMachineType').val('').trigger('change');
    $('#txtMachineCode').val('');
    $('#txtMachineName').val('');
    $('#txtHcLength').val('');  
    $('#txtFilenameBSS').val('');
    $('#txtPathnameCompleted').val('');
    $('#txtPathnameError').val('');

    $('#txtMachineCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');

    $('#checkIsEmergency').prop('checked', false);
    $('#spanEmergency').removeClass("badge-active");
    $('#spanEmergency').addClass('badge-inactive');
    $('#spanEmergency').text('No');

    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');

    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(machineId, departmentId, machineTypeId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(machineId);
    $('#rowDepartmentIdSelected').val(departmentId);
    $('#rowMachineTypeIdIdSelected').val(machineTypeId);

    $.requestAjax({
        service: 'MasterMachine/GetMachineById?id=' + machineId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) { 

                $('#ddlMachineType').val(response.data.machineTypeId).trigger('change');
                $('#ddlDepartment').val(response.data.departmentId).trigger('change');
                $('#txtMachineCode').val(response.data.machineCode).prop('disabled', true);
                $('#txtMachineName').val(response.data.machineName);
                $('#txtHcLength').val(response.data.hcLength);                
                $('#txtFilenameBSS').val(response.data.pathnameBss);
                $('#txtPathnameCompleted').val(response.data.pathnameCompleted);
                $('#txtPathnameError').val(response.data.pathnameError); 
                if (response.data.isEmergency) {
                    $('#checkIsEmergency').prop('checked', true);
                    $('#spanEmergency').removeClass("badge-inactive");
                    $('#spanEmergency').addClass('badge-active');
                    $('#spanEmergency').text('Yes');

                } else {
                    $('#checkIsEmergency').prop('checked', false);
                    $('#spanEmergency').removeClass("badge-active");
                    $('#spanEmergency').addClass('badge-inactive');
                    $('#spanEmergency').text('No');
                }

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
    showEditPopup(numeral($('#rowItemSelected').val()).value(), numeral($('#rowDepartmentIdSelected').val()).value(), numeral($('#rowMachineTypeIdIdSelected').val()).value());
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

$('#checkIsEmergency').change(function () {
    if (this.checked) {
        $('#spanEmergency').removeClass("badge-inactive");
        $('#spanEmergency').addClass('badge-active');
        $('#spanEmergency').text('Yes');
    } else {
        $('#spanEmergency').removeClass("badge-active");
        $('#spanEmergency').addClass('badge-inactive');
        $('#spanEmergency').text('No');
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
        createMachine();
    } else {
        editMachine();
    }
});

function createMachine() { 
    var requestData = new Object(); 
    requestData.departmentId = numeral($('#ddlDepartment').val()).value();
    requestData.machineTypeId = numeral($('#ddlMachineType').val()).value();
    requestData.machineCode = $('#txtMachineCode').val();
    requestData.machineName = $('#txtMachineName').val();
    requestData.hcLength = $('#txtHcLength').val();    
    requestData.pathnameBss = $('#txtFilenameBSS').val();
    requestData.pathnameCompleted = $('#txtPathnameCompleted').val();
    requestData.pathnameError = $('#txtPathnameError').val();
    if ($('#checkIsEmergency').is(':checked')) {
        requestData.isEmergency = true;
    } else {
        requestData.isEmergency = false;
    }
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterMachine/CreateMachine',
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

function editMachine() { 

    var requestData = new Object();
    requestData.MachineId = numeral($('#rowItemSelected').val()).value();
    requestData.departmentId = numeral($('#ddlDepartment').val()).value();
    requestData.machineTypeId = numeral($('#ddlMachineType').val()).value();
    requestData.machineCode = $('#txtMachineCode').val();
    requestData.machineName = $('#txtMachineName').val();
    requestData.hcLength = $('#txtHcLength').val();
    requestData.pathnameBss = $('#txtFilenameBSS').val();
    requestData.pathnameCompleted = $('#txtPathnameCompleted').val();
    requestData.pathnameError = $('#txtPathnameError').val();
    if ($('#checkIsEmergency').is(':checked')) {
        requestData.isEmergency = true;
    } else {
        requestData.isEmergency = false;
    }
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterMachine/UpdateMachine',
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

    if ($('#ddlDepartment').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlDepartment').addClass('is-invalid');
    }

    if ($('#ddlMachineType').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlMachineType').addClass('is-invalid');
    }

    if ($('#txtMachineCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtMachineCode').addClass('is-invalid');
    }

    if ($('#txtMachineName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtMachineName').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}
