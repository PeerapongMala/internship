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
    public class UnsortReceiveDeliveryController(
        IAppShare share,
        ITransactionRegisterUnsortService registerUnsortService,
        IUnsortReceiveDeliveryService UnsortReceiveDelivery,
        IMasterUserService MasterUserService)
        : BaseController(share)
    {
        private readonly IAppShare _share = share;
        private readonly IUnsortReceiveDeliveryService _UnsortReceiveDeliveryService = UnsortReceiveDelivery;
        private readonly IMasterUserService _userService = MasterUserService;

        [HttpGet("LoadRegisterUnsortList")]
        public async Task<IActionResult> LoadRegisterUnsortList(int departmentId)
        {
            var data = await registerUnsortService.LoadRegisterUnsortList(departmentId);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpGet("LoadSendUnsortCCList")]
        public async Task<IActionResult> LoadSendUnsortCCList(int departmentId, int userId)
        {
            var data = await UnsortReceiveDelivery.LoadSendUnsortCCList(departmentId, userId);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpGet("LoadContainerBySendUnsortIdList")]
        public async Task<IActionResult> LoadContainerBySendUnsortIdList(string SendUnsortId)
        {
            var data = await UnsortReceiveDelivery.LoadContainerBySendUnsortIdList(SendUnsortId);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpGet("GetReceiveBySendUnsortCode")]
        public async Task<IActionResult> GetReceiveBySendUnsortCode([FromQuery] string SendUnsortCode,
            [FromQuery] int departmentId)
        {
            // 1. ดึงข้อมูลการส่งมอบ
            var data = await UnsortReceiveDelivery.GetReceiveBySendUnsortCode(SendUnsortCode, departmentId);

            // 2. เช็คก่อนว่าพบข้อมูลใบนำส่งหรือไม่
            if (data == null)
            {
                return ApiDataNotFound("Warning:ไม่พบข้อมูลใบนำส่งที่สแกน");
            }
            else
            {

                // 3. ในเมื่อ data ไม่เป็น null และ CreatedBy มีค่าแน่นอน
                // ดึงข้อมูล User เพื่อเอาชื่อมาแสดงผลที่หน้าจอ
                // ใช้ int.TryParse หรือเช็คค่าก่อน Convert
                if (data.CreatedBy != null)
                {
                    // แนะนำใช้ int (ToInt32) แทน ToInt16 เพื่อป้องกัน Overflow
                    var userId = Convert.ToInt32(data.CreatedBy);
                    var dataUser = await _userService.GetUserById(userId);

                    if (dataUser != null)
                    {
                        data.CreatedByName = $"{dataUser.FirstName} {dataUser.LastName}";
                    }
                }
            }

            return ApiSuccess(data);
        }

        [ServiceFilter(typeof(CurlLoggingFilter))]
        [HttpDelete("RemoveBinContainerNotPrepareData")]
        public async Task<IActionResult> RemoveBinContainerNotPrepareData(int Id, int userId)
        {
            var data = await UnsortReceiveDelivery.RemoveBinContainerNotPrepareData(Id, userId);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }
        
        [HttpPost("ExecuteReceive")]
        [ServiceFilter(typeof(CurlLoggingFilter))]
        public async Task<IActionResult> ExecuteReceive([FromBody] DeliveryActionRequest request)
        {
            try
            {
                var result =
                    await _UnsortReceiveDeliveryService.ExecuteReceiveDelivery(request.SendUnsortId, request.UserId);

                if (!result)
                {
                    return ApiDataNotFound("ไม่สามารถดำเนินการรับมอบได้ หรือไม่พบข้อมูล");
                }

                return ApiSuccess("บันทึกการรับมอบสำเร็จ");
            }
            catch (Exception ex)
            {
                return ApiInternalServerError(ex.Message);
            }
        }

        [HttpPost("ExecuteReject")]
        [ServiceFilter(typeof(CurlLoggingFilter))]
        public async Task<IActionResult> ExecuteReject([FromBody] DeliveryActionRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Note))
                    return BadRequest("กรุณาระบุหมายเหตุ");

                var result =
                    await _UnsortReceiveDeliveryService.ExecuteRejectDelivery(request.SendUnsortId, request.UserId,
                        request.Note);

                if (!result)
                {
                    return ApiDataNotFound("ไม่สามารถบันทึกการปฏิเสธได้");
                }

                return ApiSuccess("บันทึกการปฏิเสธเรียบร้อยแล้ว");
            }
            catch (Exception ex)
            {
                return ApiInternalServerError(ex.Message);
            }
        }

        [HttpPost("ExecuteReturn")]
        [ServiceFilter(typeof(CurlLoggingFilter))]
        public async Task<IActionResult> ExecuteReturn([FromBody] BulkDeliveryActionRequest request)
        {
            try
            {
                if (request.SendUnsortIds == null || !request.SendUnsortIds.Any())
                    return BadRequest("ไม่พบรายการที่ต้องการส่งคืน");

                if (string.IsNullOrWhiteSpace(request.Note))
                    return BadRequest("กรุณาระบุหมายเหตุ");

                // ส่ง List ของ IDs ไปที่ Service
                var result =
                    await _UnsortReceiveDeliveryService.ExecuteReturnDelivery(request.SendUnsortIds, request.UserId,
                        request.Note);

                if (!result)
                {
                    return ApiDataNotFound("ไม่สามารถบันทึกการส่งคืนได้");
                }

                return ApiSuccess(true);
            }
            catch (Exception ex)
            {
                return ApiInternalServerError(ex.Message);
            }
        }
        
        [ServiceFilter(typeof(CurlLoggingFilter))]
        [HttpPost("UpdateRemainingQtyReceive")]
        public async Task<IActionResult> UpdateRemainingQtyReceive([FromBody] UpdateRemainingQtyReceiveRequest request)
        {
            try
            {
                var result = await _UnsortReceiveDeliveryService.UpdateRemainingQtyReceive(request);

                if (result == null)
                {
                    // สามารถระบุ Code ที่ต้องการได้เลย เช่น "404" หรือ "NOT_FOUND"
                    return ApiDataNotFound("ไม่พบข้อมูลที่ต้องการบันทึก หรือข้อมูลไม่ถูกต้อง");
                }

                return ApiSuccess(result);
            }
            catch (Exception ex)
            {
                // ส่ง Code ที่เป็นความหมายกลางๆ ไปก่อน เช่น "500" หรือ "INTERNAL_ERROR"
                return GetExceptionOkObjectResult("500", ex);
            }
        }
    }
}