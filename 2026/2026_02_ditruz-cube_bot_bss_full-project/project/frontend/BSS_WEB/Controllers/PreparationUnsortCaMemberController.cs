using BSS_WEB.Core.Constants; 
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.Helper;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel.Preparation; 
using Microsoft.AspNetCore.Mvc;
using BSS_WEB.Infrastructure;
using BSS_WEB.Helpers;
using BSS_WEB.Services;

namespace BSS_WEB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreparationUnsortCaMemberController : ControllerBase
    {
        private readonly ILogger<PreparationUnsortCaMemberController> _logger;
        private readonly IPreparationUnsortCaMemberService _preparationUnsortCaMemberService;
        private readonly IAppShare _appShare;
        private readonly IMasterConfigService _masterConfigService;
        private readonly IMasterShiftService _masterShiftService;
        public PreparationUnsortCaMemberController(ILogger<PreparationUnsortCaMemberController> logger,
           IPreparationUnsortCaMemberService preparationUnsortCaMemberService,
           IAppShare appShare, IMasterConfigService masterConfigService, IMasterShiftService masterShiftService)  
        {
            _logger = logger;
            _preparationUnsortCaMemberService = preparationUnsortCaMemberService;
            _appShare = appShare;
            _masterConfigService = masterConfigService;
            _masterShiftService = masterShiftService;
        }

        [ServiceFilter(typeof(RefreshTokenFilter))]
        [AuthenticationActionFilter]
        [HttpPost("GetAll")]
       //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetAll([FromBody] PagedRequest<PreparationUnsortCaMemberRequest> request)
        {
            request.Filter = new PreparationUnsortCaMemberRequest
            {
                DepartmentId = _appShare.DepartmentId,
                MachineId = _appShare.IsPrepareCentral != "YES" ? _appShare.MachineId : null,
                BnTypeId = 2,
                StatusId = 9,
                IsReconcile = false,
                IsActive = true,
            };

            var serviceResult = await _preparationUnsortCaMemberService.GetPreparationUnsortCaMemberAsync(request);
            if (_appShare.IsPrepareCentral != "YES")
            {
                //var configs = await _masterConfigService.GetByConfigTypeCode(ConfigConstants.BSS_FORNT_WORK_DAY);
                //var configList = configs.data ?? new List<MasterConfigDisplay>();

                //var bssStartTime = configList.ToScanPrepareBssWorkDayStartDateTime();
                //var bssEndTime = configList.ToScanPrepareBssWorkDayEndDateTime();
                //var bssStartTime = configList.ToViewPrepareBssWorkDayStartDateTime();
                //var bssEndTime = configList.ToViewPrepareBssWorkDayEndDateTime();

                var shiftResult = await _masterShiftService.GetCurrentShiftAsync();
                var currentShift = shiftResult.data ?? new ShiftInfoData();

                var bssStartTime = MasterShiftHelper
                    .ToViewPrepareBssFromShiftStartDateTime(currentShift?.shiftStartTime, currentShift?.shiftEndTime);

                var bssEndTime = MasterShiftHelper
                    .ToViewPrepareBssFromShiftEndDateTime(currentShift?.shiftStartTime, currentShift?.shiftEndTime);


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

        [ServiceFilter(typeof(RefreshTokenFilter))]
        [AuthenticationActionFilter]
        [HttpPut("Edit")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit([FromBody] List<EditPreparationUnsortCaMemberRequest> requests)
        {
            try
            {
                var serviceResult = await _preparationUnsortCaMemberService.EditPreparationUnsortCaMemberAsync(requests);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditPreparationUnfit failed. Items={Count}", requests?.Count ?? 0);

                return BadRequest("EDIT_PREPARATION_UNSORT_CA_MEMBER_FAILED");
            }
        }

        [ServiceFilter(typeof(RefreshTokenFilter))]
        [AuthenticationActionFilter]
        [HttpDelete("Delete")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete([FromBody] List<DeletePreparationUnsortCaMemberRequest> requests)
        {
            try
            {
                var serviceResult = await _preparationUnsortCaMemberService.DeletePreparationUnsortCaMemberAsync(requests);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeletePreparationUnfit failed. Items={Count}", requests?.Count ?? 0);

                return BadRequest("EDIT_PREPARATION_UNSORT_CA_MEMBER_FAILED");
            }
        }

        [ServiceFilter(typeof(RefreshTokenFilter))]
        [AuthenticationActionFilter]
        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateContainerBarcodeRequest request)
        {
            try
            {
                request.DepartmentId = _appShare.DepartmentId;
                request.CreatedBy = _appShare.UserID;
                request.CompanyId = _appShare.CompanyId;
                request.MachineId = _appShare.IsPrepareCentral == "YES" ? null : _appShare.MachineId;
                var serviceResult = await _preparationUnsortCaMemberService.CreatePreparationCaMemberContainer(request);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreatePreparationCaMemberContainer failed. Items={Count}", request.HeaderCardCode ?? "");

                return BadRequest("CREATE_PREPARATION_UNSORT_CA_MEMBER_FAILED");
            }
             
        }

        [HttpPost("GetPreviewCaMemberGenerateBarcode")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetPreviewCaMemberGenerateBarcode([FromBody] CreateContainerBarcodeRequest request)
        {
            try
            {
                request.DepartmentId = _appShare.DepartmentId;
                request.CreatedBy = _appShare.UserID;
                request.CompanyId = _appShare.CompanyId;
                request.MachineId = _appShare.IsPrepareCentral == "YES" ? null : _appShare.MachineId;
                var serviceResult = await _preparationUnsortCaMemberService.GetPreviewCaMemberGenerateBarcodeAsync(request);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetPreviewCaMemberGenerateBarcodeAsync failed. Items={Count}", request?.ReceiveId ?? 0);
                return BadRequest("PREVIEW_GENERATE_BARCODE_PREPARATION_UNSORT_CA_MEMBER_FAILED");
            }
        }
    }
}
