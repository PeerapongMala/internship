namespace BSS_API.Controllers
{
    using Helpers;
    using Models.Common;
    using Services.Interface;
    using Models.RequestModels;
    using Microsoft.AspNetCore.Mvc;
    using Infrastructure.Middlewares;

    [ApiController]
    [ApiKey("BSS_WEB")]
    [Route("api/[controller]")]
    public class PreparationUnsortCCController(
        IAppShare share,
        ITransactionPreparationService transactionPreparationService,
        ITransactionUnsortCCService transactionUnsortCCService,
        ILogger<PreparationUnsortCaMemberController> logger)
        : BaseController(share)
    {
        [HttpPost("GetPreparationUnsortCC")]
        public async Task<IActionResult> GetPreparationUnsortCaNonMember(
            [FromBody] PagedRequest<PreparationUnsortCCRequest> request,
            CancellationToken ct)
        {
            var data = await transactionPreparationService.GetPreparationUnsortCCAsync(request);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPost("GetPreviewUnsortCCGenerateBarcode")]
        public async Task<IActionResult> GetPreviewUnsortCCGenerateBarcode(CreateContainerBarcodeRequest request)
        {
            var data = await transactionPreparationService.GetPreviewUnsortCCGenerateBarcodeAsync(request);
            return ApiSuccess(data);
        }

        [ServiceFilter(typeof(CurlLoggingFilter))]
        [HttpPost("CreatePreparationUnSortCcContainer")]
        public async Task<IActionResult> CreatePreparationUnSortCcContainer(CreateContainerBarcodeRequest request)
        {
            var data = await transactionPreparationService.CreateUnSortCcContainerAsync(request);
            return ApiSuccess(data);
        }

        [HttpPost("CheckValidateTransactionUnSortCc")]
        public async Task<IActionResult> CheckValidateTransactionUnSortCc(ValidateTransactionUnSortCcRequest request)
        {
            var data = await transactionUnsortCCService.CheckValidateTransactionUnSortCcAsync(request);
            if (data == null || !data.Any())
                return ApiDataNotFound("Barcode ภาชนะมีในระบบหรือไม่");

            return ApiSuccess(data);
        }

        [HttpPut("Edit")]
        [ServiceFilter(typeof(CurlLoggingFilter))]
        public async Task<IActionResult> Edit(List<EditPreparationUnsortCCRequest>? requests)
        {
            try
            {
                if (requests == null || requests.Count == 0)
                    return BadRequest(new { message = "At least 1 item is required." });

                var data = await transactionPreparationService.EditPreparationUnsortCC(requests);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Edit Preparation Unsort CC failed. Items={Count}", requests?.Count ?? 0);
                return ApiInternalServerError("EDIT_PREPARATION_UNSORT_CC_FAILED");
            }
        }

        [HttpDelete("Delete")]
        [ServiceFilter(typeof(CurlLoggingFilter))]
        public async Task<IActionResult> Delete(List<DeletePreparationUnsortCCRequest>? requests)
        {
            try
            {
                if (requests == null || requests.Count == 0)
                    return BadRequest(new { message = "At least 1 item is required." });

                var data = await transactionPreparationService.DeletePreparationUnsortCC(requests);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Delete Preparation Unsort CC failed. Items={Count}", requests?.Count ?? 0);
                return ApiInternalServerError("DELETE_PREPARATION_UNSORT_CC_FAILED");
            }
        }

        [HttpGet("GetById/{unsortCCId:long}")]
        public async Task<IActionResult> GetById(long unsortCCId)
        {
            try
            {
                if (unsortCCId <= 0)
                    return BadRequest(new { message = "Invalid UnsortCCId." });

                var data = await transactionUnsortCCService
                    .GetPreparationUnsortCCById(unsortCCId);

                if (data == null)
                    return NotFound(new { message = "Data not found." });

                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                return ApiInternalServerError("GET_PREPARATION_UNSORT_CC_BY_ID_FAILED");
            }
        }

        [HttpPost("GetExistingTransactionContainerPrepare")]
        public async Task<IActionResult> GetExistingTransactionContainerPrepare(
            ExistingTransactionContainerPrepareRequest request)
        {
            try
            {
                var data = await transactionUnsortCCService.GetExistingTransactionContainerPrepare(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                return ApiInternalServerError("GET_EXISTING_TRANSACTION_PREPARATION_UNSORT_CC_FAILED");
            }
        }
    }
}