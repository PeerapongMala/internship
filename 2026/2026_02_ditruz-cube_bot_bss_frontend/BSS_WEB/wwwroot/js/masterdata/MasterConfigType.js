//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterConfigType/SearchConfigType',
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
            data: 'configTypeCode',
            title: 'รหัสประเภทการการตั้งค่า',
            className: 'text-start',
            width: '250px'
        },
        {
            data: 'configTypeDesc',
            title: 'คำอธิบายประเภทการการตั้งค่า',
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.configTypeId}"
                            onclick="showViewPopup(${value.configTypeId},
                                                    '${value.configTypeCode}',
                                                    ${value.isActive},
                                                    '${value.configTypeDesc}');"
                    data-toggle="tooltip" title="ดูข้อมูล" >
                    <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                            <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.configTypeId}"
                                onclick="showEditPopup(${value.configTypeId});"
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
    $('#txtConfigTypeCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtConfigTypeCode').removeClass('is-invalid');
            $('#txtConfigTypeCode').addClass('is-valid');
        } else {
            $('#txtConfigTypeCode').removeClass('is-invalid');
            $('#txtConfigTypeCode').removeClass('is-valid');
        }
    });

    $('#txtConfigTypeDescription').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtConfigTypeDescription').removeClass('is-invalid');
            $('#txtConfigTypeDescription').addClass('is-valid');
        } else {
            $('#txtConfigTypeDescription').removeClass('is-invalid');
            $('#txtConfigTypeDescription').removeClass('is-valid');
        }
    });

}

function clearValidate() {
    $("#txtConfigTypeCode").removeClass("is-invalid");
    $("#txtConfigTypeDescription").removeClass("is-invalid");

    $('#txtConfigTypeCode').removeClass('is-valid');
    $('#txtConfigTypeDescription').removeClass('is-valid');
}
 
 

function showViewPopup(configTypeId, configTypeCode, isActive, configTypeDesc) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(configTypeId);

    $('#txtViewConfigTypeId').val(configTypeId);
    $('#txtViewConfigTypeCode').val(configTypeCode);
    $('#txtViewConfigTypeDescription').val(configTypeDesc);

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

    $('#txtConfigTypeCode').val('');
    $('#txtConfigTypeDescription').val('');

    $('#txtConfigTypeCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(configTypeId) {
    console.log('showEditPopup(' + configTypeId + ')');
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(configTypeId);

    $.requestAjax({
        service: 'MasterConfigType/GetConfigTypeById?id=' + configTypeId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {
             
                $('#txtConfigTypeCode').val(response.data.configTypeCode);
                $('#txtConfigTypeDescription').val(response.data.configTypeDesc);

                $('#txtConfigTypeCode').prop('disabled', true);

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
        createConfigType();
    } else {
        editConfigType();
    }
});



function validateSave() {
    var isValid = true;
    var invalidCount = 0;

    clearValidate();

    if ($('#txtConfigTypeCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtConfigTypeCode').addClass('is-invalid');
    }

    if ($('#txtConfigTypeDescription').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtConfigTypeDescription').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}

function createConfigType() {
   
    var requestData = new Object();
    requestData.configTypeId = 0;
    requestData.configTypeCode = $('#txtConfigTypeCode').val();
    requestData.configTypeDesc = $('#txtConfigTypeDescription').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterConfigType/CreateConfigType',
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

function editConfigType() {
     
    var requestData = new Object();
    requestData.configTypeId = numeral($('#rowItemSelected').val()).value();
    requestData.configTypeCode = $('#txtConfigTypeCode').val();
    requestData.configTypeDesc = $('#txtConfigTypeDescription').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterConfigType/UpdateConfigType',
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