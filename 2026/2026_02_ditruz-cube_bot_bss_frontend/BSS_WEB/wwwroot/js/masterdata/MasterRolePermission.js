
var checkMenuArr = [];
var menuItemSelected = [];
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
            roleGroupId: roleGroupId
        };
    },
    columns: [
        {
            data: 'roleGroupName',
            title: 'กลุ่มบทบาท',
            className: 'text-start',
            width: '250px'
        },
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.roleId}"
                        onclick="showViewPopup(${value.roleId},'${value.roleName}');"
                        data-toggle="tooltip" title="ดูข้อมูล" >
                        <i class="bi bi-eye" fill="currentColor"></i>
                   </button>
                   <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.roleId}"
                        onclick="showEditPopup(${value.roleId},'${value.roleName}');"
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



function initComponent() { 

    $('#btnToggleFilter').click(function () {
        $("#filterDisplay").slideToggle();
    });
    //$('#ddlFilterStatus').select2({
    //    theme: "bootstrap-5",
    //    closeOnSelect: true
    //});

    loadRoleGroupLookup(function () {
        $('#ddlFilterRoleGroup').select2({
            theme: "bootstrap-5",
            closeOnSelect: true,
            minimumResultsForSearch: 10
        }); 
          
    });

}

function initInput() {

   
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

                $.each(response.data, function (index, value) {
                    $('#ddlFilterRoleGroup').append(`<option value="${value.roleGroupId}">${value.roleGroupName}</option>`);                    
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}


function clearValidate() {
     
}
 
 

function LoadRoleGroupFilterChange() {

    MasterDataTable.refresh();
}
function LoadStatusFilterChange() {

    MasterDataTable.refresh();
}
 

function showViewPopup(roleId, roleName) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(roleId);
    $('#rowItemNameSelected').val(roleName);    
    

    $.requestAjax({
        service: 'MasterRolePermission/GetRolePermissionById?id=' + roleId,
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {
            var viewListOfMenuSelected = $('#ViewListOfMenuSelected');
            if (response.is_success == true && response.data != null) {

                viewListOfMenuSelected.find('li').remove().end();

                var menuListInfo = response.data;
                var parentMenuFilter = Enumerable.from(menuListInfo).where(function (x) { return x.parentMenuId == null; }).toArray();
                if (parentMenuFilter.length > 0) {
                    
                    $.each(parentMenuFilter, function (index, parentItem) {

                        var childMenuFilter = Enumerable.from(menuListInfo).where(function (child) { return child.parentMenuId == parentItem.menuId; }).toArray();

                        if (childMenuFilter.length > 0) {

                            var liParentItemMenu = `<li class="list-group-item list-group-item-secondary">
                                                   <i class="bi bi bi-card-checklist text-success">
                                                   </i>
                                                   ${parentItem.menuName}
                                                </li>`

                            viewListOfMenuSelected.append(liParentItemMenu);

                        }
                        else {

                            var liParentItemMenu = `<li class="list-group-item list-group-item-secondary">
                                                   <i class="bi bi bi-card-checklist text-success">
                                                   </i>
                                                   ${parentItem.menuName}
                                                </li>`

                            viewListOfMenuSelected.append(liParentItemMenu);

                            var liItemMenu = `<li class="list-group-item" style="padding-left: 40px !important;">
                                              <div class="ms-2 me-auto">
                                                   <div class="form-check">
                                                       <input class="form-check-input large-checkbox" type="checkbox" value="${parentItem.menuId}" disabled checked name="chkViewMenuItem" id="chkViewMenuItem_${parentItem.menuId}">
                                                       <label class="form-check-label" for="chkViewMenuItem_${parentItem.menuId}"> ${parentItem.menuName} </label>
                                                   </div>
                                               </div>
                                             </li>`;

                            viewListOfMenuSelected.append(liItemMenu);

                        }

                        $.each(childMenuFilter, function (index, childItem) {

                            var liItemMenu = `<li class="list-group-item" style="padding-left: 40px !important;">
                                              <div class="ms-2 me-auto">
                                                   <div class="form-check">
                                                       <input class="form-check-input large-checkbox" type="checkbox" value="${childItem.menuId}" disabled checked name="chkViewMenuItem" id="chkViewMenuItem_${childItem.menuId}">
                                                       <label class="form-check-label" for="chkViewMenuItem_${childItem.menuId}"> ${childItem.menuName} </label>
                                                   </div>
                                               </div>
                                             </li>`;

                            viewListOfMenuSelected.append(liItemMenu);
                        });
                    });
                } else {
                    viewListOfMenuSelected.append('<li style="padding-left: 40px !important;">ไม่พบข้อมูล</li>')
                }

                $('#labelViewRoleName').text('Role: ' + roleName);

                //if (isActive) {
                //    $('#spanViewStatus').removeClass("badge-inactive");
                //    $('#spanViewStatus').addClass('badge-active');
                //    $('#spanViewStatus').text('Active');

                //} else {
                //    $('#spanViewStatus').removeClass("badge-active");
                //    $('#spanViewStatus').addClass('badge-inactive');
                //    $('#spanViewStatus').text('In Active');
                //}

                $('#ViewItemDetailModal').modal('show');
            }
        }
    });
}
 
function showEditPopup(roleId,roleName) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(roleId);
    $('#rowItemNameSelected').val(roleName); 
    $('#labelEditRoleName').text('Role: ' + roleName);
    
    $.requestAjax({
        service: 'MasterMenu/GetMenuActiveList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null) {

                var menuListInfo = response.data;
                var menuRoleList = [];

                $.requestAjax({
                    service: 'MasterRolePermission/GetRolePermissionById?id=' + roleId,
                    type: 'GET',
                    enableLoader: false,
                    onSuccess: function (res) {

                        if (res.is_success == true && res.data != null) {

                           

                            menuRoleList = res.data;


                            $('#AddOrEditListOfMenu').find('li').remove().end();

                            var parentMenuFilter = Enumerable.from(menuListInfo).where(function (x) { return x.parentMenuId == null; }).toArray();
                            if (parentMenuFilter.length > 0) {

                                $.each(parentMenuFilter, function (index, parentItem) {

                                    var childMenuFilter = Enumerable.from(menuListInfo).where(function (child) { return child.parentMenuId == parentItem.menuId; }).toArray();

                                    if (childMenuFilter.length > 0) {

                                        var liParentItemMenu = `<li class="list-group-item list-group-item-secondary">
                                                   <i class="bi bi bi-card-checklist text-success">
                                                   </i>
                                                   ${parentItem.menuName}
                                                </li>`

                                        $('#AddOrEditListOfMenu').append(liParentItemMenu);

                                    }
                                    else {
                                        var existingParent = Enumerable.from(menuRoleList).where(function (chkParent) { return chkParent.menuId == parentItem.menuId; }).toArray();
                                        var checkStr = "";
                                        if (existingParent.length > 0) {
                                            checkStr = "checked";
                                        }

                                        var liParentItemMenu = `<li class="list-group-item list-group-item-secondary">
                                                   <i class="bi bi bi-card-checklist text-success">
                                                   </i>
                                                   ${parentItem.menuName}
                                                </li>`

                                        $('#AddOrEditListOfMenu').append(liParentItemMenu);

                                        var liItemMenu = `<li class="list-group-item" style="padding-left: 40px !important;">
                                              <div class="ms-2 me-auto">
                                                   <div class="form-check">
                                                       <input class="form-check-input large-checkbox" type="checkbox" value="${parentItem.menuId}" name="chkEditMenuItem" id="chkEditMenuItem_${parentItem.menuId}" ${checkStr}>
                                                       <label class="form-check-label" for="chkEditMenuItem_${parentItem.menuId}"> ${parentItem.menuName} </label>
                                                   </div>
                                               </div>
                                             </li>`;

                                        $('#AddOrEditListOfMenu').append(liItemMenu);

                                    }

                                    $.each(childMenuFilter, function (index, childItem) {

                                        var existingChild = Enumerable.from(menuRoleList).where(function (chk) { return chk.menuId == childItem.menuId; }).toArray();
                                        var checkStr = "";
                                        if (existingChild.length > 0) {
                                            checkStr = "checked";
                                        }

                                        var liItemMenu = `<li class="list-group-item" style="padding-left: 40px !important;">
                                              <div class="ms-2 me-auto">
                                                   <div class="form-check">
                                                       <input class="form-check-input large-checkbox" type="checkbox" value="${childItem.menuId}" name="chkEditMenuItem" id="chkEditMenuItem_${childItem.menuId}" ${checkStr}>
                                                       <label class="form-check-label" for="chkEditMenuItem_${childItem.menuId}"> ${childItem.menuName} </label>
                                                   </div>
                                               </div>
                                             </li>`;

                                        $('#AddOrEditListOfMenu').append(liItemMenu);
                                    });
                                });
                            }

                            clearValidate();
                            $('#titleModalLabel').text('แก้ไขข้อมูล');
                            $('#addOrEditItemModal').modal('show');

                        }
                    }
                });
            }
        }
    });
}

