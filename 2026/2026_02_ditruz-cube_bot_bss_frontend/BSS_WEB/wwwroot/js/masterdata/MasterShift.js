
//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterShift/SearchShift',
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
            data: 'shiftCode',
            title: 'รหัสผลัดการทำงาน',
            className: 'text-start',
            width: '150px'
        },
        {
            data: 'shiftName',
            title: 'ชื่อผลัดการทำงาน',
            className: 'text-start',
        },
        {
            data: 'shiftStartTime',
            title: 'เวลาเริ่มต้นของผลัด',
            className: 'text-start',
        },
        {
            data: 'shiftEndTime',
            title: 'เวลาสิ้นสุดของผลัด',
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.shiftId}"
                            onclick="showViewPopup(${value.shiftId},
                                                '${value.shiftCode}',
                                                '${value.shiftName}',
                                                 ${value.isActive},
                                                '${value.shiftStartTime}',
                                                '${value.shiftEndTime}');"
                            data-toggle="tooltip" title="ดูข้อมูล" >
                            <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                            <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.shiftId}"
                                        onclick="showEditPopup(${value.shiftId});"
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
    $('#txtShiftCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtShiftCode').removeClass('is-invalid');
            $('#txtShiftCode').addClass('is-valid');
        } else {
            $('#txtShiftCode').removeClass('is-invalid');
            $('#txtShiftCode').removeClass('is-valid');
        }
    });

    $('#txtShiftName').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtShiftName').removeClass('is-invalid');
            $('#txtShiftName').addClass('is-valid');
        } else {
            $('#txtShiftName').removeClass('is-invalid');
            $('#txtShiftName').removeClass('is-valid');
        }
    });

    $('#txtShiftStartTime').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtShiftStartTime').removeClass('is-invalid');
            $('#txtShiftStartTime').addClass('is-valid');
        } else {
            $('#txtShiftStartTime').removeClass('is-invalid');
            $('#txtShiftStartTime').removeClass('is-valid');
        }
    });

    $('#txtShiftEndTime').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtShiftEndTime').removeClass('is-invalid');
            $('#txtShiftEndTime').addClass('is-valid');
        } else {
            $('#txtShiftEndTime').removeClass('is-invalid');
            $('#txtShiftEndTime').removeClass('is-valid');
        }
    });
}

function clearValidate() {
    $("#txtShiftCode").removeClass("is-invalid");
    $("#txtShiftName").removeClass("is-invalid");
    $("#txtShiftStartTime").removeClass("is-invalid");
    $("#txtShiftEndTime").removeClass("is-invalid");

    $('#txtShiftCode').removeClass('is-valid');
    $('#txtShiftName').removeClass('is-valid');
    $('#txtShiftStartTime').removeClass('is-valid');
    $('#txtShiftEndTime').removeClass('is-valid');
}
  

function showViewPopup(shiftId, shiftCode, shiftName, isActive, shiftStartTime, shiftEndTime) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(shiftId);

    $('#txtViewShiftId').val(shiftId);
    $('#txtViewShiftCode').val(shiftCode);
    $('#txtViewShiftName').val(shiftName);
    $('#txtViewShiftStartTime').val(shiftStartTime);
    $('#txtViewShiftEndTime').val(shiftEndTime);

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

    $('#txtShiftCode').val('');
    $('#txtShiftName').val('');
    $('#txtShiftStartTime').val('');
    $('#txtShiftEndTime').val('');

    //$('#txtShiftCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('In Active');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(shiftId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(shiftId);

    $.requestAjax({
        service: 'MasterShift/GetShiftById?id=' + shiftId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

         

                $('#txtShiftCode').val(response.data.shiftCode);
                $('#txtShiftName').val(response.data.shiftName);
                $('#txtShiftStartTime').val(response.data.shiftStartTime);
                $('#txtShiftEndTime').val(response.data.shiftEndTime);

                //$('#txtShiftCode').prop('disabled', true);

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
        createShift();
    } else {
        editShift();
    }
});



function validateSave() {
    var isValid = true;
    var invalidCount = 0;

    clearValidate();

    if ($('#txtShiftCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtShiftCode').addClass('is-invalid');
    }

    if ($('#txtShiftName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtShiftName').addClass('is-invalid');
    }

    if ($('#txtShiftStartTime').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtShiftStartTime').addClass('is-invalid');
    }

    if ($('#txtShiftEndTime').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtShiftEndTime').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}

function createShift() { 
    var requestData = new Object(); 
    requestData.shiftCode = $('#txtShiftCode').val();
    requestData.shiftName = $('#txtShiftName').val();
    requestData.shiftStartTime = $('#txtShiftStartTime').val();
    requestData.shiftEndTime = $('#txtShiftEndTime').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterShift/CreateShift',
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

function editShift() { 

    var requestData = new Object();
    requestData.shiftId = numeral($('#rowItemSelected').val()).value();
    requestData.shiftCode = $('#txtShiftCode').val();
    requestData.shiftName = $('#txtShiftName').val();
    requestData.shiftStartTime = $('#txtShiftStartTime').val();
    requestData.shiftEndTime = $('#txtShiftEndTime').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterShift/UpdateShift',
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
