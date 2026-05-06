//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterRoleGroup/SearchRoleGroup',
    height: '100%',
    buildFilter: function () {
        var isActiveVal = $('#ddlFilterStatus').val(); 
        var isActive = null;
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
            data: 'roleGroupCode',
            title: 'รหัสกลุ่มบทบาท',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'roleGroupName',
            title: 'ชื่อกลุ่มบทบาท',
            className: 'text-start'
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
            data: null,
            title: 'ดำเนินการ',
            width: '120px',
            orderable: false,
            searchable: false,
            className: 'text-center',
            render: function (_, __, value) {
                return `
                     <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.roleGroupId}"
                        onclick="showViewPopup(${value.roleGroupId}, '${value.roleGroupCode}', '${value.roleGroupName}', ${value.isActive});"
                        data-toggle="tooltip" title="ดูข้อมูล" ><i class="bi bi-eye" fill="currentColor"></i>
                        </button>
                        <button type="button" data-toggle="tooltip" title="แก้ไขข้อมูล" class="actionBtn btn btn-action" id="btnItemEdit_${value.roleGroupId}"
                        onclick="showEditPopup(${value.roleGroupId});">
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
    initComponent();
    clearValidate();
    initInput();
});

$('#btnToggleFilter').click(function () {
    $("#filterDisplay").slideToggle();
});

function LoadStatusFilterChange() {

    MasterDataTable.refresh();
}
function initComponent() {
    $('#ddlFilterStatus').select2({
        theme: "bootstrap-5",
        closeOnSelect: true,
        minimumResultsForSearch: 10
    });
}

function clearValidate() {

    $('#txtRoleGroupCode').removeClass('is-invalid');
    $('#txtRoleGroupName').removeClass('is-invalid');

    $('#txtRoleGroupCode').removeClass('is-valid');
    $('#txtRoleGroupName').removeClass('is-valid');
}

function initInput() {

    $('#txtRoleGroupCode').on('input', function () {
        $('#txtRoleGroupCode').removeClass('is-invalid');
        $('#txtRoleGroupCode').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtRoleGroupCode').addClass('is-valid');
        }
    });

    $('#txtRoleGroupName').on('input', function () {
        $('#txtRoleGroupName').removeClass('is-invalid');
        $('#txtRoleGroupName').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtRoleGroupName').addClass('is-valid');
        }
    });
}

function initialTooltip() {
     

    // Initialize tooltips for buttons within the datatable
    $('#dtRoleGroup').on('mouseenter', '.actionBtn', function () {
        $(this).tooltip({
            title: $(this).data('tooltip-content'), // Get content from data attribute
            placement: 'top' // Position the tooltip
        }).tooltip('show');
    });

    $('#dtRoleGroup').on('mouseleave', '.actionBtn', function () {
        $(this).tooltip('hide');
    });
}
 

function showViewPopup(roleGroupId, roleGroupCode, roleGroupName, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(roleGroupId);

    $('#txtViewRoleGroupCode').val(roleGroupCode);
    $('#txtViewRoleGroupName').val(roleGroupName);

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

    $('#txtRoleGroupCode').val('');
    $('#txtRoleGroupName').val('');

    //$('#txtRoleGroupCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');

    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(roleGroupId) {

    $('#modeSave').val('edit');
    $('#rowItemSelected').val(roleGroupId);

    $.requestAjax({
        service: 'MasterRoleGroup/GetRoleGroupById?id=' + roleGroupId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

             

                $('#txtRoleGroupCode').val(response.data.roleGroupCode);
                $('#txtRoleGroupName').val(response.data.roleGroupName);
                //$('#txtRoleGroupCode').prop('disabled', true);

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
        createRoleGroup();
    } else {
        editRoleGroup();
    }
});

function createRoleGroup() { 
    var requestData = new Object();
    requestData.roleGroupCode = $('#txtRoleGroupCode').val();
    requestData.roleGroupName = $('#txtRoleGroupName').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterRoleGroup/CreateRoleGroup',
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

function editRoleGroup() { 
    var requestData = new Object();
    requestData.roleGroupId = numeral($('#rowItemSelected').val()).value();
    requestData.roleGroupCode = $('#txtRoleGroupCode').val();
    requestData.roleGroupName = $('#txtRoleGroupName').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterRoleGroup/UpdateRoleGroup',
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

    if ($('#txtRoleGroupCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtRoleGroupCode').addClass('is-invalid');
    }

    if ($('#txtRoleGroupName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtRoleGroupName').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}