$('#btnEditDetail').click(function (e) {

    $('#ViewItemDetailModal').modal('hide');
    showEditPopup(numeral($('#rowItemSelected').val(), $('#rowItemNameSelected').val()).value());
});

//$('#checkIsActive').change(function () {
//    if (this.checked) {
//        $('#spanStatus').removeClass("badge-inactive");
//        $('#spanStatus').addClass('badge-active');
//        $('#spanStatus').text('Active');
//    } else {
//        $('#spanStatus').removeClass("badge-active");
//        $('#spanStatus').addClass('badge-inactive');
//        $('#spanStatus').text('In Active');
//    }
//});

$('#btnSave').click(function (e) {
    if (validateSave()) {

        checkMenuArr = [];


        if ($('#modeSave').val() == "add") {
            $.each($("input[name='chkAddMenuItem']:checked"), function () {
                checkMenuArr.push($(this).val());
            });
        } else {
            $.each($("input[name='chkEditMenuItem']:checked"), function () {
                checkMenuArr.push($(this).val());
            });
        }

        if (checkMenuArr.length > 0) {

            $('#confirmSaveModal').modal('show');
            $('#addOrEditItemModal').modal('hide');
        }
        else {
            console.log(checkMenuArr);
             $.sweetError({
                 text: 'กรุณาเลือกเมนูอย่างน้อย 1 รายการ'
             });
            return;
        }
    }
});

