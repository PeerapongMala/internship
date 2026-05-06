//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterCompanyDepartment/SearchCompanyDepartment',
    height: '100%',
    buildFilter: function () {
        var isActiveVal = $('#ddlFilterStatus').val();
        let isActive = null;
        if (isActiveVal === "1") {
            isActive = true;
        } else if (isActiveVal === "0") {
            isActive = false;
        }        
        var selComp = $('#ddlFilterCompany').val();
        var selDept = $('#ddlFilterDepartment').val();
        return {
            companyId: selComp ? parseInt(selComp, 10) : null,
            departmentId: selDept ? parseInt(selDept, 10) : null,            
            isActive: isActive
        };
    },
    columns: [        
        
        {
            data: 'cbBcdCode',
            title: 'รหัสสัญญา',
            className: 'text-start',
            width: '100px'
        }, 
        {
            data: 'companyName',
            title: 'ชื่อบริษัท',
            className: 'text-start' 
        },
        {
            data: 'departmentName',
            title: 'ชื่อหน่วยงาน',
            className: 'text-start',
        },
        {
            data: 'startDate',
            title: 'วันที่มีผล',
            className: 'text-center',
            render: function (data, type, row) {
                if (type === 'sort' || type === 'type') {
                    return data;
                }
                return RenderDataTableThaiDate(data);
            }
        },    
        {
            data: 'endDate',
            title: 'วันที่สิ้นสุด',
            className: 'text-center',
            render: function (data, type, row) {
                if (type === 'sort' || type === 'type') {
                    return data;
                }
                return RenderDataTableThaiDate(data);
            }
        },   
        {
            data: 'isSendUnsortCC',
            title: 'มีการส่งมอบ รับมอบ',
            className: 'text-center',
            orderable: true,
            width: '100px',
            render: function (data, type) {
                // For sorting & filtering
                if (type === 'sort' || type === 'type') {
                    return data ? 1 : 0;
                }
                // For display
                return RenderDataTableYesNoBadge(data);
            }
        },
        {
            data: 'isPrepareCentral',
            title: 'Prepare กลาง',
            className: 'text-center',
            orderable: true,
            width: '100px',
            render: function (data, type) {
                // For sorting & filtering
                if (type === 'sort' || type === 'type') {
                    return data ? 1 : 0;
                }
                // For display
                return RenderDataTableYesNoBadge(data);
            }
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
                return RenderDataTableActiveBadge(data);
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
                    <button type="button" class="actionBtn btn btn-action" 
                            onclick="showViewPopup(${value.comdeptId},
                                                    ${value.companyId},
                                                    '${value.companyName}',
                                                    ${value.departmentId},
                                                    '${value.departmentName}',
                                                    '${value.cbBcdCode}',
                                                    '${value.startDate}',
                                                    '${value.endDate}',
                                                    ${value.isPrepareCentral},
                                                    ${value.isSendUnsortCC},
                                                    ${value.isActive});"
                            data-toggle="tooltip" title="ดูข้อมูล" ><i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" data-toggle="tooltip" title="แก้ไขข้อมูล" class="actionBtn btn btn-action"
                            onclick="showEditPopup(${value.comdeptId});">
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

    loadCompanyLookup(function () {

        $('#ddlCompany').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#addOrEditItemModal'),
            closeOnSelect: true
        });

        $('#ddlFilterCompany').select2({
            theme: "bootstrap-5",
            closeOnSelect: true
        });

        loadDepartmentLookup(function () {

            $('#ddlDepartment').select2({
                theme: "bootstrap-5",
                dropdownParent: $('#addOrEditItemModal'),
                closeOnSelect: true
            });

            $('#ddlFilterDepartment').select2({
                theme: "bootstrap-5",
                closeOnSelect: true
            });

             
        });
    });
     
}

