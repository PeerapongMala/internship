/// <reference path="masterbanknotetype.js" />
//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterZoneCashPoint/SearchZoneCashPoint',
    height: '100%',
    buildFilter: function () {
        var isActiveVal = $('#ddlFilterStatus').val();
        let isActive = null;
        if (isActiveVal === "1") {
            isActive = true;
        } else if (isActiveVal === "0") {
            isActive = false;
        }

      

        var selZoneId = $('#ddlFilterZone').val();
        var selCashpointId = $('#ddlFilterCashpoint').val();
        return {
            zoneId: selZoneId ? parseInt(selZoneId, 10) : null,
            cashpointId: selCashpointId ? parseInt(selCashpointId, 10) : null,
            isActive: isActive
        };
    },
    columns: [
        {
            data: 'zoneCode',
            title: 'รหัส Zone',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'zoneName',
            title: 'ชื่อ Zone',
            className: 'text-start',
            width: '250px'
        },
        
        {
            data: 'cashpointName',
            title: 'ชื่อ Cashpoint',
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.ZoneCashpointId}"
                            onclick="showViewPopup(${value.zoneCashpointId},
                                                ${value.zoneId},
                                                '${value.zoneName}',
                                                ${value.cashpointId},
                                                '${value.cashpointName}',
                                                ${value.isActive});"
                            data-toggle="tooltip" title="ดูข้อมูล" >
                            <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.ZoneCashpointId}" 
                        onclick="showEditPopup(${value.zoneCashpointId})" 
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

    $('#ddlFilterStatus').select2({
        theme: "bootstrap-5",
        closeOnSelect: true,
        minimumResultsForSearch: 10
    });

    loadZoneLookup(function () {
        $('#ddlFilterZone').select2({
            theme: "bootstrap-5",
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });

        $('#ddlZone').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#addOrEditItemModal'),
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });

        loadCashpointLookup(function () {
            $('#ddlFilterCashpoint').select2({
                theme: "bootstrap-5",
                closeOnSelect: true,
                minimumResultsForSearch: 10
            });

            $('#ddlCashpoint').select2({
                theme: "bootstrap-5",
                dropdownParent: $('#addOrEditItemModal'),
                closeOnSelect: true,
                minimumResultsForSearch: 10
            });
             
           
        });
    });
}

function initInput() {
    $('#txtZoneId').on('input', function () {
        var selectedValue = $(this).val().trim();
        $('#txtZoneId').removeClass('is-invalid');
        $('#txtZoneId').removeClass('is-valid');

        if (selectedValue != '') {
            $('#txtZoneId').addClass('is-valid');
        }
    });

    $('#txtCashPointId').on('input', function () {
        var selectedValue = $(this).val().trim();
        $('#txtCashPointId').removeClass('is-invalid');
        $('#txtCashPointId').removeClass('is-valid');

        if (selectedValue != '') {
            $('#txtCashPointId').addClass('is-valid');
        }
    });
}

function clearValidate() {
    $("#txtZoneId").removeClass("is-invalid");
    $("#txtCashPointId").removeClass("is-invalid");
    $("#txtZoneId").removeClass("is-valid");
    $("#txtCashPointId").removeClass("is-valid");
}
 

function loadZoneLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterZone/GetZoneActiveList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlZone')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $('#ddlFilterZone')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlFilterZone').append(`<option value="${value.zoneId}">${value.zoneName}</option>`);
                    $('#ddlZone').append(`<option value="${value.zoneId}">${value.zoneName}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}

function loadCashpointLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterCashPoint/GetCashPointActiveList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {

            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlCashpoint')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $('#ddlFilterCashpoint')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlFilterCashpoint').append(`<option value="${value.cashpointId}">${value.cashpointName}</option>`);
                    $('#ddlCashpoint').append(`<option value="${value.cashpointId}">${value.cashpointName}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}
 


function LoadZoneFilterChange() {

    MasterDataTable.refresh();
}

function LoadCashpointFilterChange() {

    MasterDataTable.refresh();
}

function LoadStatusFilterChange() {

    MasterDataTable.refresh();

}

function showViewPopup(ZoneCashpointId, ZoneId, ZoneName, CashpointId, CashpointName, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(ZoneCashpointId);

    //$('#txtViewZoneCashpointId').val(ZoneCashpointId);
    $('#txtViewZoneName').val(ZoneName);
    $('#txtViewCashpointName').val(CashpointName);

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
    $('#txtZoneId').val('');
    $('#txtZoneId').val('');
    $('#txtCashPointId').val('');

    $('#txtZoneId').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(ZonCashpointId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(ZonCashpointId);
    console.log('ZonCashpointId:' + ZonCashpointId);
    $.requestAjax({
        service: 'MasterZoneCashPoint/GetZoneById?id=' + ZonCashpointId,
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {
            console.log(JSON.stringify(response));
             

                $('#ddlZone').val(response.data.zoneId).trigger('change');
                $('#ddlCashpoint').val(response.data.cashpointId).trigger('change');
                 
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
        createZoneCashpoint();
    } else {
        editZoneCashpoint();
    }
});

function createZoneCashpoint() {
    

    var requestData = new Object();
  
    requestData.ZoneId = $('#ddlZone').val();
    requestData.CashpointId = $('#ddlCashpoint').val();
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterZoneCashPoint/CreateZone',
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


function editZoneCashpoint() { 

    var requestData = new Object();
    requestData.ZoneCashpointId = numeral($('#rowItemSelected').val()).value();
    requestData.ZoneId = $('#ddlZone').val();
    requestData.CashpointId = $('#ddlCashpoint').val();
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }
    console.log(JSON.stringify(requestData));
    $.requestAjax({
        service: 'MasterZoneCashPoint/UpdateZone',
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

    if ($('#txtZoneId').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtZoneId').addClass('is-invalid');
    }

    if ($('#txtCashPointId').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtCashPointId').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}