$('#btnConfirmClose').click(function (e) {
    $('#confirmSaveModal').modal('hide');
    $('#addOrEditItemModal').modal('show');
});

$('#btnConfirmSave').click(function (e) {
    $('#confirmSaveModal').modal('hide');

    //if ($('#modeSave').val() == "add") {
    //    createRolePermission();
    //} else {
        editRolePermission();
    //}
});

/*
function createRolePermission() {
   
    menuItemSelected = [];
    $.each($("input[name='chkAddMenuItem']:checked"), function () {
        menuItemSelected.push({
            menuId: numeral($(this).val()).value()
        });
    });

    if (menuItemSelected.length > 0) {

        $.enablePageLoader();

        var requestData = new Object();
        requestData.roleId = numeral($('#ddlRole').val()).value();
        requestData.menuItemSelected = menuItemSelected;
        requestData.isActive = true;

        //if ($('#checkIsActive').is(':checked')) {
        //    requestData.isActive = true;
        //} else {
        //    requestData.isActive = false;
        //}

        $.requestAjax({
            service: 'MasterRolePermission/CreateRolePermission',
            type: 'POST',
            parameter: requestData,
            enableLoader: false,
            onSuccess: function (response) {
                if (response.is_success == true) {
                    $.sweetSuccess({
                        text: 'บันทึกข้อมูลสำเร็จ'
                    });

                    loadRolePermissionData(function () {
                        $.disablePageLoader();
                    });

                } else {
                    $.sweetError({
                        text: response.msg_code + " : " + response.msg_desc
                    });

                    setTimeout(function () {
                        $.disablePageLoader();
                    }, 50);
                }
            }
        });
    }
    else {

        $.sweetError({
            text: 'กรุณาเลือกเมนูอย่างน้อย 1 รายการ'
        });
        return;
    }
}

*/
function editRolePermission() {
    menuItemSelected = [];
    $.each($("input[name='chkEditMenuItem']:checked"), function () {
        menuItemSelected.push({
            menuId: numeral($(this).val()).value()
        });
    });

    if (menuItemSelected.length > 0) {

         

        var requestData = new Object();
        requestData.roleId = numeral($('#rowItemSelected').val()).value();
        requestData.menuItemSelected = menuItemSelected;
        requestData.isActive = true;

        //if ($('#checkIsActive').is(':checked')) {
        //    requestData.isActive = true;
        //} else {
        //    requestData.isActive = false;
        //}
        console.log(JSON.stringify(requestData));

        $.requestAjax({
            service: 'MasterRolePermission/UpdateRolePermission',
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
    else {

        $.sweetError({
            text: 'กรุณาเลือกเมนูอย่างน้อย 1 รายการ'
        });
        return;
    }
}

function validateSave() {
    var isValid = true;
    var invalidCount = 0;

    clearValidate();

  

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}
