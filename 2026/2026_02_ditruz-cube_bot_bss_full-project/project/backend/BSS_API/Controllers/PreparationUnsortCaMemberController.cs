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
    public class PreparationUnsortCaMemberController(
        IAppShare share,
        ITransactionPreparationService transactionPreparationService,
        ILogger<PreparationUnsortCaMemberController> logger)
        : BaseController(share)
    {
        private readonly IAppShare _share = share;

        [HttpPost("GetPreparationUnsortCaMember")]
        public async Task<IActionResult> GetPreparationUnsortCaNonMember(
            [FromBody] PagedRequest<PreparationUnsortCaMemberRequest> request,
            CancellationToken ct)
        {
            var data = await transactionPreparationService.GetPreparationUnsortCaMemberAsync(request);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [ServiceFilter(typeof(CurlLoggingFilter))]
        [HttpPost("CreatePreparationCaMemberContainer")]
        public async Task<IActionResult> CreatePreparationCaMemberContainer(CreateContainerBarcodeRequest request)
        {
            return ApiSuccess(await transactionPreparationService.CreateCaMemberContainerAsync(request));
        }

        [HttpPut("Edit")]
        [ServiceFilter(typeof(CurlLoggingFilter))]
        public async Task<IActionResult> Edit(List<EditPreparationUnsortCaMemberRequest> requests)
        {
            try
            {
                if (requests == null || requests.Count == 0)
                    return BadRequest(new { message = "At least 1 item is required." });

                var data = await transactionPreparationService.EditPreparationUnsortCaMember(requests);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "EditPreparationUnsortCaMember failed. Items={Count}", requests?.Count ?? 0);
                return ApiInternalServerError("EDIT_PREPARATION_UNSORT_CA_MEMBER_FAILED");
            }
        }

        [HttpDelete("Delete")]
        [ServiceFilter(typeof(CurlLoggingFilter))]
        public async Task<IActionResult> Delete(List<DeletePreparationUnsortCaMemberRequest> requests)
        {
            try
            {
                if (requests == null || requests.Count == 0)
                    return BadRequest(new { message = "At least 1 item is required." });

                var data = await transactionPreparationService.DeletePreparationUnsortCaMember(requests);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "DeletePreparationUnsortCaMember failed. Items={Count}", requests?.Count ?? 0);
                return ApiInternalServerError("DELETE_PREPARATION_UNSORT_CA_MEMBER_FAILED");
            }
        }

        [HttpPost("GetPreviewCaMemberGenerateBarcode")]
        public async Task<IActionResult> GetPreviewCaMemberGenerateBarcode(CreateContainerBarcodeRequest request)
        {
            var data = await transactionPreparationService.GetPreviewCaMemberGenerateBarcodeAsync(request);
            return ApiSuccess(data);
        }
    }
}