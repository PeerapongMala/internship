//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterSeriesDenom/SearchSeriesDenom',
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
            data: 'seriesCode',
            title: 'รหัส Series',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'serieDescrpt',
            title: 'คำอธิบาย Series',
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.seriesDenomId}" 
                            onclick="showViewPopup(${value.seriesDenomId}, 
                                                '${value.seriesCode}', 
                                                '${value.serieDescrpt}', 
                                                ${value.isActive});"
                        data-toggle="tooltip" title="ดูข้อมูล" >
                        <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.seriesDenomId}" 
                        onclick="showEditPopup(${value.seriesDenomId});"
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
    $('#txtSeriesCode').on('input', function () {
        $('#txtSeriesCode').removeClass('is-invalid');
        $('#txtSeriesCode').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtSeriesCode').addClass('is-valid');
        }
    });

    $('#txtSeriesDesc').on('input', function () {
        $('#txtSeriesDesc').removeClass('is-invalid');
        $('#txtSeriesDesc').removeClass('is-valid');

        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtSeriesDesc').addClass('is-valid');
        }
    });
     

}

function clearValidate() {
   $("#txtSeriesCode").removeClass("is-invalid");
   $("#txtSeriesDesc").removeClass("is-invalid");
   $("#txtSeriesCode").removeClass("is-valid");    
    $("#txtSeriesDesc").removeClass("is-valid");
 
}
 
 

function showViewPopup(seriesDenomId, seriesCode,  serieDescrpt, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(seriesDenomId);

    //$('#txtViewSeriesDenomId').val(seriesDenomId);
    $('#txtViewSeriesCode').val(seriesCode);    
    $('#txtViewSeriesDesc').val(serieDescrpt);
 
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

    $('#txtSeriesCode').val(''); 
    $('#txtSeriesDesc').val(''); 

    //$('#txtSeriesCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(seriesDenomId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(seriesDenomId);

    $.requestAjax({
        service: 'MasterSeriesDenom/GetSeriesDenomById?id=' + seriesDenomId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

            

                $('#txtSeriesCode').val(response.data.seriesCode);
                
                $('#txtSeriesDesc').val(response.data.serieDescrpt);
                

                //$('#txtSeriesCode').prop('disabled', true);

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
    requestData.seriesDenomId = 0;
    requestData.seriesCode = $('#txtSeriesCode').val(); 
    requestData.serieDescrpt = $('#txtSeriesDesc').val(); 

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterSeriesDenom/CreateSeriesDenom',
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
    requestData.seriesDenomId = numeral($('#rowItemSelected').val()).value();
    requestData.seriesCode = $('#txtSeriesCode').val(); 
    requestData.serieDescrpt = $('#txtSeriesDesc').val(); 

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterSeriesDenom/UpdateSeriesDenom',
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

    if ($('#txtSeriesCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtSeriesCode').addClass('is-invalid');
    } 

    if ($('#txtSeriesDesc').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtSeriesDesc').addClass('is-invalid');
    }
     
    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}