//initial data table configuration
var MasterDataTable = createServerSideDataTable({
    selector: '.masterDataTable',
    url: 'MasterDenomReconcile/SearchDenomReconcile',
    height: '100%',
    buildFilter: function () {
        var isActiveVal = $('#ddlFilterStatus').val();
        let isActive = null;
        if (isActiveVal === "1") {
            isActive = true;
        } else if (isActiveVal === "0") {
            isActive = false;
        }
 
        var selDeptId = $('#ddlFilterDepartment').val();
        var selDenoId = $('#ddlFilterDenomination').val();
        var selSeriesDenomId = $('#ddlFilterSeriesDenom').val();
        return {
            departmentId: selDeptId ? parseInt(selDeptId, 10) : null,
            denoId: selDenoId ? parseInt(selDenoId, 10) : null,
            seriesDenomId: selSeriesDenomId ? parseInt(selSeriesDenomId,10) : null,
            isActive: isActive
        };
    },
    columns: [
        {
            data: 'denominationDesc',
            title: 'ชื่อราคาธนบัตร',
            className: 'text-start',
            width: '200px'
        },
        {
            data: 'departmentName',
            title: 'ชื่อหน่วยงาน',
            className: 'text-start',
            width: '250px'
        },

        {
            data: 'seriesCode',
            title: 'รหัส Series',
            className: 'text-start',

        },
        {
            data: 'seqNo',
            title: 'ลำดับในการแสดง',
            className: 'text-start',
            width: '100px'
        },
        {
            data: 'isDefault',
            title: 'ค่าเริ่มต้น',
            className: 'text-center',
            orderable: true,
            width: '200px',
            render: function (data, type) {
                // For sorting & filtering
                if (type === 'sort' || type === 'type') {
                    return data ? 1 : 0;
                }

                // For display
                return data
                    ? '<span class="badge badge-active">Yes</span>'
                    : '<span class="badge badge-inactive">No</span>';
            }
        },
        {
            data: 'isDisplay',
            title: 'แสดงบนหน้าจอ',
            className: 'text-center',
            orderable: true,
            width: '200px',
            render: function (data, type) {
                // For sorting & filtering
                if (type === 'sort' || type === 'type') {
                    return data ? 1 : 0;
                }

                // For display
                return data
                    ? '<span class="badge badge-active">Yes</span>'
                    : '<span class="badge badge-inactive">No</span>';
            }
        },
        {
            data: 'isActive',
            title: 'สถานะใช้งาน',
            className: 'text-center',
            orderable: true,
            width: '100px',
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
            width: '100px',
            orderable: false,
            searchable: false,
            className: 'text-center',
            render: function (_, __, value) {
                return `
                     <button type="button" class="actionBtn btn btn-action" id="btnItemView_${value.denomReconcileId}"
                            onclick="showViewPopup(${value.denomReconcileId},
                                                '${value.denoId}',
                                                '${value.departmentId}',
                                                '${value.denominationDesc}',
                                                '${value.departmentName}',
                                                '${value.seriesCode}',
                                                '${value.seqNo}',
                                                '${value.isDefault}',
                                                '${value.isDisplay}',
                                                ${value.isActive}
                                                );"
                            data-toggle="tooltip" title="ดูข้อมูล" >
                            <i class="bi bi-eye" fill="currentColor"></i>
                    <button type="button" data-toggle="tooltip" title="แก้ไขข้อมูล" class="actionBtn btn btn-action" id="btnItemEdit_${value.cashpointId}"
                            onclick="showEditPopup(${value.denomReconcileId},${value.departmentId},${value.denoId});">
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

    loadDenominationLookup(function () {
        $('#ddlFilterDenomination').select2({
            theme: "bootstrap-5",
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });

        $('#ddlDenomination').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#addOrEditItemModal'),
            closeOnSelect: true,
            minimumResultsForSearch: 10
        });

        loadDepartmentLookup(function () {
            $('#ddlFilterDepartment').select2({
                theme: "bootstrap-5",
                closeOnSelect: true,
                minimumResultsForSearch: 10
            });

            $('#ddlDepartment').select2({
                theme: "bootstrap-5",
                dropdownParent: $('#addOrEditItemModal'),
                closeOnSelect: true,
                minimumResultsForSearch: 10
            });
             
        });
        loadSeriesDenomLookup(function () {
            $('#ddlFilterSeriesDenom').select2({
                theme: "bootstrap-5",
                closeOnSelect: true,
                minimumResultsForSearch: 10
            });

            $('#ddlSeriesDenom').select2({
                theme: "bootstrap-5",
                dropdownParent: $('#addOrEditItemModal'),
                closeOnSelect: true,
                minimumResultsForSearch: 10
            });

        });
    });
}

function initInput() {
    $('#ddlDenomination').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#ddlDenomination').removeClass('is-invalid');
            $('#ddlDenomination').addClass('is-valid');
        } else {
            $('#ddlDenomination').removeClass('is-invalid');
            $('#ddlDenomination').removeClass('is-valid');
        }
    });

    $('#ddlDepartment').on('input', function () {
        var selectedValue = $(this).val().trim();
        if (selectedValue != '') {
            $('#ddlDepartment').removeClass('is-invalid');
            $('#ddlDepartment').addClass('is-valid');
        } else {
            $('#ddlDepartment').removeClass('is-invalid');
            $('#ddlDepartment').removeClass('is-valid');
        }
    });
}

function loadDenominationLookup(onSuccess) {
    $.requestAjax({
        service: 'MasterDenomination/GetDenominationList',
        type: 'GET',
        enableLoader: false,
        onSuccess: function (response) {
            console.log('GeDenominationList');
            console.log(JSON.stringify(response));
            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlDenomination')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $('#ddlFilterDenomination')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlFilterDenomination').append(`<option value="${value.denominationId}">${value.denominationDesc}</option>`);
                    $('#ddlDenomination').append(`<option value="${value.denominationId}">${value.denominationDesc}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}

function loadDepartmentLookup(onSuccess) {
    var requestData = new Object();
    requestData.companyFilter = '';
    requestData.statusFilter = '';

    $.requestAjax({
        service: 'MasterDepartment/GetDepartmentList',
        type: 'POST',
        parameter: requestData,
        enableLoader: false,
        onSuccess: function (response) {
            console.log('GetDepartmentList');
            console.log(JSON.stringify(response));
            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlFilterDepartment')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $('#ddlDepartment')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlFilterDepartment').append(`<option value="${value.departmentId}">${value.departmentName}</option>`);
                    $('#ddlDepartment').append(`<option value="${value.departmentId}">${value.departmentName}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}


function loadSeriesDenomLookup(onSuccess) {
    var requestData = new Object();
    requestData.companyFilter = '';
    requestData.statusFilter = '';

    $.requestAjax({
        service: 'MasterSeriesDenom/GetAll',
        type: 'GET',
        parameter: requestData,
        enableLoader: false,
        onSuccess: function (response) {
            
            if (response.is_success == true && response.data != null && response.data.length > 0) {

                $('#ddlFilterSeriesDenom')
                    .find('option')
                    .remove().end()
                    .append('<option value="">ทั้งหมด</option>');

                $('#ddlSeriesDenom')
                    .find('option')
                    .remove().end()
                    .append('<option value="">...เลือก...</option>');

                $.each(response.data, function (index, value) {
                    $('#ddlFilterSeriesDenom').append(`<option value="${value.seriesDenomId}">${value.seriesCode}</option>`);
                    $('#ddlSeriesDenom').append(`<option value="${value.seriesDenomId}">${value.seriesCode}</option>`);
                });
            }

            if (onSuccess != undefined) {
                onSuccess();
            }
        }
    });
}
function clearValidate() {
    $("#ddlDenomination").removeClass("is-invalid");
    $("#ddlDepartment").removeClass("is-invalid");
    $("#ddlSeriesDenom").removeClass("is-invalid");

    $('#ddlDenomination').removeClass('is-valid');
    $('#ddlDepartment').removeClass('is-valid');
    $("#ddlSeriesDenom").removeClass('is-valid');
}
 
 

function LoadDenominationFilterChange() {

    MasterDataTable.refresh();
}

function LoadDepartmentFilterChange() {

    MasterDataTable.refresh();
}

function LoadStatusFilterChange() {

    MasterDataTable.refresh();
}

function LoadSeriesDenomFilterChange() {
    MasterDataTable.refresh();
}

function showViewPopup(denomReconcileId, denoId, departmentId, denominationDesc, departmentName, seriesCode, seqNo, isDefault, isDisplay, isActive) {

    $('#modeSave').val('view');
    $('#rowItemSelected').val(denomReconcileId);

    $('#rowDepartmentIdSelected').val(departmentId);
    $('#rowDenominationIdSelected').val(denoId);

    //$('#txtViewDenomReconcileId').val(denomReconcileId);
    $('#txtViewDenominationDesc').val(denominationDesc);
    $('#txtViewDepartmentName').val(departmentName);
    $('#txtViewDenomSeries').val(seriesCode);
    $('#txtViewSeqNo').val(seqNo);

    if (isDefault) {
        $('#spanViewIsDefault').removeClass("badge-inactive");
        $('#spanViewIsDefault').addClass('badge-active');
        $('#spanViewIsDefault').text('Yes');

    } else {
        $('#spanViewIsDefault').removeClass("badge-active");
        $('#spanViewIsDefault').addClass('badge-inactive');
        $('#spanViewIsDefault').text('No');
    }

    if (isDisplay) {
        $('#spanViewIsDisplay').removeClass("badge-inactive");
        $('#spanViewIsDisplay').addClass('badge-active');
        $('#spanViewIsDisplay').text('Yes');

    } else {
        $('#spanViewIsDisplay').removeClass("badge-active");
        $('#spanViewIsDisplay').addClass('badge-inactive');
        $('#spanViewIsDisplay').text('No');
    }

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

    $('#ddlDenomination').val('').trigger('change');
    $('#ddlDepartment').val('').trigger('change');
    $('#ddlSeriesDenom').val('').trigger('change');;
    $('#txtSeqNo').val('');
    $('#txtIsDefault').val('');
    $('#txtIsDisplay').val('');

    $('#txtDenoId').prop('disabled', false);

    $('#modeSave').val('add');
    $('#rowItemSelected').val('');
    $('#checkIsDefault').prop('checked', false);
    $('#checkIsDisplay').prop('checked', false);
    $('#checkIsActive').prop('checked', false);
    $('#spanIsDefault').removeClass("badge-active");
    $('#spanIsDefault').addClass('badge-inactive');
    $('#spanIsDefault').text('No');
    $('#spanIsDisplay').removeClass("badge-active");
    $('#spanIsDisplay').addClass('badge-inactive');
    $('#spanIsDisplay').text('No');
    $('#spanStatus').removeClass("badge-active");
    $('#spanStatus').addClass('badge-inactive');
    $('#spanStatus').text('Inactive');
    $('#titleModalLabel').text('เพิ่มข้อมูล');
    $('#addOrEditItemModal').modal('show');
}

function showEditPopup(denomReconcileId, denoId, departmentId) {
    $('#modeSave').val('edit');
    $('#rowItemSelected').val(denomReconcileId);
    $('#rowDenominationIdSelected').val(denoId);
    $('#rowDepartmentIdSelected').val(departmentId);

    $.requestAjax({
        service: 'MasterDenomReconcile/GetDenomReconcileById?id=' + denomReconcileId,
        type: 'GET',
        enableLoader: true,
        onSuccess: function (response) {

            

                $('#ddlDenomination').val(response.data.denoId).trigger('change');
                $('#ddlDepartment').val(response.data.departmentId).trigger('change');
                $('#ddlSeriesDenom').val(response.data.seriesDenomId).trigger('change');

                 
                $('#txtSeqNo').val(response.data.seqNo); 

                $('#txtDenoId').prop('disabled', true);

                if (response.data.isDefault) {
                    $('#checkIsDefault').prop('checked', true);
                    $('#spanIsDefault').removeClass("badge-inactive");
                    $('#spanIsDefault').addClass('badge-active');
                    $('#spanIsDefault').text('Yes');

                } else {
                    $('#checkIsDefault').prop('checked', false);
                    $('#spanIsDefault').removeClass("badge-active");
                    $('#spanIsDefault').addClass('badge-inactive');
                    $('#spanIsDefault').text('No');
                }

                if (response.data.isDisplay) {
                    $('#checkIsDisplay').prop('checked', true);
                    $('#spanIsDisplay').removeClass("badge-inactive");
                    $('#spanIsDisplay').addClass('badge-active');
                    $('#spanIsDisplay').text('Yes');

                } else {
                    $('#checkIsDisplay').prop('checked', false);
                    $('#spanIsDisplay').removeClass("badge-active");
                    $('#spanIsDisplay').addClass('badge-inactive');
                    $('#spanIsDisplay').text('No');
                }

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
    showEditPopup(numeral($('#rowItemSelected').val()).value(), numeral($('#rowDepartmentIdSelected').val()).value(), numeral($('#rowDenominationIdSelected').val()).value());
});

$('#checkIsDefault').change(function () {
    if (this.checked) {
        $('#spanIsDefault').removeClass("badge-inactive");
        $('#spanIsDefault').addClass('badge-active');
        $('#spanIsDefault').text('Yes');
    } else {
        $('#spanIsDefault').removeClass("badge-active");
        $('#spanIsDefault').addClass('badge-inactive');
        $('#spanIsDefault').text('No');
    }
});

$('#checkIsDisplay').change(function () {
    if (this.checked) {
        $('#spanIsDisplay').removeClass("badge-inactive");
        $('#spanIsDisplay').addClass('badge-active');
        $('#spanIsDisplay').text('Yes');
    } else {
        $('#spanIsDisplay').removeClass("badge-active");
        $('#spanIsDisplay').addClass('badge-inactive');
        $('#spanIsDisplay').text('No');
    }
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
        createDenomReconcile();
    } else {
        editDenomReconcile();
    }
});



function validateSave() {
    var isValid = true;
    var invalidCount = 0;

    clearValidate();

    if ($('#ddlDenomination').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlDenomination').addClass('is-invalid');
    }

    if ($('#ddlDepartment').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlDepartment').addClass('is-invalid');
    }

    if ($('#ddlSeriesDenom').val() == '') {
        invalidCount = invalidCount + 1;
        $('#ddlSeriesDenom').addClass('is-invalid');
    }

    var txtSeqNo = $('#txtSeqNo');
    if (txtSeqNo.val() == '') {
        invalidCount = invalidCount + 1;
        txtSeqNo.addClass('is-invalid');
        txtSeqNo.siblings('.invalid-feedback').text('this field is required!');
    }
    if (!isValidNumber(txtSeqNo.val())) {
        invalidCount = invalidCount + 1;
        txtSeqNo.addClass('is-invalid');
        txtSeqNo.siblings('.invalid-feedback').text('this field is invalid!');
    }

    if ($('#txtIsDefault').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtIsDefault').addClass('is-invalid');
    }

    if ($('#txtIsDisplay').val() == '') {
        invalidCount = invalidCount + 1;
        $('#txtIsDisplay').addClass('is-invalid');
    }

    if (invalidCount > 0) {
        isValid = false;
        return isValid;
    }

    return isValid;
}

function createDenomReconcile() { 
    var requestData = new Object(); 
    requestData.denoId = numeral($('#ddlDenomination').val()).value();
    requestData.departmentId = numeral($('#ddlDepartment').val()).value();
    requestData.seriesDenomId = $('#ddlSeriesDenom').val();
    requestData.seqNo = $('#txtSeqNo').val(); 

    if ($('#checkIsDefault').is(':checked')) {
        requestData.isDefault = true;
    } else {
        requestData.isDefault = false;
    }

    if ($('#checkIsDisplay').is(':checked')) {
        requestData.isDisplay = true;
    } else {
        requestData.isDisplay = false;
    }

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterDenomReconcile/CreateDenomReconcile',
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

function editDenomReconcile() { 

    var requestData = new Object();
    requestData.denomReconcileId = numeral($('#rowItemSelected').val()).value();
    requestData.denoId = numeral($('#ddlDenomination').val()).value();
    requestData.departmentId = numeral($('#ddlDepartment').val()).value();
    requestData.seriesDenomId = $('#ddlSeriesDenom').val();
    requestData.seqNo = $('#txtSeqNo').val(); 

    if ($('#checkIsDefault').is(':checked')) {
        requestData.isDefault = true;
    } else {
        requestData.isDefault = false;
    }

    if ($('#checkIsDisplay').is(':checked')) {
        requestData.isDisplay = true;
    } else {
        requestData.isDisplay = false;
    }

    if ($('#checkIsActive').is(':checked')) {
        requestData.isActive = true;
    } else {
        requestData.isActive = false;
    }

    $.requestAjax({
        service: 'MasterDenomReconcile/UpdateDenomReconcile',
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