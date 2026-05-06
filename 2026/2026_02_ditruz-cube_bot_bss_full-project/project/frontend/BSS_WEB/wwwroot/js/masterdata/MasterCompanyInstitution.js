//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterCompanyInstitution/SearchCompanyInstitution',
    height: '420px',
    buildFilter: function () {
        var isActiveVal = $('#ddlFilterStatus').val();
        let isActive = null;
        if (isActiveVal === "1") {
            isActive = true;
        } else if (isActiveVal === "0") {
            isActive = false;
        }        
        var selComp = $('#ddlFilterCompany').val();
        var selInst = $('#ddlFilterInstitution').val();
        console.log('selComp:' + selComp);
        console.log('selInst:' + selInst);
        return {
            companyId: selComp ? parseInt(selComp, 10) : null,
            instId: selInst ? parseInt(selInst, 10) : null,            
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
            data: 'institutionNameTh',
            title: 'ชื่อธนาคาร',
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
                return RenderDataTableActiveBadge(data);
            }
        },
        {
            title: 'ดำเนินการ',
            orderable: false,
            searchable: false,
            className: 'text-center',
            render: function (_, __, value) {
                return `
                    <button type="button" class="actionBtn btn btn-outline-secondary"  
                            onclick="showViewPopup(${value.companyInstId},
                                                    ${value.companyId},
                                                    '${value.companyName}',
                                                    ${value.instId},
                                                    '${value.institutionNameTh}',
                                                    '${value.cbBcdCode}',                                                  
                                                    ${value.isActive});"
                            data-toggle="tooltip" title="ดูข้อมูล" ><i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" data-toggle="tooltip" title="แก้ไขข้อมูล" class="actionBtn btn btn-outline-secondary"  
                            onclick="showEditPopup(${value.companyInstId});">
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

        loadInstitutionLookup(function () {

            $('#ddlInstitution').select2({
                theme: "bootstrap-5",
                dropdownParent: $('#addOrEditItemModal'),
                closeOnSelect: true
            });

            $('#ddlFilterInstitution').select2({
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

    $('#ddlInstitution').on('change', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#ddlInstitution').removeClass('is-invalid');
            $('#ddlInstitution').addClass('is-valid');
        } else {
            $('#ddlInstitution').removeClass('is-invalid');
            $('#ddlInstitution').removeClass('is-valid');
        }
    });
}
function loadCompanyLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterCompany/GetCompanyList',
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

function loadInstitutionLookup(onSuccess) { 
    $.requestAjax({
        service: 'MasterInstitution/GetInstitutionList',
        type: 'GET', 
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlFilterInstitution')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $('#ddlInstitution')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

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

function clearValidate() { 
    $('#txtViewCbBcdCode').removeClass('is-invalid');
    $('#ddlCompany').removeClass('is-invalid');
    $('#ddlInstitution').removeClass('is-invalid');     
    $('#txtCashPointName').removeClass('is-valid');
    $('#ddlInstitution').removeClass('is-valid');
   
}
 


function LoadCompanyFilterChange() {

    MasterDataTable.refresh();
}

function LoadInstitutionFilterChange() {

    MasterDataTable.refresh();
}

function LoadStatusFilterChange() {

    MasterDataTable.refresh();
}

function showViewPopup(companyInstId, companyId, companyName, instId, institutionNameTh, cbBcdCode,  isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(companyInstId);  
    $('#txtViewCbBcdCode').val(cbBcdCode);
    $('#txtViewCompanyName').val(companyName); 
    $('#txtViewInstitutionNameTh').val(institutionNameTh);  

    
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


    $('#ddlCompany').val('').trigger('change');
    $('#ddlInstitution').val('').trigger('change'); 
    
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');

    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(companyInstId ) {

    $('#modeSave').val('edit');
    $('#rowItemSelected').val(companyInstId); 

    $.requestAjax({
        service: 'MasterCompanyInstitution/GetCompanyInstitutionById?id=' + companyInstId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {
            console.log(JSON.stringify(response));
             

               
                $('#txtCbBcdCode').val(response.data.cbBcdCode);
                $('#ddlCompany').val(response.data.companyId).trigger('change');
                $('#ddlInstitution').val(response.data.instId).trigger('change'); 
                 
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
        createCompanyInstitution();
    } else {
        editCompanyInstitution();
    }
});

function createCompanyInstitution() {

    
    var requestData = new Object(); 
    requestData.cbBcdCode = $('#txtCbBcdCode').val();
    requestData.companyId = numeral($('#ddlCompany').val()).value();        
    requestData.instId = numeral($('#ddlInstitution').val()).value();  
     
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterCompanyInstitution/CreateCompanyInstitution',
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

function editCompanyInstitution() {

     
    var requestData = new Object();
    requestData.companyInstId = numeral($('#rowItemSelected').val()).value();
    requestData.cbBcdCode = $('#txtCbBcdCode').val();
    requestData.companyId = numeral($('#ddlCompany').val()).value();
    requestData.instId = numeral($('#ddlInstitution').val()).value();
    
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }
    console.log(JSON.stringify(requestData));

    $.requestAjax({
        service: 'MasterCompanyInstitution/UpdateCompanyInstitution',
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

    if ($('#ddlInstitution').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlInstitution').addClass('is-invalid');
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

function CompanyChange() {
    if ($('#modeSave').val() == "add") {
        GetCbBcdCode();
    }
}

function GetCbBcdCode() {
     
    var companyId = $('#ddlCompany').val();
    var url = 'MasterCompanyDepartment/GetCbBcdCodeByCompany?companyId=' + companyId;
    console.log(url);
    if (companyId) {
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