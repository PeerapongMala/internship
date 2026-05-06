//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterConfig/SearchConfig',
    height: '100%',
    buildFilter: function () {
        var isActiveVal = $('#ddlFilterStatus').val();
        let isActive = null;

        var selConfigType = $('#ddlFilterConfigType').val();
        if (isActiveVal === "1") {
            isActive = true;
        } else if (isActiveVal === "0") {
            isActive = false;
        }
        return {
            isActive: isActive,
            configTypeId: selConfigType ? parseInt(selConfigType, 10) : null,
        };
    },
    columns: [
        
        {
            data: 'configTypeDesc',
            title: 'ประเภทการการตั้งค่า',
            className: 'text-start',
            width: '250px'
        },
        {
            data: 'configCode',
            title: 'รหัสการตั้งค่า',
            className: 'text-start',
            width: '150px'
        },
        {
            data: 'configValue',
            title: 'ค่า Config',
            className: 'text-start',
            width: '150px'
        },
        {
            data: 'configDesc',
            title: 'รายละเอียดการตั้งค่า',
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
                     <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.configId}"
                            onclick="showViewPopup(${value.configId},
                                                    '${value.configTypeId}',
                                                    '${value.configCode}',
                                                    '${value.configValue}',
                                                            '${value.configDesc}',
                                                    ${value.isActive}
                            );"
                        data-toggle="tooltip" title="ดูข้อมูล">
                        <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                            <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.configId}"
                                        onclick="showEditPopup(${value.configId},${value.configTypeId});"
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

$('#btnToggleFilter').click(function () {
    $("#filterDisplay").slideToggle();
});

function initComponent() { 

    $('#ddlFilterStatus').select2({
        theme: "bootstrap-5",
        closeOnSelect: true,
        minimumResultsForSearch: 10
    });

    loadConfigTypeLookup(function () {

        $('#ddlFilterConfigType').select2({
            theme: "bootstrap-5",
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });
        $('#ddlConfigType').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#addOrEditItemModal'),
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });

         
    });
}

function initInput() {
    $('#txtConfigCode').on('input', function () {
        $('#txtConfigCode').removeClass('is-invalid');
        $('#txtConfigCode').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtConfigCode').addClass('is-valid');
        }
    });

    $('#txtConfigValue').on('input', function () {
        $('#txtConfigValue').removeClass('is-invalid');
        $('#txtConfigValue').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtConfigValue').addClass('is-valid');
        }
    });

    $('#txtConfigDescription').on('input', function () {
        $('#txtConfigDescription').removeClass('is-invalid');
        $('#txtConfigDescription').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtConfigDescription').addClass('is-valid');
        }
    });

    $('#ddlConfigType').on('change', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#ddlConfigType').removeClass('is-invalid');
            $('#ddlConfigType').addClass('is-valid');
        } else {
            $('#ddlConfigType').removeClass('is-invalid');
            $('#ddlConfigType').removeClass('is-valid');
        }
    });

}

function clearValidate() {
    $("#txtConfigCode").removeClass("is-invalid");
    $("#txtConfigValue").removeClass("is-invalid");
    $("#txtConfigDescription").removeClass("is-invalid");
    $("#ddlConfigType").removeClass("is-invalid");

    $("#txtConfigCode").removeClass("is-valid");
    $("#txtConfigValue").removeClass("is-valid");
    $("#txtConfigDescription").removeClass("is-valid");
    $("#ddlConfigType").removeClass("is-valid");
}

function setInitializationDatatable() {
    $('#dtConfigLists').DataTable({
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

     
}

function loadConfigTypeLookup(onSuccess) {
    var requestData = new Object();
    requestData.configTypeFilter = '';
    requestData.statusFilter = '';

    $.requestAjax({
        service: 'MasterConfigType/GetConfigTypeList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlConfigType')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $('#ddlFilterConfigType')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlFilterConfigType').append(`<option value="${value.configTypeId}">${value.configTypeDesc}</option>`);
                    $('#ddlConfigType').append(`<option value="${value.configTypeId}">${value.configTypeDesc}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}
  

function LoadConfigTypeFilterChange() {
    MasterDataTable.refresh();
}

function LoadStatusFilterChange() {
    MasterDataTable.refresh();
}

function showViewPopup(configId, configTypeId, configCode, configValue, configDesc, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(configId);
    $('#rowConfigTypeIdSelected').val(configTypeId);


    $('#txtViewConfigId').val(configId);
    $('#txtViewConfigTypeId').val(configTypeId);
    $('#txtViewConfigCode').val(configCode);
    $('#txtViewConfigValue').val(configValue);
    $('#txtViewConfigDescription').val(configDesc);

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
    $('#txtConfigCode').val('');
    $('#txtConfigValue').val('');
    $('#txtConfigDescription').val('');
    $('#ddlConfigType').val('').trigger('change');;

    $('#txtConfigCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(configId, configTypeId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(configId);
    $('#rowConfigTypeIdSelected').val(configTypeId);

    $.requestAjax({
        service: 'MasterConfig/GetConfigById?id=' + configId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

             

                $('#txtConfigTypeId').val(response.data.configTypeId);
                $('#txtConfigCode').val(response.data.configCode);
                $('#txtConfigValue').val(response.data.configValue);
                $('#txtConfigDescription').val(response.data.configDesc);
                $('#ddlConfigType').val(response.data.configTypeId).trigger('change');

                $('#txtConfigCode').prop('disabled', false);

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
    showEditPopup(numeral($('#rowItemSelected').val()).value(), numeral($('#rowConfigTypeIdSelected').val()).value());
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
        createConfig();
    } else {
        editConfig();
    }
});

function createConfig() {
     
    var requestData = new Object();
    requestData.configId = 0;
    requestData.configTypeId = numeral($('#ddlConfigType').val()).value();
    requestData.configCode = $('#txtConfigCode').val();
    requestData.configValue = $('#txtConfigValue').val();
    requestData.configDesc = $('#txtConfigDescription').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterConfig/CreateConfig',
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

function editConfig() { 

    var requestData = new Object();
    requestData.configId = numeral($('#rowItemSelected').val()).value();
    requestData.configTypeId = numeral($('#ddlConfigType').val()).value();
    requestData.configCode = $('#txtConfigCode').val();
    requestData.configValue = $('#txtConfigValue').val();
    requestData.configDesc = $('#txtConfigDescription').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterConfig/UpdateConfig',
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

    if ($('#ddlConfigType').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlConfigType').addClass('is-invalid');
    }

    if ($('#txtConfigCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtConfigCode').addClass('is-invalid');
    }

    if ($('#txtConfigValue').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtConfigValue').addClass('is-invalid');
    }

    if ($('#txtConfigDescription').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtConfigDescription').addClass('is-invalid');
    }

    if ($('#ddlConfigType').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlConfigType').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}