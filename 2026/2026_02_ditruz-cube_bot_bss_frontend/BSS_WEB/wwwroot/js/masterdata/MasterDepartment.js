//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterDepartment/SearchDepartment',
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
            data: 'departmentCode',
            title: 'รหัสหน่วยงาน',
            className: 'text-start',
            width: '250px'
        },
        {
            data: 'departmentShortName',
            title: 'ชื่อย่อหน่วยงาน',
            className: 'text-start',
            width: '250px'
        },
        {
            data: 'departmentName',
            title: 'ชื่อหน่วยงาน',
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
            data:null,
            title: 'ดำเนินการ',
            width: '120px',
            orderable: false,
            searchable: false,
            className: 'text-center',
            render: function (_, __, row) {
                return `
                     <button type="button" class="actionBtn btn btn-action" id="btnItemView_${row.departmentId}"
                                data-tooltip-content="รายละเอียด"
                                onclick="showViewPopup(${row.departmentId},
                                                        '${row.departmentCode}',
                                                        '${row.departmentShortName}',
                                                        '${row.departmentName}',
                                                        ${row.isActive})">
                                <i class="bi bi-eye" fill="currentColor"></i>
                            </button>

                            <button type="button" 
                                class="actionBtn btn btn-action" 
                                data-tooltip-content="แก้ไขข้อมูล"
                                onclick="showEditPopup(${row.departmentId},
                                                        '${row.departmentCode}',
                                                        '${row.departmentShortName}',
                                                        '${row.departmentName}',
                                                        ${row.isActive})">
                               <i class="bi bi-pencil-square" fill="currentColor"></i>
                            </button>
                `;
            }
        }
        
    ],
    onInitComplete: function () {
    }
});

$(document).ready(function () {
    MasterDataTable.init();
    clearValidate();
    initInput();    
    initComponent();
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
 

function initInput() {
    $('#txtDepartmentCode').on('input', function () {
        $('#txtDepartmentCode').removeClass('is-invalid');
        $('#txtDepartmentCode').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtDepartmentCode').addClass('is-valid');
        }
    });

    $('#txtDepartmentShortName').on('input', function () {
        $('#txtDepartmentShortName').removeClass('is-invalid');
        $('#txtDepartmentShortName').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtDepartmentShortName').addClass('is-valid');
        }
    });

    $('#txtDepartmentName').on('input', function () {
        $('#txtDepartmentName').removeClass('is-invalid');
        $('#txtDepartmentName').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtDepartmentName').addClass('is-valid');
        }
    });

    $('#ddlCompany').on('change', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#ddlCompany').removeClass('is-invalid');
            $('#ddlCompany').addClass('is-valid');
        } else {
            $('#ddlCompany').removeClass('is-invalid');
            $('#ddlCompany').removeClass('is-valid');
        }
    });

}

function clearValidate() {
    $("#txtDepartmentCode").removeClass("is-invalid");
    $("#txtDepartmentShortName").removeClass("is-invalid");
    $("#txtDepartmentName").removeClass("is-invalid");
    $("#ddlCompany").removeClass("is-invalid");

    $("#txtDepartmentCode").removeClass("is-valid");
    $("#txtDepartmentShortName").removeClass("is-valid");
    $("#txtDepartmentName").removeClass("is-valid");
    $("#ddlCompany").removeClass("is-valid");
}

function showViewPopup(departmentId, departmentCode, departmentShortName, departmentName, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(departmentId);


    // $('#txtViewDepartmentId').val(departmentId);
    $('#txtViewDepartmentCode').val(departmentCode);
    $('#txtViewDepartmentShortName').val(departmentShortName);
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
    $('#txtDepartmentCode').val('');
    $('#txtDepartmentShortName').val('');
    $('#txtDepartmentName').val('');
    $('#ddlCompany').val('').trigger('change');;

    $('#txtDepartmentCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(departmentId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(departmentId);

    $.requestAjax({
        service: 'MasterDepartment/GetDepartmentById?id=' + departmentId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

             

                $('#txtDepartmentCode').val(response.data.departmentCode);
                $('#txtDepartmentShortName').val(response.data.departmentShortName);
                $('#txtDepartmentName').val(response.data.departmentName);

                $('#txtDepartmentCode').prop('disabled', true);

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
    showEditPopup(numeral($('#rowItemSelected').val()).value(), numeral($('#rowCompanyIdSelected').val()).value());
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
        createDepartment();
    } else {
        editDepartment();
    }
});

function createDepartment() { 

    var requestData = new Object();
    requestData.departmentId = 0;
    requestData.departmentCode = $('#txtDepartmentCode').val();
    requestData.departmentShortName = $('#txtDepartmentShortName').val();
    requestData.departmentName = $('#txtDepartmentName').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterDepartment/CreateDepartment',
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

function editDepartment() { 

    var requestData = new Object();
    requestData.departmentId = numeral($('#rowItemSelected').val()).value();
    requestData.departmentCode = $('#txtDepartmentCode').val();
    requestData.departmentShortName = $('#txtDepartmentShortName').val();
    requestData.departmentName = $('#txtDepartmentName').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterDepartment/UpdateDepartment',
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

    if ($('#txtDepartmentCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtDepartmentCode').addClass('is-invalid');
    }

    if ($('#txtDepartmentShortName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtDepartmentShortName').addClass('is-invalid');
    }

    if ($('#txtDepartmentName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtDepartmentName').addClass('is-invalid');
    }

    if ($('#ddlCompany').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlCompany').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}


 
 