//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterRole/SearchRole',
    height: '100%',
    buildFilter: function () {
        var isActiveVal = $('#ddlFilterStatus').val();
        var roleGroupVal = $('#ddlFilterRoleGroup').val();
        var isActive = null;
        if (isActiveVal === "1") {
            isActive = true;
        } else if (isActiveVal === "0") {
            isActive = false;
        }
        var roleGroupId =
            roleGroupVal === "" || roleGroupVal == null
                ? null
                : parseInt(roleGroupVal, 10);
        return {
            isActive: isActive,
            roleGroupId:roleGroupId
        };
    },

    columns: [ 

        {
            data: 'roleCode',
            title: 'รหัสบทบาท',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'roleName',
            title: 'ชื่อบทบาท',
            className: 'text-start',
            width: '250px'
        },
        {
            data: 'roleDescription',
            title: 'รายละเอียด',
            className: 'text-start',
        },
        {
            data: 'roleGroupName',
            title: 'กลุ่มบทบาท',
            className: 'text-start',
            width: '250px'
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
                     <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.roleId}"
                                                   onclick="showViewPopup(${value.roleId}, 
                                                                         '${value.roleCode}', 
                                                                         '${value.roleName}', 
                                                                         ${value.isActive}, 
                                                                         '${value.roleDescription}',
                                                                         '${value.roleGroupName}',
                                                                         ${value.seqNo},
                                                                         ${value.isGetOtpSupervisor},
                                                                         ${value.isGetOtpManager},);"
                                               data-toggle="tooltip" title="ดูข้อมูล" >
                                               <i class="bi bi-eye" fill="currentColor"></i>
                                          </button>
                                           <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.roleId}" 
                                               onclick="showEditPopup(${value.roleId})" 
                                               data-toggle="tooltip" title="แก้ไขข้อมูล" >
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



function initComponent() { 

    $('#ddlFilterStatus').select2({
        theme: "bootstrap-5",
        closeOnSelect: true,
        minimumResultsForSearch: 10
    });

    $('#btnToggleFilter').click(function () {
        $("#filterDisplay").slideToggle();
    });


    loadRoleGroupLookup(function () {

        $('#ddlFilterRoleGroup').select2({
            theme: "bootstrap-5",
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });

        $('#ddlRoleGroup').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#addOrEditItemModal'),
            closeOnSelect: true,
            minimumResultsForSearch: 10
        }); 
    });


}

function loadRoleGroupLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterRoleGroup/GetAllRoleGroupList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlFilterRoleGroup')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $('#ddlRoleGroup')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlFilterRoleGroup').append(`<option value="${value.roleGroupId}">${value.roleGroupName}</option>`);
                    $('#ddlRoleGroup').append(`<option value="${value.roleGroupId}">${value.roleGroupName}</option>`);
                });
            }

            
        }
    });
}


function initInput() {
    $('#txtRoleCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        $('#txtRoleCode').removeClass('is-invalid');
        $('#txtRoleCode').removeClass('is-valid');

        if (selectedValue != '') {
            $('#txtRoleCode').addClass('is-valid');
        }
    });

    $('#txtRoleName').on('input', function () {
        var selectedValue = $(this).val().trim();
        $('#txtRoleName').removeClass('is-invalid');
        $('#txtRoleName').removeClass('is-valid');

        if (selectedValue != '') {
            $('#txtRoleName').addClass('is-valid');
        }
    });

    $('#txtRoleDescription').on('input', function () {
        var selectedValue = $(this).val().trim();
        $('#txtRoleDescription').removeClass('is-invalid');
        $('#txtRoleDescription').removeClass('is-valid');

        if (selectedValue != '') {
            $('#txtRoleDescription').addClass('is-valid');
        }
    });

    $('#ddlRoleGroup').on('change', function () {
        var selectedValue = $(this).val().trim();
        $('#ddlRoleGroup').removeClass('is-invalid');
        $('#ddlRoleGroup').removeClass('is-valid');

        if (selectedValue != '') {
            $('#ddlRoleGroup').addClass('is-valid');
        }
    });
}

function clearValidate() {
    $("#txtRoleCode").removeClass("is-invalid");
    $("#txtRoleName").removeClass("is-invalid");
    $("#txtRoleDescription").removeClass("is-invalid");
    $("#txtRoleCode").removeClass("is-valid");
    $("#txtRoleName").removeClass("is-valid");
    $("#txtRoleDescription").removeClass("is-valid");
    $("#ddlRoleGroup").removeClass("is-valid");
    $("#ddlRoleGroup").removeClass("is-valid");

}

function inititalTooltip() {
     

    // Initialize tooltips for buttons within the datatable
    $('#dtRoleLists').on('mouseenter', '.actionBtn', function () {
        $(this).tooltip({
            title: $(this).data('tooltip-content'), // Get content from data attribute
            placement: 'top' // Position the tooltip
        }).tooltip('show');
    });

    $('#dtRoleLists').on('mouseleave', '.actionBtn', function () {
        $(this).tooltip('hide');
    });
}

