namespace BSS_API.Controllers
{
    using Helpers;
    using Services.Interface;
    using Models.RequestModels;
    using Microsoft.AspNetCore.Mvc;
    using Infrastructure.Middlewares;

    [ApiController]
    [ApiKey("BSS_WEB")]
    [Route("api/[controller]")]
    public class AutoSellingController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IAutoSellingService _autoSellingService;
        private readonly ILogger<AutoSellingController> _logger;

        public AutoSellingController(
            IAppShare share,
            IAutoSellingService autoSellingService,
            ILogger<AutoSellingController> logger) : base(share)
        {
            _share = share;
            _autoSellingService = autoSellingService;
            _logger = logger;
        }

        /// <summary>
        /// ดึงข้อมูล 5 ตาราง (table1, table2, tableA, tableB, tableC)
        /// </summary>
        [HttpPost("GetAllData")]
        public async Task<IActionResult> GetAllData(
            [FromBody] AutoSellingFilterRequest request,
            CancellationToken ct)
        {
            try
            {
                var data = await _autoSellingService.GetAllDataAsync(request, ct);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetAllData failed. DepartmentId={DeptId}", request.DepartmentId);
                return ApiInternalServerError("GET_ALL_DATA_FAILED");
            }
        }

        /// <summary>
        /// รายละเอียด Header Card (ทำลาย / ดี / Reject)
        /// </summary>
        [HttpGet("GetDetail")]
        public async Task<IActionResult> GetDetail(string headerCardCode, CancellationToken ct)
        {
            var data = await _autoSellingService.GetDetailAsync(headerCardCode, ct);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        /// <summary>
        /// บันทึก Adjustment (เพิ่ม/ลด ให้ครบ 1,000 ฉบับ)
        /// </summary>
        [HttpPost("SaveAdjustment")]
        public async Task<IActionResult> SaveAdjustment([FromBody] AutoSellingAdjustmentRequest request)
        {
            try
            {
                var data = await _autoSellingService.SaveAdjustmentAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SaveAdjustment failed. HC={HC}", request.HeaderCardCode);
                return ApiInternalServerError("SAVE_ADJUSTMENT_FAILED");
            }
        }

        /// <summary>
        /// บันทึกแทรกแทน (ลดชนิดราคาที่แทรก + เพิ่มชนิดราคาหลักให้ครบ 1,000)
        /// </summary>
        [HttpPost("SaveInsertReplace")]
        public async Task<IActionResult> SaveInsertReplace([FromBody] AutoSellingInsertReplaceRequest request)
        {
            try
            {
                var data = await _autoSellingService.SaveInsertReplaceAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SaveInsertReplace failed. HC={HC}", request.HeaderCardCode);
                return ApiInternalServerError("SAVE_INSERT_REPLACE_FAILED");
            }
        }

        /// <summary>
        /// รวมมัด 2 รายการจาก tableA
        /// </summary>
        [HttpPost("MergeBundles")]
        public async Task<IActionResult> MergeBundles([FromBody] AutoSellingMergeRequest request)
        {
            try
            {
                var data = await _autoSellingService.MergeBundlesAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MergeBundles failed. KeepId={KeepId}, MergeId={MergeId}",
                    request.KeepId, request.MergeId);
                return ApiInternalServerError("MERGE_BUNDLES_FAILED");
            }
        }

        /// <summary>
        /// ตรวจสอบก่อนส่งไปหน้า Verify (เฉพาะมัดครบเท่านั้น)
        /// </summary>
        [HttpPost("ValidateSummary")]
        public async Task<IActionResult> ValidateSummary([FromBody] AutoSellingValidateSummaryRequest request)
        {
            var data = await _autoSellingService.ValidateSummaryAsync(request);
            return ApiSuccess(data);
        }

        /// <summary>
        /// ยกเลิกรายการที่ส่งแล้ว + OTP Manager
        /// </summary>
        [HttpPost("CancelSend")]
        public async Task<IActionResult> CancelSend([FromBody] AutoSellingCancelSendRequest request)
        {
            try
            {
                var data = await _autoSellingService.CancelSendAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CancelSend failed");
                return ApiInternalServerError("CANCEL_SEND_FAILED");
            }
        }

        /// <summary>
        /// ส่งคำขออนุมัติ Adjust Offset (รวมมัดขาด-เกิน)
        /// </summary>
        [HttpPost("SaveAdjustOffset")]
        public async Task<IActionResult> SaveAdjustOffset([FromBody] AdjustOffsetRequest request)
        {
            try
            {
                var data = await _autoSellingService.SaveAdjustOffsetAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SaveAdjustOffset failed. Ids={Ids}",
                    string.Join(",", request.Ids));
                return ApiInternalServerError("SAVE_ADJUST_OFFSET_FAILED");
            }
        }

        /// <summary>
        /// เปลี่ยน Shift ของรายการที่เลือก + OTP Manager
        /// </summary>
        [HttpPost("ChangeShift")]
        public async Task<IActionResult> ChangeShift([FromBody] AutoSellingChangeShiftRequest request)
        {
            try
            {
                var data = await _autoSellingService.ChangeShiftAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ChangeShift failed");
                return ApiInternalServerError("CHANGE_SHIFT_FAILED");
            }
        }
    }
}
