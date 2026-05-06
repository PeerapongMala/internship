//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterMenu/SearchMenu',
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
            data: 'menuId',
            title: 'รหัสเมนู',
            className: 'text-start',
            width: '50px'
        },        
        {
            data: 'menuName',
            title: 'ชื่อเมนู',
            className: 'text-start',
            width: '250px'
        },
        {
            data: 'controllerName',
            title: 'Controller Name',
            className: 'text-start',
        },
        {
            data: 'actionName',
            title: 'Action Name',
            className: 'text-start',
        },
        {
            data: 'parentMenuId',
            title: 'รหัสเมนูหลัก',
            className: 'text-start',
            width: '50px'
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
                      <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.menuId}"
                                onclick="showViewPopup(${value.menuId},
                                                    '${value.menuName}',
                                                    '${value.menuPath}',
                                                    ${value.displayOrder},
                                                    '${value.controllerName}',
                                                    '${value.actionName}',
                                                    ${value.isActive},
                                                    ${value.parentMenuId});"
                        data-toggle="tooltip" title="ดูข้อมูล" >
                        <i class="bi bi-eye" fill="currentColor"></i>
                        </button>
                                <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.menuId}"
                                    onclick="showEditPopup(${value.menuId});"
                                    data-toggle="tooltip" title="แก้ไขข้อมูล">
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
}

function initInput() {
    $('#txtMenuName').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtMenuName').removeClass('is-invalid');
            $('#txtMenuName').addClass('is-valid');
        } else {
            $('#txtMenuName').removeClass('is-invalid');
            $('#txtMenuName').removeClass('is-valid');
        }
    });


}

function LoadStatusFilterChange() {

    MasterDataTable.refresh();
}

function clearValidate() {
    $("#txtMenuName").removeClass("is-invalid");
    $("#txtMenuPath").removeClass("is-invalid");
    $("#txtDisplayOrder").removeClass("is-invalid");
    $("#txtControllerName").removeClass("is-invalid");
    $("#txtActionName").removeClass("is-invalid");
    $("#parentMenuId").removeClass("is-invalid");

    $('#txtMenuName').removeClass('is-valid');
    $('#txtMenuPath').removeClass('is-valid');
    $('#txtDisplayOrder').removeClass('is-valid');
    $('#txtControllerName').removeClass('is-valid');
    $('#txtActionName').removeClass('is-valid');
    $('#parentMenuId').removeClass('is-valid');

}

function initialTooltip() {
     
    // Initialize tooltips for buttons within the datatable
    $('#dtMenuLists').on('mouseenter', '.actionBtn', function () {
        $(this).tooltip({
            title: $(this).data('tooltip-content'), // Get content from data attribute
            placement: 'top' // Position the tooltip
        }).tooltip('show');
    });

    $('#dtMenuLists').on('mouseleave', '.actionBtn', function () {
        $(this).tooltip('hide');
    });
}
 

function showViewPopup(menuId, menuName, menuPath, displayOrder, controllerName, actionName, isActive, parentMenuId) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(menuId);

    $('#txtViewMenuId').val(menuId);
    $('#txtViewMenuName').val(menuName);
    $('#txtViewMenuPath').val(menuPath);
    $('#txtViewDisplayOrder').val(displayOrder);
    $('#txtViewControllerName').val(controllerName);
    $('#txtViewActionName').val(actionName);
    $('#txtViewParentMenuId').val(parentMenuId == null ? '': parentMenuId );

    
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

    $('#txtMenuName').val('');
    $('#txtMenuPath').val('');
    $('#txtDisplayOrder').val('');
    $('#txtControllerName').val('');
    $('#txtActionName').val('');
    $('#txtParentMenuId').val('');

    $('#txtMenuName').prop('disabled', false);
    $('#txtParentMenuId').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(menuId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(menuId);

    $.requestAjax({
        service: 'MasterMenu/GetMenuById?id=' + menuId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

          

                $('#txtMenuName').val(response.data.menuName);
                $('#txtMenuPath').val(response.data.menuPath);
                $('#txtDisplayOrder').val(response.data.displayOrder);
                $('#txtControllerName').val(response.data.controllerName);
                $('#txtActionName').val(response.data.actionName);
                $('#txtParentMenuId').val(response.data.parentMenuId);
                
                //$('#txtMenuName').prop('disabled', true);
                //$('#txtParentMenuId').prop('disabled', true);

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
        createMenu();
    } else {
        editMenu();
    }
});



function validateSave() {
    var isValid = true;
    var invalidCount = 0;

    clearValidate();

    if ($('#txtMenuName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtMenuName').addClass('is-invalid');
    }

    if ($('#txtMenuPath').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtMenuPath').addClass('is-invalid');
    }

    const value = $('#txtDisplayOrder').val().trim();
    const number = Number(value);

    if (value) {
        if (!Number.isInteger(number) || number <= 0 || number > 9999) {
            invalidCount++;
            $('#txtDisplayOrder').addClass('is-invalid');
            var wrapper = $('#txtDisplayOrder').closest('div');
            $('.invalid-feedback', wrapper).text('this field is invalid!');
        }
    } else {
        invalidCount++;
        $('#txtDisplayOrder').addClass('is-invalid');
        var wrapper = $('#txtDisplayOrder').closest('div');
        $('.invalid-feedback', wrapper).text('this field is required!');
    }
    /*
    if ($('#txtDisplayOrder').val() === '' || parseInt($('#txtDisplayOrder').val()) < 1) {
        invalidCount++;
        $('#txtDisplayOrder').addClass('is-invalid');
    }
    */


    if ($('#txtControllerName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtControllerName').addClass('is-invalid');
    }

    if ($('#txtActionName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtActionName').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}

$('#txtDisplayOrder').on('input', function () {
    if (parseInt(this.value) < 0) {
        this.value = 1;
    }
});

function createMenu() { 
    var requestData = new Object(); 
    requestData.menuName = $('#txtMenuName').val();
    requestData.menuPath = $('#txtMenuPath').val();
    requestData.displayOrder = $('#txtDisplayOrder').val();
    requestData.controllerName = $('#txtControllerName').val();
    requestData.actionName = $('#txtActionName').val();
    var parentMenuVal = $('#txtParentMenuId').val();
    requestData.parentMenuId = parentMenuVal ? parseInt(parentMenuVal) : null;

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterMenu/CreateMenu',
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

function editMenu() { 

    var requestData = new Object();
    requestData.menuId = numeral($('#rowItemSelected').val()).value();
    requestData.menuName = $('#txtMenuName').val();
    requestData.menuPath = $('#txtMenuPath').val();
    requestData.displayOrder = $('#txtDisplayOrder').val();
    requestData.controllerName = $('#txtControllerName').val();
    requestData.actionName = $('#txtActionName').val();
    var parentMenuVal = $('#txtParentMenuId').val();
    requestData.parentMenuId = parentMenuVal ? parseInt(parentMenuVal) : null;

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterMenu/UpdateMenu',
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