function LoadRoleGroupFilterChange() {

    MasterDataTable.refresh();
}

function LoadStatusFilterChange() {

    MasterDataTable.refresh();
}

function showViewPopup(roleId, roleCode, roleName, isActive, roleDescription, roleGroupName, seqNo, isGetOtpSupervisor, isGetOtpManager) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(roleId);
    $('#rowItemSeqNo').val(seqNo);

    $('#txtViewRoleId').val(roleId);
    $('#txtViewRoleCode').val(roleCode);
    $('#txtViewRoleName').val(roleName);
    $('#txtViewRoleDescription').val(roleDescription);
    $('#txtViewRoleGroup').val(roleGroupName);


    if (isActive) {
        $('#spanViewStatus').removeClass("badge-inactive");
        $('#spanViewStatus').addClass('badge-active');
        $('#spanViewStatus').text('Active');

    } else {
        $('#spanViewStatus').removeClass("badge-active");
        $('#spanViewStatus').addClass('badge-inactive');
        $('#spanViewStatus').text('Inactive');
    }

    if (isGetOtpSupervisor) {
        $('#chkViewIsGetOtpSupervisor').prop('checked', true);
    } else { $('#chkViewIsGetOtpSupervisor').prop('checked', false); }

    if (isGetOtpManager) {
        $('#chkViewIsGetOtpManager').prop('checked', true);
    } else { $('#chkViewIsGetOtpManager').prop('checked', false); }

    $('#ViewItemDetailModal').modal('show');
}

function showCreatePopup() {
    clearValidate();
    $('#txtRoleCode').val('');
    $('#txtRoleName').val('');
    $('#txtRoleDescription').val('');
    $('#ddlRoleGroup').val('').trigger('change');

    $('#ddlRoleGroup').prop('disabled', false);
    $('#txtRoleCode').prop('disabled', false);
    $('#rowItemSeqNo').val('0');

    $('#chkAddEditIsGetOtpSupervisor').prop('checked', false);
    $('#chkAddEditIsGetOtpManager').prop('checked', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(roleId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(roleId);

    $.requestAjax({
        service: 'MasterRole/GetRoleById?id=' + roleId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

             

                $('#txtRoleCode').val(response.data.roleCode);
                $('#txtRoleName').val(response.data.roleName);
                $('#txtRoleDescription').val(response.data.roleDescription);
                $('#ddlRoleGroup').val(response.data.roleGroupId).trigger('change');
                $('#rowItemSeqNo').val(response.data.seqNo);
                /*
                $('#ddlRoleGroup').prop('disabled', true);
                $('#txtRoleCode').prop('disabled', true);
                */
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

                if (response.data.isGetOtpSupervisor) {
                    $('#chkAddEditIsGetOtpSupervisor').prop('checked', true);
                } else { $('#chkAddEditIsGetOtpSupervisor').prop('checked', false); }

                if (response.data.isGetOtpManager) {
                    $('#chkAddEditIsGetOtpManager').prop('checked', true);
                } else { $('#chkAddEditIsGetOtpManager').prop('checked', false); }


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
        createRole();
    } else {
        editRole();
    }
});

function createRole() { 

    var requestData = new Object();
    requestData.roleGroupId = numeral($('#ddlRoleGroup').val()).value();
    requestData.roleCode = $('#txtRoleCode').val();
    requestData.roleName = $('#txtRoleName').val();
    requestData.roleDescription = $('#txtRoleDescription').val();

    if ($('#chkAddEditIsGetOtpSupervisor').is(':checked')) {
        requestData.isGetOtpSupervisor = true;
    } else {
        requestData.isGetOtpSupervisor = false;
    }

    if ($('#chkAddEditIsGetOtpManager').is(':checked')) {
        requestData.isGetOtpManager = true;
    } else {
        requestData.isGetOtpManager = false;
    }

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterRole/CreateRole',
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

function editRole() { 

    var requestData = new Object();
    requestData.roleId = numeral($('#rowItemSelected').val()).value();
    requestData.roleGroupId = numeral($('#ddlRoleGroup').val()).value();
    requestData.roleCode = $('#txtRoleCode').val();
    requestData.roleName = $('#txtRoleName').val();
    requestData.roleDescription = $('#txtRoleDescription').val();

    if ($('#chkAddEditIsGetOtpSupervisor').is(':checked')) {
        requestData.isGetOtpSupervisor = true;
    } else {
        requestData.isGetOtpSupervisor = false;
    }

    if ($('#chkAddEditIsGetOtpManager').is(':checked')) {
        requestData.isGetOtpManager = true;
    } else {
        requestData.isGetOtpManager = false;
    }

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterRole/UpdateRole',
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

    if ($('#txtRoleCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtRoleCode').addClass('is-invalid');
    }

    if ($('#txtRoleName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtRoleName').addClass('is-invalid');
    }

    if ($('#txtRoleDescription').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtRoleDescription').addClass('is-invalid');
    }

    if ($('#ddlRoleGroup').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlRoleGroup').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}