function initInput() {

    

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

    $('#ddlCompany').on('change', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            branchId = numeral(selectedValue).value();
            $('#ddlCompany').removeClass('is-invalid');
            $('#ddlCompany').addClass('is-valid');
        } else {
            $('#ddlCompany').removeClass('is-invalid');
            $('#ddlCompany').removeClass('is-valid');
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

    $('#txtStartDate').on('change', function () {
        $('#txtStartDate').removeClass('is-invalid');
        $('#txtStartDate').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtStartDate').addClass('is-valid');
        }
    });

    $('#txtEndDate').on('change', function () {
        $('#txtEndDate').removeClass('is-invalid');
        $('#txtEndDate').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtEndDate').addClass('is-valid');
        }
    });

     

    jQuery('#txtStartDate').datetimepicker({        
        lang: 'th',
        yearOffset: 543,
        timepicker: false,
        format: 'd/m/Y'
    });

    jQuery('#txtEndDate').datetimepicker({
        lang: 'th',
        yearOffset: 543,
        timepicker: false,
        format: 'd/m/Y'
    });

     
}
function loadCompanyLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterCompany/GetCompaniesIsActive',
        type: 'GET',
        /*        parameter: requestData,*/
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlCompany')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $('#ddlFilterCompany')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlCompany').append(`<option value="${value.companyId}">${value.companyName}</option>`);
                    $('#ddlFilterCompany').append(`<option value="${value.companyId}">${value.companyName}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}

function loadDepartmentLookup(onSuccess) {

    $.requestAjax({
        service: 'MasterDepartment/GetDepartmentsIsActive',
        type: 'GET',
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
    $('#txtCbBcdCode').removeClass('is-invalid').removeClass('is-valid');
    $('#ddlCompany').removeClass('is-invalid').removeClass('is-valid');
    $('#ddlDepartment').removeClass('is-invalid').removeClass('is-valid');
    $('#ddlInstitution').removeClass('is-invalid').removeClass('is-valid');
    $('#txtStartDate').removeClass('is-invalid').removeClass('is-valid');
    $('#txtEndDate').removeClass('is-invalid').removeClass('is-valid');
} 

function LoadCompanyFilterChange() {

    MasterDataTable.refresh();
}

function LoadDepartmentFilterChange() {

    MasterDataTable.refresh();
}

function LoadStatusFilterChange() {

    MasterDataTable.refresh();
}

function showViewPopup(comdeptId, companyId, companyName, departmentId, departmentName, cbBcdCode,startDate,endDate, isPrepareCentral, isSendUnsortCC, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(comdeptId);  
    $('#txtViewCbBcdCode').val(cbBcdCode);
    $('#txtViewCompanyName').val(companyName); 
    $('#txtViewDepartmentName').val(departmentName); 
    $('#txtViewStartDate').val(RenderDataTableThaiDate(startDate)); 
    $('#txtViewEndDate').val(RenderDataTableThaiDate(endDate)); 

    var viewIsSendUnsortCC = $('#spanViewIsSendUnsortCC');
    if (isSendUnsortCC) {
        viewIsSendUnsortCC.removeClass("badge-inactive");
        viewIsSendUnsortCC.addClass('badge-active');
        viewIsSendUnsortCC.text('Yes');
    } else {
        viewIsSendUnsortCC.removeClass("badge-active");
        viewIsSendUnsortCC.addClass('badge-inactive');
        viewIsSendUnsortCC.text('No');
    }

    var viewIsPrepareCentral = $('#spanViewIsPrepareCentral');
    if (isPrepareCentral) {
        viewIsPrepareCentral.removeClass("badge-inactive");
        viewIsPrepareCentral.addClass('badge-active');
        viewIsPrepareCentral.text('Yes');
    } else {
        viewIsPrepareCentral.removeClass("badge-active");
        viewIsPrepareCentral.addClass('badge-inactive');
        viewIsPrepareCentral.text('No');
    }
    
    var viewStatus = $('#spanViewStatus');
    if (isActive) {
        viewStatus.removeClass("badge-inactive");
        viewStatus.addClass('badge-active');
        viewStatus.text('Active');
    } else {
        viewStatus.removeClass("badge-active");
        viewStatus.addClass('badge-inactive');
        viewStatus.text('Inactive');
    }

    $('#ViewItemDetailModal').modal('show');
}

function showCreatePopup() {
    clearValidate(); 
    $('#modeSave').val('add');
    $('#rowItemSelected').val('');

    $('#txtCbBcdCode').val('');
    $('#txtStartDate').val('');
    $('#txtEndDate').val('');
    $('#ddlCompany').val('').trigger('change');
    $('#ddlDepartment').val('').trigger('change'); 
    $('#checkIsSendUnsortCC').prop('checked', false);
    $('#checkIsPrepareCentral').prop('checked', false);
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus,#spanIsPrepareCentral,#spanIsSendUnsortCC').removeClass("badge-active");
    $('#spanStatus,#spanIsPrepareCentral,#spanIsSendUnsortCC').addClass('badge-inactive');
    $('#spanIsPrepareCentral,#spanIsSendUnsortCC').text('No');
    $('#spanStatus').text('Inactive');

    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(comdeptId ) {

    $('#modeSave').val('edit');
    $('#rowItemSelected').val(comdeptId); 

    $.requestAjax({
        service: 'MasterCompanyDepartment/GetCompanyDepartmentById?id=' + comdeptId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {
            console.log(JSON.stringify(response));
             

               
                $('#txtCbBcdCode').val(response.data.cbBcdCode);
                $('#ddlCompany').val(response.data.companyId).trigger('change');
                $('#ddlDepartment').val(response.data.departmentId).trigger('change');
                $('#txtStartDate').val(FormatThaiDate(response.data.startDate));
                $('#txtEndDate').val(FormatThaiDate(response.data.endDate));

                $('#checkIsSendUnsortCC').prop('checked', response.data.isSendUnsortCC).trigger('change'); 
                $('#checkIsPrepareCentral').prop('checked', response.data.isPrepareCentral).trigger('change');
                $('#checkIsActive').prop('checked', response.data.isActive).trigger('change');
                 
                  
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
    var span = $('#spanStatus')
    if (this.checked) {
        span.removeClass("badge-inactive");
        span.addClass('badge-active');
        span.text('Active');
    } else {
        span.removeClass("badge-active");
        span.addClass('badge-inactive');
        span.text('Inactive');
    }
});


$('#checkIsSendUnsortCC').change(function () {
    console.log('checkIsSendUnsortCC');
    var span = $('#spanIsSendUnsortCC');
    if (this.checked) {
        span.removeClass("badge-inactive");
        span.addClass('badge-active');
        span.text('Yes');
    } else {
        span.removeClass("badge-active");
        span.addClass('badge-inactive');
        span.text('No');
    }
});

$('#checkIsPrepareCentral').change(function () {
    console.log('checkIsPrepareCentral');
    var span = $('#spanIsPrepareCentral');
    if (this.checked) {
        span.removeClass("badge-inactive");
        span.addClass('badge-active');
        span.text('Yes');
    } else {
        span.removeClass("badge-active");
        span.addClass('badge-inactive');
        span.text('No');
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
        createCompanyDepartment();
    } else {
        editCompanyDepartment();
    }
});

function createCompanyDepartment() {

    
    var requestData = new Object(); 
    requestData.cbBcdCode = $('#txtCbBcdCode').val();
    requestData.companyId = numeral($('#ddlCompany').val()).value();        
    requestData.departmentId = numeral($('#ddlDepartment').val()).value();  
    requestData.startDate = ParseThaiDate($('#txtStartDate').val());
    requestData.endDate = ParseThaiDate($('#txtEndDate').val());
    if ($('#checkIsSendUnsortCC').is(':checked')) {
        requestData.isSendUnsortCC = true;
    } else {
        requestData.isSendUnsortCC = false;
    }
    if ($('#checkIsPrepareCentral').is(':checked')) {
        requestData.isPrepareCentral = true;
    } else {
        requestData.isPrepareCentral = false;
    }
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterCompanyDepartment/CreateCompanyDepartment',
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

function editCompanyDepartment() {

     
    var requestData = new Object();
    requestData.comdeptId = numeral($('#rowItemSelected').val()).value();
    requestData.cbBcdCode = $('#txtCbBcdCode').val();
    requestData.companyId = numeral($('#ddlCompany').val()).value();
    requestData.departmentId = numeral($('#ddlDepartment').val()).value();
    requestData.startDate = ParseThaiDate($('#txtStartDate').val());
    requestData.endDate = ParseThaiDate($('#txtEndDate').val());
    if ($('#checkIsSendUnsortCC').is(':checked')) {
        requestData.isSendUnsortCC = true;
    } else {
        requestData.isSendUnsortCC = false;
    }
    if ($('#checkIsPrepareCentral').is(':checked')) {
        requestData.isPrepareCentral = true;
    } else {
        requestData.isPrepareCentral = false;
    }
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }
    console.log(JSON.stringify(requestData));

    $.requestAjax({
        service: 'MasterCompanyDepartment/UpdateCompanyDepartment',
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

   

    if ($('#txtCbBcdCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtCbBcdCode').addClass('is-invalid');
    }

    if ($('#ddlCompany').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlInstitution').addClass('is-invalid');
    } 

    if ($('#ddlDepartment').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlDepartment').addClass('is-invalid');
    } 

    if ($('#txtStartDate').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtStartDate').addClass('is-invalid');
    }

    if ($('#txtEndDate').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtEndDate').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}