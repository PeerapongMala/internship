
//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterStatus/SearchStatus',
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
            data: 'statusCode',
            title: 'รหัสสถานะ',
            className: 'text-start',
            width: '150px'
        },
        {
            data: 'statusNameTh',
            title: 'ชื่อของสถานะ (ภาษาไทย)',
            className: 'text-start',
        },
        {
            data: 'statusNameEn',
            title: 'ชื่อของสถานะ (ภาษาอังกฤษ)',
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.statusId}"
                                    onclick="showViewPopup(${value.statusId},
                                        '${value.statusCode}',
                                        '${value.statusNameTh}',
                                        '${value.statusNameEn}',
                                        ${value.isActive});"
                    data-toggle="tooltip" title="ดูข้อมูล" >
                    <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                                    <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.statusId}"
                                                onclick="showEditPopup(${value.statusId});"
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
    $('#txtStatusCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtStatusCode').removeClass('is-invalid');
            $('#txtStatusCode').addClass('is-valid');
        } else {
            $('#txtStatusCode').removeClass('is-invalid');
            $('#txtStatusCode').removeClass('is-valid');
        }
    });

    $('#txtStatusNameTh').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtStatusNameTh').removeClass('is-invalid');
            $('#txtStatusNameTh').addClass('is-valid');
        } else {
            $('#txtStatusNameTh').removeClass('is-invalid');
            $('#txtStatusNameTh').removeClass('is-valid');
        }
    });

    $('#txtStatusNameEn').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtStatusNameEn').removeClass('is-invalid');
            $('#txtStatusNameEn').addClass('is-valid');
        } else {
            $('#txtStatusNameEn').removeClass('is-invalid');
            $('#txtStatusNameEn').removeClass('is-valid');
        }
    });
}

function clearValidate() {
    $("#txtStatusCode").removeClass("is-invalid");
    $("#txtStatusNameTh").removeClass("is-invalid");
    $("#txtStatusNameEn").removeClass("is-invalid");

    $('#txtStatusCode').removeClass('is-valid');
    $('#txtStatusNameTh').removeClass('is-valid');
    $('#txtStatusNameEn').removeClass('is-valid');
}
 

function showViewPopup(statusId, statusCode, statusNameTh, statusNameEn, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(statusId);

    //$('#txtViewStatusId').val(statusId);
    $('#txtViewStatusCode').val(statusCode);
    $('#txtViewStatusNameTh').val(statusNameTh);
    $('#txtViewStatusNameEn').val(statusNameEn);

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

    $('#txtStatusCode').val('');
    $('#txtStatusNameTh').val('');
    $('#txtStatusNameEn').val('');

    //$('#txtStatusCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('In Active');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(statusId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(statusId);

    $.requestAjax({
        service: 'MasterStatus/GetStatusById?id=' + statusId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

             

                $('#txtStatusCode').val(response.data.statusCode);//.prop('disabled', true);
                $('#txtStatusNameTh').val(response.data.statusNameTh);
                $('#txtStatusNameEn').val(response.data.statusNameEn);

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
        createStatus();
    } else {
        editStatus();
    }
});

function validateSave() {
    var isValid = true;
    var invalidCount = 0;

    clearValidate();

    if ($('#txtStatusCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtStatusCode').addClass('is-invalid');
    }

    if ($('#txtStatusNameTh').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtStatusNameTh').addClass('is-invalid');
    }

    if ($('#txtStatusNameEn').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtStatusNameEn').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}

function createStatus() { 
    var requestData = new Object(); 
    requestData.statusCode = $('#txtStatusCode').val();
    requestData.statusNameTh = $('#txtStatusNameTh').val();
    requestData.statusNameEn = $('#txtStatusNameEn').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterStatus/CreateStatus',
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

function editStatus() { 

    var requestData = new Object();
    requestData.statusId = numeral($('#rowItemSelected').val()).value();
    requestData.statusCode = $('#txtStatusCode').val();
    requestData.statusNameTh = $('#txtStatusNameTh').val();
    requestData.statusNameEn = $('#txtStatusNameEn').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterStatus/UpdateStatus',
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
