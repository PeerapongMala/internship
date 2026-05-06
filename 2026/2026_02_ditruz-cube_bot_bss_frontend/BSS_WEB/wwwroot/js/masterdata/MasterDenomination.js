//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterDenomination/SearchDenomination',
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
            data: 'denominationCode',
            title: 'รหัสชนิดราคาธนบัตร',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'denominationPrice',
            title: 'ราคาของธนบัตร',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'denominationDesc',
            title: 'คำอธิบายชนิดราคาธนบัตร',
            className: 'text-start', 
        },
        {
            data: 'denominationCurrency',
            title: 'สกุลเงินของธนบัตร',
            className: 'text-start',
            width: '200px'
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.denominationId}" 
                            onclick="showViewPopup(${value.denominationId}, 
                                                '${value.denominationCode}', 
                                                '${value.denominationPrice}', 
                                                '${value.denominationDesc}', 
                                                ${value.isActive}, 
                                                '${value.denominationCurrency}');"
                        data-toggle="tooltip" title="ดูข้อมูล" >
                        <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.denominationId}" 
                        onclick="showEditPopup(${value.denominationId});"
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
    $('#txtDenominationCode').on('input', function () {
        $('#txtDenominationCode').removeClass('is-invalid');
        $('#txtDenominationCode').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtDenominationCode').addClass('is-valid');
        }
    });

    $('#txtDenominationPrice').on('input', function () {
        $('#txtDenominationPrice').removeClass('is-invalid');
        $('#txtDenominationPrice').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtDenominationPrice').addClass('is-valid');
        }
    });

    $('#txtDenominationDesc').on('input', function () {
        $('#txtDenominationDesc').removeClass('is-invalid');
        $('#txtDenominationDesc').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtDenominationDesc').addClass('is-valid');
        }
    });

    $('#txtDenominationCurrency').on('input', function () {
        $('#txtDenominationCurrency').removeClass('is-invalid');
        $('#txtDenominationCurrency').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtDenominationCurrency').addClass('is-valid');
        }
    });

}

function clearValidate() {
    $("#txtDenominationCode").removeClass("is-invalid");
    $("#txtDenominationPrice").removeClass("is-invalid");
    $("#txtDenominationDesc").removeClass("is-invalid");
    $("#txtDenominationCurrency").removeClass("is-invalid");

    $("#txtDenominationCode").removeClass("is-valid");
    $("#txtDenominationPrice").removeClass("is-valid");
    $("#txtDenominationDesc").removeClass("is-valid");
    $("#txtDenominationCurrency").removeClass("is-valid");
}
 
 

function showViewPopup(denominationId, denominationCode, denominationPrice, denominationDesc, isActive, denominationCurrency) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(denominationId);

    //$('#txtViewDenominationId').val(denominationId);
    $('#txtViewDenominationCode').val(denominationCode);
    $('#txtViewDenominationPrice').val(denominationPrice);
    $('#txtViewDenominationDesc').val(denominationDesc);
    $('#txtViewDenominationCurrency').val(denominationCurrency);

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

    $('#txtDenominationCode').val('');
    $('#txtDenominationPrice').val('');
    $('#txtDenominationDesc').val('');
    $('#txtDenominationCurrency').val('');

    $('#txtDenominationCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(denominationId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(denominationId);

    $.requestAjax({
        service: 'MasterDenomination/GetDenominationById?id=' + denominationId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

             

                $('#txtDenominationCode').val(response.data.denominationCode);
                $('#txtDenominationPrice').val(response.data.denominationPrice);
                $('#txtDenominationDesc').val(response.data.denominationDesc);
                $('#txtDenominationCurrency').val(response.data.denominationCurrency);

                $('#txtDenominationCode').prop('disabled', true);

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
        createDenomination();
    } else {
        editDenomination();
    }
});

function createDenomination() { 

    var requestData = new Object();
    requestData.denominationId = 0;
    requestData.denominationCode = $('#txtDenominationCode').val();
    requestData.denominationPrice = $('#txtDenominationPrice').val();
    requestData.denominationDesc = $('#txtDenominationDesc').val();
    requestData.denominationCurrency = $('#txtDenominationCurrency').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterDenomination/CreateDenomination',
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

function editDenomination() { 

    var requestData = new Object();
    requestData.denominationId = numeral($('#rowItemSelected').val()).value();
    requestData.denominationCode = $('#txtDenominationCode').val();
    requestData.denominationPrice = $('#txtDenominationPrice').val();
    requestData.denominationDesc = $('#txtDenominationDesc').val();
    requestData.denominationCurrency = $('#txtDenominationCurrency').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterDenomination/UpdateDenomination',
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

    if ($('#txtDenominationCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtDenominationCode').addClass('is-invalid');
    }

    if ($('#txtDenominationPrice').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtDenominationPrice').addClass('is-invalid');
    }

    if ($('#txtDenominationDesc').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtDenominationDesc').addClass('is-invalid');
    }

    if ($('#txtDenominationCurrency').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtDenominationCurrency').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}