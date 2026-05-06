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
    public class RevokeTransactionController : BaseController
    {
        private readonly ITransactionRevokeTranService _revokeTranService;
        private readonly ILogger<RevokeTransactionController> _logger;

        public RevokeTransactionController(
            IAppShare share,
            ITransactionRevokeTranService revokeTranService,
            ILogger<RevokeTransactionController> logger) : base(share)
        {
            _revokeTranService = revokeTranService;
            _logger = logger;
        }

        [HttpPost("GetRevokeList")]
        public async Task<IActionResult> GetRevokeList(
            [FromBody] PagedRequest<RevokeTransactionFilterRequest> request,
            CancellationToken ct)
        {
            var data = await _revokeTranService.GetRevokeListAsync(request, ct);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpGet("GetDetail")]
        public async Task<IActionResult> GetDetail([FromQuery] string headerCardCode, CancellationToken ct)
        {
            var data = await _revokeTranService.GetDetailAsync(headerCardCode, ct);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpPost("ExecuteRevoke")]
        public async Task<IActionResult> ExecuteRevoke([FromBody] RevokeActionRequest request)
        {
            try
            {
                var data = await _revokeTranService.ExecuteRevokeAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ExecuteRevoke failed. Ids={Ids}",
                    string.Join(",", request.ReconcileTranIds));
                return ApiInternalServerError("EXECUTE_REVOKE_FAILED");
            }
        }
    }
}
