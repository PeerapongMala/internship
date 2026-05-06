//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterM7Quality/SearchM7Quality',
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
            data: 'm7QualityCode',
            title: 'รหัส Quality',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'm7QualityDescrpt',
            title: 'รายละเอียด Quality',
            className: 'text-start',
            
        },
        {
            data: 'm7QualityCps',
            title: 'รหัส Quality CPS',
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
                    <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.m7QualityId}"
                            onclick="showViewPopup(${value.m7QualityId},
                                                        '${value.m7QualityCode}',
                                                '${value.m7QualityDescrpt}',
                                                '${value.m7QualityCps ?? ""}',
                                        ${value.isActive});"
                            data-toggle="tooltip" title="ดูข้อมูล" >
                            <i class="bi bi-eye" fill="currentColor"></i>
                    </button>
                    <button type="button" class="actionBtn btn btn-action" id="btnItemEdit_${value.m7QualityId}"
                                onclick="showEditPopup(${value.m7QualityId});"
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
}

function LoadStatusFilterChange() {

    MasterDataTable.refresh();
}

function initInput() {
    $('#txtM7QualityCode').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#txtM7QualityCode').removeClass('is-invalid');
            $('#txtM7QualityCode').addClass('is-valid');
        } else {
            $('#txtM7QualityCode').removeClass('is-invalid');
            $('#txtM7QualityCode').removeClass('is-valid');
        }
    });

}

function clearValidate() {
    $("#txtM7QualityCode").removeClass("is-invalid");

    $('#txtM7QualityCode').removeClass('is-valid');
}
 

function showViewPopup(m7QualityId, m7QualityCode, m7QualityDescrpt, m7QualityCps, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(m7QualityId);

    $('#txtViewM7QualityId').val(m7QualityId);
    $('#txtViewM7QualityCode').val(m7QualityCode);
    $('#txtViewM7QualityDescription').val(m7QualityDescrpt);
    $('#txtViewM7QualityCPS').val(m7QualityCps);

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

    $('#txtM7QualityCode').val('');
    $('#txtM7QualityDescription').val('');
    $('#txtM7QualityCPS').val('');

    $('#txtM7QualityCode').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsActive').prop('checked', false);
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(m7QualityId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(m7QualityId);

    $.requestAjax({
        service: 'MasterM7Quality/GetM7QualityById?id=' + m7QualityId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

             

                $('#txtM7QualityCode').val(response.data.m7QualityCode);
                $('#txtM7QualityDescription').val(response.data.m7QualityDescrpt);
                $('#txtM7QualityCPS').val(response.data.m7QualityCps);

                $('#txtM7QualityCode').prop('disabled', true);

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
        createM7Quality();
    } else {
        editM7Quality();
    }
});



function validateSave() {
    var isValid = true;
    var invalidCount = 0;

    clearValidate();

    if ($('#txtM7QualityCode').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtM7QualityCode').addClass('is-invalid');
    }

    if ($('#txtM7QualityDescription').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtM7QualityDescription').addClass('is-invalid');
    }

    if ($('#txtM7QualityCPS').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtM7QualityCPS').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}

function createM7Quality() { 
    var requestData = new Object();
    requestData.m7QualityId = 0;
    requestData.m7QualityCode = $('#txtM7QualityCode').val();
    requestData.m7QualityDescrpt = $('#txtM7QualityDescription').val();
    requestData.m7QualityCps = $('#txtM7QualityCPS').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterM7Quality/CreateM7Quality',
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

function editM7Quality() { 
    var requestData = new Object();
    requestData.m7QualityId = numeral($('#rowItemSelected').val()).value();
    requestData.m7QualityCode = $('#txtM7QualityCode').val();
    requestData.m7QualityDescrpt = $('#txtM7QualityDescription').val();
    requestData.m7QualityCps = $('#txtM7QualityCPS').val();

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterM7Quality/UpdateM7Quality',
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
