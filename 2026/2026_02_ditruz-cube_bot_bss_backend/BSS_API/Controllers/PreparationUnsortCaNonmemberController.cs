using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.RequestModels;
using BSS_API.Services;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class PreparationUnsortCaNonMemberController : BaseController
    {
        private readonly IAppShare _share;
        private readonly ITransactionPreparationService _transactionPreparationService;
        private readonly ILogger<PreparationUnsortCaNonMemberController> _logger;

        public PreparationUnsortCaNonMemberController(IAppShare share,
            ITransactionPreparationService transactionPreparationService,
            ILogger<PreparationUnsortCaNonMemberController> logger) : base(share)
        {
            _share = share;
            _transactionPreparationService = transactionPreparationService;
            _logger = logger;
        }

        [HttpPost("GetPreparationUnsortCaNonMember")]
        public async Task<IActionResult> GetPreparationUnsortCaNonMember(
            [FromBody] PagedRequest<PreparationUnsortCaNonMemberRequest> request,
            CancellationToken ct)
        {
            var data = await _transactionPreparationService.GetPreparationUnsortCaNonMemberAsync(request);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPost("GetPreviewCaNonMemberGenerateBarcode")]
        public async Task<IActionResult> GetPreviewCaNonMemberGenerateBarcode(CreateContainerBarcodeRequest request)
        {
            var data = await _transactionPreparationService.GetPreviewCaNonMemberGenerateBarcodeAsync(request);
            return ApiSuccess(data);
        }

        [HttpPost("CreatePreparationCaNonMemberContainer")]
        public async Task<IActionResult> CreatePreparationCaNonMemberContainer(CreateContainerBarcodeRequest request)
        {
            return ApiSuccess(await _transactionPreparationService.CreateCaNonMemberContainerAsync(request));
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(List<DeletePreparationUnsortCaNonMemberRequest> requests)
        {
            try
            {
                if (requests == null || requests.Count == 0)
                    return BadRequest(new { message = "At least 1 item is required." });

                var data = await _transactionPreparationService.DeletePreparationUnsortCaNonMember(requests);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeletePreparationUnfit failed. Items={Count}", requests?.Count ?? 0);
                return ApiInternalServerError("DELETE_PREPARATION_UNSORT_CA_NON_MEMBER_FAILED");
            }
        }

        [HttpPut("Edit")]
        public async Task<IActionResult> Edit(List<EditPreparationUnsortCaNonMemberRequest> requests)
        {
            try
            {
                if (requests == null || requests.Count == 0)
                    return BadRequest(new { message = "At least 1 item is required." });

                var data = await _transactionPreparationService.EditPreparationUnsortCaNonMember(requests);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditPreparationUnfit failed. Items={Count}", requests?.Count ?? 0);
                return ApiInternalServerError("EDIT_PREPARATION_UNSORT_CA_NON_MEMBER_FAILED");
            }
        }

        [HttpPost("GetExistingTransactionContainerPrepare")]
        public async Task<IActionResult> GetExistingTransactionContainerPrepare(ExistingTransactionContainerPrepareRequest request)
        {
            return ApiSuccess(await _transactionPreparationService.GetExistingTransactionContainerPrepare(request));
        }
    }
}