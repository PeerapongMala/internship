
//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterMachineType/SearchMachineType',
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
            data: 'machineTypeCode',
            title: 'รหัสประเภทเครื่องจักร',
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
            title: 'ดำเนินการ',
            width: '120px',
            orderable: false,
            searchable: false,
            className: 'text-center',
            render: function (_, __, value) {
                return `
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.machineTypeId}"
                                onclick="showViewPopup(${value.machineTypeId},
                                                        '${value.machineTypeCode}',
                                                        '${value.machineTypeName}',
                                                        ${value.isActive});"
                                data-toggle="tooltip" title="ดูข้อมูล" >
                                <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.machineTypeId}"
                                        onclick="showEditPopup(${value.machineTypeId});"
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
    $('#txtMachineTypeCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtMachineTypeCode').removeClass('is-invalid');
            $('#txtMachineTypeCode').addClass('is-valid');
        } else {
            $('#txtMachineTypeCode').removeClass('is-invalid');
            $('#txtMachineTypeCode').removeClass('is-valid');
        }
    });

    $('#txtMachineTypeName').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtMachineTypeName').removeClass('is-invalid');
            $('#txtMachineTypeName').addClass('is-valid');
        } else {
            $('#txtMachineTypeName').removeClass('is-invalid');
            $('#txtMachineTypeName').removeClass('is-valid');
        }
    });
}

function clearValidate() {
    $("#txtMachineTypeCode").removeClass("is-invalid");
    $("#txtMachineTypeName").removeClass("is-invalid");

    $('#txtMachineTypeCode').removeClass('is-valid');
    $('#txtMachineTypeName').removeClass('is-valid');
}
  

function showViewPopup(machineTypeId, machineTypeCode, machineTypeName, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(machineTypeId);

    $('#txtViewMachineTypeId').val(machineTypeId);
    $('#txtViewMachineTypeCode').val(machineTypeCode);
    $('#txtViewMachineTypeName').val(machineTypeName);

    if (isActive) {
        $('#spanViewStatus').removeClass("badge-inactive");
        $('#spanViewStatus').addClass('badge-active');
        $('#spanViewStatus').text('Active');

    } else {
        $('#spanViewStatus').removeClass("badge-active");
        $('#spanViewStatus').addClass('badge-inactive');
        $('#spanViewStatus').text('In Active');
    }

    $('#ViewItemDetailModal').modal('show');
}

function showCreatePopup() {
    clearValidate();

    $('#txtMachineTypeCode').val('');
    $('#txtMachineTypeName').val('');

    $('#txtMachineTypeCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('In Active');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(machineTypeId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(machineTypeId);

    $.requestAjax({
        service: 'MasterMachineType/GetMachineTypeById?id=' + machineTypeId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

           

                $('#txtMachineTypeCode').val(response.data.machineTypeCode).prop('disabled', true);
                $('#txtMachineTypeName').val(response.data.machineTypeName);

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
        createMachineType();
    } else {
        editMachineType();
    }
});

function validateSave() {
    var isValid = true;
    var invalidCount = 0;

    clearValidate();

    if ($('#txtMachineTypeCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtMachineTypeCode').addClass('is-invalid');
    }

    if ($('#txtMachineTypeName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtMachineTypeName').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}

function createMachineType() { 
    var requestData = new Object();
    requestData.machineTypeId = 0;
    requestData.machineTypeCode = $('#txtMachineTypeCode').val();
    requestData.machineTypeName = $('#txtMachineTypeName').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterMachineType/CreateMachineType',
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

function editMachineType() { 

    var requestData = new Object();
    requestData.machineTypeId = numeral($('#rowItemSelected').val()).value();
    requestData.machineTypeCode = $('#txtMachineTypeCode').val();
    requestData.machineTypeName = $('#txtMachineTypeName').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterMachineType/UpdateMachineType',
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
