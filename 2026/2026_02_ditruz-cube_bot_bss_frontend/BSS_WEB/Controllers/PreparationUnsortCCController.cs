using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.Helper;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel.Preparation;
using BSS_WEB.Services;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class PreparationUnsortCCController : ControllerBase
    {
        private readonly ILogger<PreparationUnsortCCController> _logger;
        private readonly IPreparationUnsortCcService _preparationUnsortCcService;
        private readonly IAppShare _appShare;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterConfigService _masterConfigService;
        private readonly IMasterShiftService _masterShiftService;


        public PreparationUnsortCCController(ILogger<PreparationUnsortCCController> logger,
           IPreparationUnsortCcService preparationUnsortCcService,
           IAppShare appShare,
           IHttpContextAccessor httpContextAccessor,
           IMasterConfigService masterConfigService,
           IMasterShiftService masterShiftService)
        {
            _logger = logger;
            _preparationUnsortCcService = preparationUnsortCcService;
            _appShare = appShare;
            _httpContextAccessor = httpContextAccessor;
            _masterConfigService = masterConfigService;
            _masterShiftService = masterShiftService;
        }

        [HttpPost("PreparationUnsortCC/GetPreparationUnsortCCsDetailAsync")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetPreparationUnsortCCsDetailAsync([FromBody] PagedRequest<PreparationUnsortCCRequest> request)
        {
            request.Filter = new PreparationUnsortCCRequest
            {
                BnTypeId = BNTypeConstants.UnsortCC,
                IsReconcile = false,
                IsActive = true,
                DepartmentId = _appShare.DepartmentId,
                MachineId = _appShare.IsPrepareCentral == "YES" ? null : _appShare.MachineId,
                StatusId = 9,
            };

            var serviceResult = await _preparationUnsortCcService.GetPreparationUnsortCCsDetailAsync(request);
            if (_appShare.IsPrepareCentral != "YES")
            {
                //var configs = await _masterConfigService.GetByConfigTypeCode(ConfigConstants.BSS_FORNT_WORK_DAY);
                //var configList = configs.data ?? new List<MasterConfigDisplay>();

                ////var bssStartTime = configList.ToScanPrepareBssWorkDayStartDateTime();
                ////var bssEndTime = configList.ToScanPrepareBssWorkDayEndDateTime();

                //var bssStartTime = configList.ToViewPrepareBssWorkDayStartDateTime();
                //var bssEndTime = configList.ToViewPrepareBssWorkDayEndDateTime();

                var shiftResult = await _masterShiftService.GetCurrentShiftAsync();
                var currentShift = shiftResult.data ?? new ShiftInfoData();

                var bssStartTime = MasterShiftHelper
                    .ToViewPrepareBssFromShiftStartDateTime(currentShift?.shiftStartTime, currentShift?.shiftEndTime);

                var bssEndTime = MasterShiftHelper
                    .ToViewPrepareBssFromShiftEndDateTime(currentShift?.shiftStartTime, currentShift?.shiftEndTime);


                // ===== loop data =====
                foreach (var item in serviceResult?.Data?.Items ?? Enumerable.Empty<dynamic>())
                {
                    var createdDate = item.CreatedDate;

                    if (createdDate >= bssStartTime && createdDate <= bssEndTime)
                    {
                        item.IsFlag = true;
                    }
                    else
                    {
                        item.IsFlag = false;
                    }
                }

            }
            return Ok(serviceResult);
        }

        [HttpPut("PreparationUnsortCC/Edit")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit([FromBody] List<EditPreparationUnsortCcRequest> requests)
        {
            try
            {
                var serviceResult = await _preparationUnsortCcService.EditPreparationUnsortCcAsync(requests);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditPreparationUnfit failed. Items={Count}", requests?.Count ?? 0);

                return BadRequest("EDIT_PREPARATION_UNSORT_CA_MEMBER_FAILED");
            }
        }

        [HttpDelete("PreparationUnsortCC/Delete")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete([FromBody] List<DeletePreparationUnsortCcRequest> requests)
        {
            try
            {
                var serviceResult = await _preparationUnsortCcService.DeletePreparationUnsortCcAsync(requests);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeletePreparationUnsortCc failed. Items={Count}", requests?.Count ?? 0);

                return BadRequest("DELETE_PREPARATION_UNSORT_CC_FAILED");
            }
         
            
        }

        [HttpPost("PreparationUnsortCC/PreviewUnsortCCGenerateBarcode")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> PreviewUnsortCCGenerateBarcode([FromBody] CreateContainerBarcodeRequest request)
        {
            try
            {
                request.DepartmentId = _appShare.DepartmentId;
                request.CreatedBy = _appShare.UserID;
                request.CompanyId = _appShare.CompanyId;
                request.MachineId = _appShare.IsPrepareCentral == "YES" ? null : _appShare.MachineId;
                var serviceResult = await _preparationUnsortCcService.PreviewUnsortCCGenerateBarcodeAsync(request);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "PreviewUnsortCCGenerateBarcodeAsync failed. Items={Count}", request?.UnSortCcId ?? 0);
                return BadRequest("PREVIEW_GENERATE_BARCODE_PREPARATION_UNSORT_CA_MEMBER_FAILED");
            }
        }

        [HttpPost("PreparationUnsortCC/CreateContainer")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateContainer([FromBody]CreateContainerBarcodeRequest request)
        {
            try
            {
                 
                request.DepartmentId = _appShare.DepartmentId;
                request.CreatedBy = _appShare.UserID;
                request.CompanyId = _appShare.CompanyId;
                request.MachineId = _appShare.IsPrepareCentral == "YES" ? null : _appShare.MachineId;
             
                var serviceResult = await _preparationUnsortCcService.CreatePreparationUnsortCCContainer(request);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreatePreparationCaMemberContainer failed. Items={Count}", request.HeaderCardCode ?? "");

                return BadRequest("CREATE_PREPARATION_UNSORT_CA_MEMBER_FAILED");
            }
        }


        [HttpGet("PreparationUnsortCC/GetById/{unsortCCId:long}")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetById(long unsortCCId)
        {
            try
            {
                var serviceResult = await _preparationUnsortCcService.GetPreparationUnsortCCById(unsortCCId);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetById failed. unsortCCId={unsortCCId}", unsortCCId);

                return BadRequest("GET_PREPARATION_UNSORT_CA_MEMBER_FAILED");
            }
        }

        [HttpPost("PreparationUnsortCC/GetExistingTransactionContainerPrepare")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetExistingTransactionContainerPrepare([FromBody] ExistingTransactionContainerPrepareRequest request)
        {
            try
            {
                var serviceResult = await _preparationUnsortCcService.GetExistingTransactionContainerPrepare(request);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetExistingTransactionContainerPrepare failed.");

                return BadRequest("GET_EXISTING_TRANSACTION_PREPARATION_UNSORT_CC_FAILED");
            }
        }

    }
}
