//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterZone/SearchZone',
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
        console.log('selDept:' + selDept);
        console.log('selInst:' + selInst);
        return {
            departmentId: selDept ? parseInt(selDept, 10) : null,
            instId: selInst ? parseInt(selInst, 10) : null,
            isActive: isActive
        };
    },
    columns: [ 
        
        {
            data: 'zoneCode',
            title: 'รหัส Zone',
            className: 'text-start',
            width: '100px'
        },
        {
            data: 'zoneName',
            title: 'ชื่อ Zone',
            className: 'text-start', 
            width: '150px'
        },
        {
            data: 'departmentName',
            title: 'หน่วยงาน',
            className: 'text-start',
            width: '300px'            
        },
        {
            data: 'institutionNameTh',
            title: 'ธนาคาร',
            className: 'text-start'
        },
        {
            data: 'cbBcdCode',
            title: 'รหัสสัญญา',
            className: 'text-start',
            width: '150px'
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.ZoneId}"
                            onclick="showViewPopup(${value.zoneId},
                                                ${value.departmentId},
                                                '${value.departmentName}',
                                                ${value.instId},
                                                '${value.institutionNameTh == null ? '' : value.institutionNameTh}',
                                                '${value.zoneCode}',
                                                '${value.zoneName}',
                                                '${value.cbBcdCode}',
                                                ${value.isActive});"
                            data-toggle="tooltip" title="ดูข้อมูล" >
                            <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.ZoneId}" 
                        onclick="showEditPopup(${value.zoneId})" 
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

$('#btnToggleFilter').click(function () {
    $("#filterDisplay").slideToggle();
});

function initComponent() { 

    $('#ddlFilterStatus').select2({
        theme: "bootstrap-5",
        closeOnSelect: true,
        minimumResultsForSearch: 10
    });

    loadDepartmentZoneLookup(function () {

        $('#ddlFilterDepartment').select2({
            theme: "bootstrap-5",
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });

        $('#ddlDepartment').select2({
            theme: "bootstrap-5",
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });

        loadInstitutionZoneLookup(function () {
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
             

        });
    });
}

function initInput() {
     

    $('#txtZoneCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        $('#txtZoneCode').removeClass('is-invalid');
        $('#txtZoneCode').removeClass('is-valid');

        if (selectedValue != '') {
            $('#txtZoneCode').addClass('is-valid');
        }
    });

    $('#txtZoneName').on('input', function () {
        var selectedValue = $(this).val().trim();
        $('#txtZoneName').removeClass('is-invalid');
        $('#txtZoneName').removeClass('is-valid');

        if (selectedValue != '') {
            $('#txtZoneName').addClass('is-valid');
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

function clearValidate() {
    $('#ddlDepartment').removeClass("is-invalid");
    $('#ddlInstitution').removeClass("is-invalid"); 
    $("#txtZoneCode").removeClass("is-invalid");
    $("#txtZoneCode").removeClass("is-valid");
    $("#txtZoneName").removeClass("is-invalid");
    $("#txtZoneName").removeClass("is-valid");
    $('#txtCbBcdCode').removeClass('is-invalid');
    $('#txtCbBcdCode').removeClass('is-valid');
}
 

function loadDepartmentZoneLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterDepartment/GetDepartmentActiveList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlDepartment')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $('#ddlFilterDepartment')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

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

function loadInstitutionZoneLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterInstitution/GetInstitutionsActiveList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlInstitution')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ไม่ระบุ</option>');

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
 

function LoadDepartmentFilterChange() {

    MasterDataTable.refresh();
} 

function LoadInstitutionFilterChange() {

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

function showViewPopup(zoneId, departmentId, departmentName, instId, institutionNameTh, zoneCode, zoneName, cbBcdCode, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(zoneId);

    
    $('#txtViewDepartment').val(departmentName);
    $('#txtViewInst').val(institutionNameTh);
    $('#txtViewZoneCode').val(zoneCode);
    $('#txtViewZoneName').val(zoneName);
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
    $('#ddlDepartment').prop('disabled', false);
    $('#ddlInstitution').prop('disabled', false);
    $('#txtZoneCode').prop('disabled', false); 

    $('#ddlInstitution').val('').trigger('change');
    $('#ddlDepartment').val('').trigger('change');

    $('#txtZoneCode').val('');
    $('#txtZoneName').val('');

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

function showEditPopup(zoneId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(zoneId);

    $.requestAjax({
        service: 'MasterZone/GetZoneById?id=' + zoneId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {
             
                console.log(JSON.stringify(response.data));
                // ให้แก้ไขได้แค่ ZoneName
                $('#ddlDepartment').prop('disabled', true);
                $('#ddlInstitution').prop('disabled', true);
                $('#txtZoneCode').prop('disabled', true);

                $('#ddlDepartment').val(response.data.departmentId).trigger('change');;
                $('#ddlInstitution').val(response.data.instId).trigger('change');;
                $('#txtZoneCode').val(response.data.zoneCode);
                $('#txtZoneName').val(response.data.zoneName);
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
        createZone();
    } else {
        editZone();
    }
});

function createZone() {
    

    var requestData = new Object(); 
    requestData.departmentId = numeral($('#ddlDepartment').val()).value();;
    var selInstVal = $('#ddlInstitution').val();
    if (!isNaN(selInstVal) && selInstVal !== '') {
        requestData.instId = numeral(selInstVal).value();;
    } else {
        requestData.instId = null;
    }   
    requestData.zoneCode = $('#txtZoneCode').val();
    requestData.zoneName = $('#txtZoneName').val();
    requestData.cbBcdCode = $('#txtCbBcdCode').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }
    console.log(JSON.stringify(requestData));

    $.requestAjax({
        service: 'MasterZone/CreateZone',
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
function editZone() {
    

    var requestData = new Object();
    requestData.zoneId = numeral($('#rowItemSelected').val()).value();
    requestData.DepartmentId = numeral($('#ddlDepartment').val()).value();;
    var selInstVal = $('#ddlInstitution').val();
    if (!isNaN(selInstVal) && selInstVal !== '') {
        requestData.instId = numeral(selInstVal).value();;
    } else {
        requestData.instId = null;
    }   
    requestData.zoneCode = $('#txtZoneCode').val();
    requestData.zoneName = $('#txtZoneName').val();
    requestData.cbBcdCode = $('#txtCbBcdCode').val();
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterZone/UpdateZone',
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

     

    if ($('#txtZoneCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtZoneCode').addClass('is-invalid');
    }

    if ($('#txtZoneName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtZoneName').addClass('is-invalid');
    }

    if ($('#txtCbBcdCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtCbBcdCode').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}