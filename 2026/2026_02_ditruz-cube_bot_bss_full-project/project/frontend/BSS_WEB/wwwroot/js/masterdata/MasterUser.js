
//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterUser/SearchUser',
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
        var selRole = $('#ddlFilterUserRole').val();

        return {
            companyId: selComp ? parseInt(selComp, 10) : null,
            departmentId: selDept ? parseInt(selDept, 10) : null,
            roleGroupId: selRole ? parseInt(selRole, 10) : null,
            isActive: isActive
        };
    },
    columns: [
        /*
         <th class="bss-th-center">ชื่อ-นามสกุล</th>
        <th class="bss-th-center">Role</th>
        <th class="bss-th-center">ชื่อบริษัท</th>
        <th class="bss-th-center">ศูนย์จัดการธนบัตร</th>
        <th class="bss-th-center">สถานะใช้งาน</th>
        <th class="bss-th-center">ดำเนินการ</th>
        */
        {
            data: 'usernameDisplay',
            title: 'ชื่อที่แสดง',
            className: 'text-start',
            width: '150px'
        },
        //{
        //    data: 'userEmail',
        //    title: 'Email',
        //    className: 'text-start',
        //    width: '150px'
        //},
        {
            data: 'firstName',
            title: 'ชื่อ',
            className: 'text-start',
            width: '150px'
        },
        {
            data: 'lastName',
            title: 'นามสกุล',
            className: 'text-start',
            width: '150px'
        },
        {
            data: 'roleGroupName',
            title: 'Role',
            className: 'text-start',
            orderable: false,
        },
        {
            data: 'departmentName',
            title: 'ชื่อศูนย์จัดการธนบัตร',
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
            width: '100px',
            orderable: false,
            searchable: false,
            className: 'text-center',
            render: function (_, __, value) {
                return `
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.userId}"
                        onclick="showViewPopup(${value.userId}, '${value.userName}',
                                            '${value.firstName}','${value.lastName}', '${value.userEmail}', 
                                            '${value.departmentName}', '${value.companyName}',  
                                            '${value.roleGroupNameList}',  
                                            '${value.startDate}','${value.endDate}',${value.isActive});"
                        data-toggle="tooltip" title="ดูข้อมูล">
                        <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" data-toggle="tooltip" title="แก้ไขข้อมูล" class="actionBtn btn btn-action" id="btnItemEdit_${value.userId}"
                        onclick="showEditPopup(${value.userId});">
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
    $('#search-user-from-bot').hide();
    $('#no-results').hide();
    $('#has-results').hide();
    $('#my-user-list').hide();
    $('#loadingSyncUserFromBot').hide();
    $('#search-user-loading').hide();

    initComponent();
    clearValidate();
    initInput();
});

$('#btnSearchUserFromBot').click(function (e) {


    if ($('#ddlCompany').val() == '') {
        $.sweetWarning({
            text: 'โปรดเลือกบริษัทก่อนทำการค้นหา'
        });

        $('#ddlCompany').addClass('is-invalid');

        return;
    }

    $('#ddlCompany').removeClass('is-invalid');

    if ($('#txtSearchUserFromBot').val().trim() == '') {
        $.sweetWarning({
            text: 'โปรดระบุ UserName เพื่อใช้ในการค้นหา'
        });

        $('#txtSearchUserFromBot').addClass('is-invalid');
        $('#txtSearchUserFromBot').focus();

        return;
    }

    $('#txtSearchUserFromBot').removeClass('is-invalid');

    $('#search-user-loading').show();

    var requestData = new Object();
    requestData.companyId = numeral($('#ddlCompany').val()).value();
    requestData.userNameInput = $('#txtSearchUserFromBot').val();

    $.requestAjax({
        service: 'MasterUser/SearchUserFromBotRegister',
        type: 'POST',
        parameter: requestData,
        enableLoader: false,
        onSuccess: function (response) {

            $('#my-user-list').find('li').remove().end()

            if (response.is_success == true && response.data != null && response.data.length > 0) {
                $.each(response.data, function (index, value) {
                    $('#my-user-list').append(`<li><a href="#" onclick="OnSelectItemUser('${value.registerId}','${value.firstName}','${value.lastName}','${value.email}','${value.logonName}');">${value.firstName} ${value.lastName}</a></li>`);
                });

                setTimeout(function () {
                    $('#search-user-from-bot').show();
                    //$('#no-results').show();
                    $('#my-user-list').show();
                    $('#has-results').show();
                    $('#search-user-loading').hide();
                }, 100);

            } else {
                setTimeout(function () {
                    $('#search-user-from-bot').show();
                    $('#no-results').show();
                    $('#my-user-list').hide();
                    $('#has-results').hide();
                    $('#search-user-loading').hide();
                }, 100);
            }
        }
    });

    //$('#my-user-list').find('li').remove().end()
    //$('#my-user-list').append(`<li><a href="#" onclick="OnSelectItemUser('วัฒนา กองแก้ว');">วัฒนา กองแก้ว</a></li>`);
    //$('#my-user-list').append(`<li><a href="#" onclick="OnSelectItemUser('วัฒนา ฮ่าฮ่า');">วัฒนา ฮ่าฮ่า</a></li>`);
    //$('#my-user-list').append(`<li><a href="#" onclick="OnSelectItemUser('วัฒนา สมสี');">วัฒนา สมสี</a></li>`);
    //setTimeout(function () {
    //    $('#search-user-from-bot').show();
    //    //$('#no-results').show();
    //    $('#my-user-list').show();
    //    $('#has-results').show();
    //    $('#search-user-loading').hide();
    //}, 4000);
});

$('#btnSyncUserFromBot').click(function (e) {

    $('#btnSyncUserFromBot').prop('disabled', true);
    $('#btnSyncUserFromBot').css('pointer-events', 'none');
    $('#loadingSyncUserFromBot').show();
    setTimeout(function () {
        $('#loadingSyncUserFromBot').hide();
        $('#btnSyncUserFromBot').prop('disabled', false);
        $('#btnSyncUserFromBot').css('pointer-events', 'auto');
    }, 8000);
});


function OnSelectItemUser(registerId, firstName, lastName, email, logonName) {

    $('#txtSearchUserFromBot').val(logonName);
    $('#txtUserFirstName').val(firstName);
    $('#txtUserLastName').val(lastName);
    $('#txtUserEmail').val(email);
    $('#rowUserNameSelected').val(registerId);
    $('#rowUsernameDisplay').val(logonName);

    $('#search-user-from-bot').hide();
}

$('#btnToggleFilter').click(function () {
    $("#filterDisplay").slideToggle();
});

function initComponent() {


    /*$('#ddlFilterStatus').select2({
        theme: "bootstrap-5",
        closeOnSelect: true
    });*/

    loadRoleLookup(function () {

        $('#ddlFilterUserRole').select2({
            theme: "bootstrap-5",
            closeOnSelect: true
        });

        $('#ddlUserRole').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#addOrEditItemModal'),
            closeOnSelect: true
        });

        $('#ddlUserRole').on('select2:unselecting', function (e) {
            $(this).data('unselecting', true);
        }).on('select2:opening', function (e) {
            if ($(this).data('unselecting')) {
                e.preventDefault();
                $(this).removeData('unselecting');
            }
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
    });
}

function clearValidate() {

    $('#txtUserFirstName').removeClass('is-invalid');
    $('#txtUserLastName').removeClass('is-invalid');
    $('#txtUserEmail').removeClass('is-invalid');
    $('#ddlDepartment').removeClass('is-invalid');
    $('#ddlUserRole').removeClass('is-invalid');
    $('#ddlCompany').removeClass('is-invalid');
    $('#txtEffectiveDateStart').removeClass('is-invalid');
    $('#txtEffectiveDateEnd').removeClass('is-invalid');
    $('#txtSearchUserFromBot').removeClass('is-invalid');

    $('#txtUserFirstName').removeClass('is-valid');
    $('#txtUserLastName').removeClass('is-valid');
    $('#txtUserEmail').removeClass('is-valid');
    $('#ddlDepartment').removeClass('is-valid');
    $('#ddlUserRole').removeClass('is-valid');
    $('#ddlCompany').removeClass('is-valid');

    $('#txtEffectiveDateStart').removeClass('is-valid');
    $('#txtEffectiveDateEnd').removeClass('is-valid');
    $('#txtSearchUserFromBot').removeClass('is-valid');
}

function initInput() {

    $('#txtUserFirstName').on('input', function () {
        $('#txtUserFirstName').removeClass('is-invalid');
        $('#txtUserFirstName').removeClass('is-valid');

        var selectedValue = $(this).val();
        if (selectedValue != '') {
            $('#txtUserFirstName').addClass('is-valid');
        }
    });

    $('#txtUserLastName').on('input', function () {
        $('#txtUserLastName').removeClass('is-invalid');
        $('#txtUserLastName').removeClass('is-valid');

        var selectedValue = $(this).val();
        if (selectedValue != '') {
            $('#txtUserLastName').addClass('is-valid');
        }
    });

    $('#txtUserEmail').on('input', function () {
        $('#txtUserEmail').removeClass('is-invalid');
        $('#txtUserEmail').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtUserEmail').addClass('is-valid');
        }
    });

    $('#txtEffectiveDateStart').on('change', function () {
        $('#txtEffectiveDateStart').removeClass('is-invalid');
        $('#txtEffectiveDateStart').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtEffectiveDateStart').addClass('is-valid');
        }
    });

    $('#txtEffectiveDateEnd').on('change', function () {
        $('#txtEffectiveDateEnd').removeClass('is-invalid');
        $('#txtEffectiveDateEnd').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtEffectiveDateEnd').addClass('is-valid');
        }
    });

    $('#ddlCompany').on('change', function () {
        $('#ddlCompany').removeClass('is-invalid');
        $('#ddlCompany').removeClass('is-valid');

        var selectedValue = $(this).val();
        if (selectedValue != '') {
            $('#ddlCompany').addClass('is-valid');
        }
    });

    $('#ddlDepartment').on('change', function () {
        $('#ddlDepartment').removeClass('is-invalid');
        $('#ddlDepartment').removeClass('is-valid');

        var selectedValue = $(this).val();
        if (selectedValue != '') {
            $('#ddlDepartment').addClass('is-valid');
        }
    });

    $('#ddlUserRole').on('change', function () {
        $('#ddlUserRole').removeClass('is-invalid');
        $('#ddlUserRole').removeClass('is-valid');

        var selectedValue = $(this).val();
        if (selectedValue != '') {
            $('#ddlUserRole').addClass('is-valid');
        }
    });

    $('#txtSearchUserFromBot').on('input', function () {
        $('#txtSearchUserFromBot').removeClass('is-invalid');
        $('#txtSearchUserFromBot').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtSearchUserFromBot').addClass('is-valid');
        }
    });

    $.datetimepicker.setLocale('th')

    jQuery('#txtEffectiveDateStart').datetimepicker({
        lang: 'th',
        yearOffset: 543,
        timepicker: false,
        format: 'd/m/Y'
    });

    jQuery('#txtEffectiveDateEnd').datetimepicker({
        lang: 'th',
        yearOffset: 543,
        timepicker: false,
        format: 'd/m/Y'
    });
}
/*
function setInitializationDatatable() {
    $('#dtUser').DataTable({
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
    $('#dtUser').on('mouseenter', '.actionBtn', function () {
        $(this).tooltip({
            title: $(this).data('tooltip-content'), // Get content from data attribute
            placement: 'top' // Position the tooltip
        }).tooltip('show');
    });

    $('#dtUser').on('mouseleave', '.actionBtn', function () {
        $(this).tooltip('hide');
    });
}
*/
/*
function loadRoleLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterRoleGroup/GetAllRoleGroupList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {


                var optionEmpty = '<option value="">...เลือก...</option>';
                var optionEmptyFilter = '<option value="">หั้งหมด</option>';

                $('#ddlFilterUserRole')
                    .find('option').remove().end()
                    .find('optgroup').remove().end();

                $('#ddlUserRole')
                    .find('option').remove().end()
                    .find('optgroup').remove().end();

                // Create the optgroup
                var $optgroupOperationsFilter = $("<optgroup>", { label: "Operations" });
                var $optgroupSupportFilter = $("<optgroup>", { label: "Support" });

                var $optgroupOperations = $("<optgroup>", { label: "Operations" });
                var $optgroupSupport = $("<optgroup>", { label: "Support" });

                $.each(response.data, function (index, value) {
                    //$('#ddlFilterUserRole').append(`<option value="${value.roleId}">${value.roleName}</option>`);

                    // Add options to the optgroup
                    //if (value.roleGroupName == 'Operator(Prepare,Reconcile)' || value.roleGroupName == 'Supervisor' || value.roleGroupName == 'Manager') {
                    if (value.roleGroupName == 'Operator' || value.roleGroupName == 'Supervisor' || value.roleGroupName == 'Manager') {
                        $optgroupOperations.append(`<option value="${value.roleGroupId}">${value.roleGroupName}</option>`);
                        $optgroupOperationsFilter.append(`<option value="${value.roleGroupId}">${value.roleGroupName}</option>`);
                    }
                    else {
                        $optgroupSupport.append(`<option value="${value.roleGroupId}">${value.roleGroupName}</option>`);
                        $optgroupSupportFilter.append(`<option value="${value.roleGroupId}">${value.roleGroupName}</option>`);
                    }
                });

                $('#ddlUserRole').append(optionEmpty, $optgroupOperations, $optgroupSupport);
                $('#ddlFilterUserRole').append(optionEmptyFilter, $optgroupOperationsFilter, $optgroupSupportFilter);
            }

            
        }
    });
}
*/


function loadRoleLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterRoleGroup/GetAllRoleGroupList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlUserRole')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $('#ddlFilterUserRole')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlUserRole').append(`<option value="${value.roleGroupId}">${value.roleGroupName}</option>`);
                    $('#ddlFilterUserRole').append(`<option value="${value.roleGroupId}">${value.roleGroupName}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}
function loadCompanyLookup(onSuccess) {

    //var requestData = new Object();
    //requestData.companyFilter = '';
    //requestData.statusFilter = '';

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

                $('#ddlDepartment')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $('#ddlFilterDepartment')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlDepartment').append(`<option value="${value.departmentId}">${value.departmentName}</option>`);
                    $('#ddlFilterDepartment').append(`<option value="${value.departmentId}">${value.departmentName}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}
/*
function loadUserData(onSuccess) {

    var requestData = new Object();
    requestData.companyFilter = $('#ddlFilterCompany').val();
    requestData.departmentFilter = $('#ddlFilterDepartment').val();
    requestData.roleFilter = $('#ddlFilterUserRole').val();
    requestData.statusFilter = $('#ddlFilterStatus').val();

    $.requestAjax({
        service: 'MasterUser/GetUserList',
        type: 'POST',
        parameter: requestData,
        enableLoader: false,
        onSuccess: function (response) {

            if ($.fn.DataTable.isDataTable('#dtUser')) {
                $('#dtUser').DataTable().destroy();
            }
            $('#drUser').empty();

            if (response.is_success == true) {

                if (response.data != null && response.data.length > 0) {
                    $.each(response.data, function (index, value) {

                        var actionDelete = `<td></td>`;
                        var tdStatus = `<td></td>`;

                        if (value.isActive) {

                            tdStatus = `<td class = "bss-text-center"><span class="badge badge-active">Active</span></td>`;
                        }
                        else {
                            tdStatus = `<td class = "bss-text-center"><span class="badge badge-inactive">In Active</span></td>`;
                        }

                        tdAction = `<td class="bss-text-center">
                                                 <button type="button" class="actionBtn btn btn-outline-secondary" id="btnItemView_${value.userId}"
                                                 onclick="showViewPopup(${value.userId}, '${value.firstName}', '${value.lastName}', ${value.isActive}, '${value.userEmail}', '${value.companyName}', '${value.departmentName}', '${value.roleGroupName}',${value.departmentId},${value.roleGroupId},${value.companyId},'${value.startDate}','${value.endDate}');"
                                                 data-toggle="tooltip" title="ดูข้อมูล" ><i class="bi bi-eye" fill="currentColor"></i>
                                                 </button>
                                                 <button type="button" data-toggle="tooltip" title="แก้ไขข้อมูล" class="actionBtn btn btn-outline-secondary" id="btnItemEdit_${value.userId}"
                                                 onclick="showEditPopup(${value.userId},${value.departmentId},${value.roleGroupId},${value.companyId});">
                                                 <i class="bi bi-pencil-square" fill="currentColor"></i>
                                                 </button>
                                             </td>`

                        var dataRow = `<tr>
                                            <td class="bss-text-left">${value.firstName} ${value.lastName}</td>
                                            <td class="bss-text-left">${value.roleGroupName}</td>
                                            <td class="bss-text-left">${value.companyName}</td>
                                            <td class="bss-text-left">${value.departmentName}</td>
                                            ${tdStatus}
                                            ${tdAction}
                                        </tr>`;

                        $('#drUser').append(dataRow);
                    });

                } else {

                    // $.sweetError({
                    //     text: 'ไม่พบข้อมูล'
                    // });
                }
            }
            else {
                $.sweetError({
                    text: 'Error Message : (' + response.msg_desc + ')'
                });
            }

            setTimeout(function () {
                setInitializationDatatable();
            }, 50);

            
        }
    });

}
*/
function LoadRoleFilterChange() {
    MasterDataTable.refresh();
}

function LoadDepartmentFilterChange() {
    MasterDataTable.refresh();
}

function LoadStatusFilterChange() {
    MasterDataTable.refresh();
}

function LoadCompanyFilterChange() {
    MasterDataTable.refresh();
}

function showViewPopup(userId, userName,
    firstName, lastName, userEmail,
    departmentName,
    roleGroupNameList,
    startDate, endDate, isActive) {


    $('#modeSave').val('view');
    $('#rowItemSelected').val(userId);


    $('#txtViewUserId').val(userId);
    $('#txtViewFullName').val(firstName + ' ' + lastName);
    $('#txtViewEmail').val(userEmail);
    $('#txtViewUserName').val(userName);
    $('#txtViewDepartment').val(departmentName);
    $('#txtViewRole').val(roleGroupNameList);

    $('#txtViewEffectiveDate').val(FormatThaiDate(startDate) + ' ถึง ' + FormatThaiDate(endDate));

    if (isActive) {
        $('#spanViewStatus').removeClass("badge-inactive");
        $('#spanViewStatus').addClass('badge-active');
        $('#spanViewStatus').text('Active');

    } else {
        $('#spanViewStatus').removeClass("badge-active");
        $('#spanViewStatus').addClass('badge-inactive');
        $('#spanViewStatus').text('In Active');
    }
    $('.hide-on-edit').hide();
    $('#ViewItemDetailModal').modal('show');
}

function showCreatePopup() {
    clearValidate();

    $('.hide-on-edit').show();
    $('#txtUserFirstName').val('');
    $('#txtUserLastName').val('');
    $('#txtUserEmail').val('');

    $('#ddlDepartment').val('').trigger('change');
    $('#ddlUserRole').val('').trigger('change');
    $('#ddlCompany').val('').trigger('change');

    $('#ddlCompany').prop('disabled', false);
    $('#ddlDepartment').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#rowDepartmentIdSelected').val('');
    $('#rowroleGroupIdSelected').val('');
    $('#rowCompanyIdSelected').val('');
    $('#rowUserNameSelected').val('');
    $('#rowUsernameDisplay').val('');
    $('#txtSearchUserFromBot').val('');

    $('#txtEffectiveDateStart').val('');
    $('#txtEffectiveDateEnd').val('');

    //$('#divHrEditDeleteUser').hide();
    $('#divEditDeleteUser').hide();
    $('#divSyncUserFromBot').hide();
    $('#divSearchUserFromBot').show();

    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('In Active');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(userId) {

    $('#modeSave').val('edit');
    $('#rowItemSelected').val(userId);


    $.requestAjax({
        service: 'MasterUser/GetUserById?id=' + userId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {


            console.log(JSON.stringify(response.data));
            $('#txtUserId').val(response.data.userId);
            $('#txtUserFirstName').val(response.data.firstName);
            $('#txtUserLastName').val(response.data.lastName);
            $('#txtUserEmail').val(response.data.userEmail);
            $('#ddlDepartment').val(response.data.departmentId).trigger('change');
            $('#ddlUserRole').val(response.data.roleGroupId).trigger('change');
            //$('#ddlCompany').val(companyId).trigger('change');

            //$('#ddlCompany').prop('disabled', true);
            $('#ddlDepartment').prop('disabled', true);

            $('#rowUserNameSelected').val(response.data.userName);

            //$('#divHrEditDeleteUser').show();
            $('#divEditDeleteUser').show();
            $('#divSyncUserFromBot').show();
            $('#divSearchUserFromBot').hide();

            $('#txtEffectiveDateStart').val(FormatThaiDate(response.data.startDate));
            $('#txtEffectiveDateEnd').val(FormatThaiDate(response.data.endDate));

            if (response.data.isActive) {
                $('#checkIsActive').prop('checked', true);
                $('#spanStatus').removeClass("badge-inactive");
                $('#spanStatus').addClass('badge-active');
                $('#spanStatus').text('Active');

            } else {
                $('#checkIsActive').prop('checked', false);
                $('#spanStatus').removeClass("badge-active");
                $('#spanStatus').addClass('badge-inactive');
                $('#spanStatus').text('In Active');
            }
            $('.hide-on-edit').hide();
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

$('#btnDeleteUser').click(function (e) {

    $('#ViewItemDetailModal').modal('hide');
    $('#confirmDeleteModal').modal('show');
});

$('#btnEditDeleteUser').click(function (e) {

    $('#addOrEditItemModal').modal('hide');
    $('#confirmDeleteModal').modal('show');
});

$('#btnConfirmDelete').click(function (e) {

    $('#confirmDeleteModal').modal('hide');

    setTimeout(function () {

        var requestData = new Object();
        requestData.userId = numeral($('#rowItemSelected').val()).value();
        //requestData.departmentId = numeral($('#rowDepartmentIdSelected').val()).value();
        //requestData.roleGroupId = numeral($('#rowroleGroupIdSelected').val()).value();

        $.requestAjax({
            service: 'MasterUser/DeleteUser',
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

    }, 300);
});


$('#checkIsActive').change(function () {
    if (this.checked) {
        $('#spanStatus').removeClass("badge-inactive");
        $('#spanStatus').addClass('badge-active');
        $('#spanStatus').text('Active');
    } else {
        $('#spanStatus').removeClass("badge-active");
        $('#spanStatus').addClass('badge-inactive');
        $('#spanStatus').text('In Active');
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
        createUser();
    } else {
        editUser();
    }
});

function createUser() {

    var requestData = new Object();

    requestData.departmentId = numeral($('#ddlDepartment').val()).value();
    requestData.roleGroupId = numeral($('#ddlUserRole').val()).value();
    requestData.userName = $('#txtSearchUserFromBot').val();
    requestData.userEmail = $('#txtUserEmail').val();
    requestData.firstName = $('#txtUserFirstName').val();
    requestData.lastName = $('#txtUserLastName').val();
    requestData.startDate = ParseThaiDate($('#txtEffectiveDateStart').val());
    requestData.endDate = ParseThaiDate($('#txtEffectiveDateEnd').val());
    requestData.usernameDisplay = $('#rowUsernameDisplay').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterUser/CreateUser',
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

function editUser() {
    var requestData = new Object();
    requestData.userId = numeral($('#rowItemSelected').val()).value();
    requestData.departmentId = numeral($('#ddlDepartment').val()).value();
    requestData.roleGroupId = numeral($('#ddlUserRole').val()).value(); 
    requestData.userName = $('#rowUserNameSelected').val();
    requestData.userEmail = $('#txtUserEmail').val();
    requestData.firstName = $('#txtUserFirstName').val();
    requestData.lastName = $('#txtUserLastName').val();
    requestData.startDate = ParseThaiDate($('#txtEffectiveDateStart').val());
    requestData.endDate = ParseThaiDate($('#txtEffectiveDateEnd').val());

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }
    console.log(JSON.stringify(requestData));
    $.requestAjax({
        service: 'MasterUser/UpdateUser',
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

    if ($('#txtUserFirstName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtUserFirstName').addClass('is-invalid');
    }

    if ($('#txtUserLastName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtUserLastName').addClass('is-invalid');
    }

    var inputEmail = $('#txtUserEmail');
    if (inputEmail.val() == '') {
        invalidCount = invalidCount + 1;
        inputEmail.addClass('is-invalid');
        inputEmail.siblings('.invalid-feedback').text('this field is required!');
    }

    if (!isValidEmail(inputEmail.val())) {
        invalidCount = invalidCount + 1;
        inputEmail.addClass('is-invalid');
        inputEmail.siblings('.invalid-feedback').text('this field is invalid!');
    }

    if ($('#ddlDepartment').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlDepartment').addClass('is-invalid');
    }

    if ($('#ddlUserRole').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlUserRole').addClass('is-invalid');
    }

    if ($('#txtEffectiveDateStart').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtEffectiveDateStart').addClass('is-invalid');
    }

    if ($('#txtEffectiveDateEnd').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtEffectiveDateEnd').addClass('is-invalid');
    }

    /*
    if ($('#ddlCompany').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlCompany').addClass('is-invalid');
    }
    */

    if (invalidCount > 0) {
        isValid = false;
        scrollToFirstInvalid($('#addOrEditItemModal'));
        return isValid;
    }

    return isValid;
}

// $(function () {
//     $('[data-toggle="tooltip"]').tooltip();
// });
