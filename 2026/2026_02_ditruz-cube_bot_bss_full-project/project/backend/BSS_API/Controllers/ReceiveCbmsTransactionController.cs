namespace BSS_API.Controllers
{
    using Helpers;
    using Models.Entities;
    using Services.Interface;
    using Models.RequestModels;
    using Microsoft.AspNetCore.Mvc;
    using Infrastructure.Middlewares;

    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class ReceiveCbmsTransactionController : BaseController
    {
        private readonly IAppShare _share;
        private readonly ICbmsTransactionService _cbmsTransService;
        private readonly ICbmsTransactionService _cbmsTransactionService;
        private readonly ILogger<ReceiveCbmsTransactionController> _logger;

        public ReceiveCbmsTransactionController(IAppShare share, ICbmsTransactionService cbmsTransService,
            ICbmsTransactionService cbmsTransactionService,
            ILogger<ReceiveCbmsTransactionController> logger) : base(share)
        {
            _share = share;
            _logger = logger;
            _cbmsTransService = cbmsTransService;
            _cbmsTransactionService = cbmsTransactionService;
        }

        [HttpGet("GetAllReceiveCbmsData")]
        public async Task<IActionResult> GetAllReceiveCbmsDataAsync(int department)
        {
            var data = await _cbmsTransactionService.GetAllReceiveCbmsDataAsync(department);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpGet("GetReceiveCbmsDataById")]
        public async Task<IActionResult> GetReceiveCbmsDataByIdAsync(long receiveId)
        {
            var data = await _cbmsTransactionService.GetReceiveCbmsDataByIdAsync(receiveId);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPut("UpdateReceiveCbmsData")]
        public async Task<IActionResult> UpdateReceiveCbmsData(UpdateTransactionReceiveCbmsDataRequest entity)
        {
            var existingData = await _cbmsTransactionService.GetReceiveCbmsDataByIdAsync(entity.ReceiveId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _cbmsTransactionService.UpdateReceiveCbmsData(entity);
            return ApiSuccess("The ReceiveCbmsData has been updated successfully");
        }


        [HttpDelete("RemoveReceiveCbmsData")]
        public async Task<IActionResult> RemoveReceiveCbmsData(long Id)
        {
            ReceiveCbmsDataTransaction? data = await _cbmsTransactionService.GetReceiveCbmsDataByIdAsync(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _cbmsTransactionService.DeleteReceiveCbmsData(data.ReceiveId);
            return ApiSuccess("The ReceiveCbmsData has been deleted successfully.");
        }


        [HttpPost("CheckReceiveCbmsTransaction")]
        public async Task<IActionResult> CheckReceiveCbmsTransaction(CheckReceiveCbmsTransactionRequest request)
        {
            var data = await _cbmsTransService.CheckReceiveCbmsTransactionAsync(request);
            if (data == null)
            {
                return ApiDataNotFound("Barcode ภาชนะมีในระบบหรือไม่");
            }

            return ApiSuccess(data);
        }

        [HttpPost("ReceiveCbmsIncreaseRemainingQty")]
        public async Task<IActionResult> ReceiveCbmsIncreaseRemainingQty(UpdateRemainingQtyRequest request)
        {
            await _cbmsTransService.ReceiveCbmsIncreaseRemainingQtyAsync(request);
            return ApiSuccess("บันทึกข้อมูลสำเร็จ");
        }

        [HttpPost("ReceiveCbmsReduceRemainingQty")]
        public async Task<IActionResult> ReceiveCbmsReduceRemainingQty(UpdateRemainingQtyRequest request)
        {
            await _cbmsTransService.ReceiveCbmsReduceRemainingQtyAsync(request);
            return ApiSuccess("บันทึกข้อมูลสำเร็จ");
        }

        [HttpGet("ReceiveCbmsWithCondition")]
        public async Task<IActionResult> GetReceiveCbmsDataTransactionsWithConditionAsync(
            [FromQuery] GetReceiveCbmsTransactionWithConditionRequest request)
        {
            try
            {
                var result = await _cbmsTransactionService.GetReceiveCbmsDataTransactionsWithConditionAsync(request);
                return ApiSuccess(result.ToList());
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost("ValidateCbmsData")]
        public async Task<IActionResult> ValidateCbmsData([FromBody] ValidateCbmsDataRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var data = await _cbmsTransService.ValidateCbmsDataAsync(request);

                if (data == null || !data.Any())
                    return ApiDataNotFound("Barcode ภาชนะมีในระบบหรือไม่");

                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "ValidateCbmsData failed. DepartmentId={DepartmentId}, ContainerId={ContainerId}, BarCode={BarCode}",
                    request?.DepartmentId, request?.ContainerId);


                return ApiInternalServerError($"ValidateCbmsData failed : {ex.Message}");
            }
        }
    }
}