
//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterCompany/SearchCompany',
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
            data: 'companyCode',
            title: 'รหัสบริษัท',
            className: 'text-start',
            width: '250px'
        },
        {
            data: 'companyName',
            title: 'ชื่อบริษัท',
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
                    <button type="button"
                        class="btn-action"
                        id="btnItemView_${value.companyId}"
                        onclick="showViewPopup(
                            ${value.companyId},
                            '${value.companyCode}',
                            '${value.companyName}',
                            ${value.isActive}
                        );"
                        data-toggle="tooltip"
                        title="ดูข้อมูล">
                        <i class="bi bi-eye"></i>
                    </button>

                    <button type="button"
                        class="btn-action"
                        id="btnItemEdit_${value.companyId}"
                        onclick="showEditPopup(${value.companyId})"
                        data-toggle="tooltip"
                        title="แก้ไขข้อมูล">
                        <i class="bi bi-pencil-square"></i>
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
    clearValidate();
    initInput();    
    initComponent();
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
    $('#txtCompanyCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        $('#txtCompanyCode').removeClass('is-invalid');
        $('#txtCompanyCode').removeClass('is-valid');

        if (selectedValue != '') {
            $('#txtCompanyCode').addClass('is-valid');
        }
    });

    $('#txtCompanyName').on('input', function () {
        var selectedValue = $(this).val().trim();
        $('#txtCompanyName').removeClass('is-invalid');
        $('#txtCompanyName').removeClass('is-valid');

        if (selectedValue != '') {
            $('#txtCompanyName').addClass('is-valid');
        }
    });
}

function clearValidate() {
    $("#txtCompanyCode").removeClass("is-invalid");
    $("#txtCompanyName").removeClass("is-invalid");
    $("#txtCompanyCode").removeClass("is-valid");
    $("#txtCompanyName").removeClass("is-valid");
}
 

function showViewPopup(companyId, companyCode, companyName, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(companyId);

    $('#txtViewCompanyId').val(companyId);
    $('#txtViewCompanyCode').val(companyCode);
    $('#txtViewCompanyName').val(companyName);

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
    $('#txtCompanyCode').val('');
    $('#txtCompanyName').val('');

    $('#txtCompanyCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(companyId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(companyId);

    $.requestAjax({
        service: 'MasterCompany/GetCompanyById?id=' + companyId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

             

                $('#txtCompanyCode').val(response.data.companyCode);
                $('#txtCompanyName').val(response.data.companyName);

                $('#txtCompanyCode').prop('disabled', true);

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
        createCompany();
    } else {
        editCompany();
    }
});

function createCompany() { 

    var requestData = new Object();
    requestData.companyId = 0;
    requestData.companyCode = $('#txtCompanyCode').val();
    requestData.companyName = $('#txtCompanyName').val();
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterCompany/CreateCompany',
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


function editCompany() { 

    var requestData = new Object();
    requestData.companyId = numeral($('#rowItemSelected').val()).value();
    requestData.companyCode = $('#txtCompanyCode').val();
    requestData.companyName = $('#txtCompanyName').val();
    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterCompany/UpdateCompany',
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

    if ($('#txtCompanyCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtCompanyCode').addClass('is-invalid');
    }

    if ($('#txtCompanyName').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtCompanyName').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}