using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiKey("BSS_WEB")]
    public class HoldingDetailController(
        IAppShare share,
        IHoldingDetailService service,
        ILogger<HoldingDetailController> logger) : BaseController(share)
    {
        [HttpGet("GetHoldingDetail")]
        public async Task<IActionResult> GetHoldingDetail([FromQuery] string bnType, [FromQuery] int departmentId = 0)
        {
            try
            {
                var result = await service.GetHoldingDetailAsync(bnType, departmentId);
                return ApiSuccess(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "GetHoldingDetail failed for bnType={BnType}", bnType);
                return ApiInternalServerError("GET_HOLDING_DETAIL_FAILED");
            }
        }

        [HttpGet("GetHoldingDetailByHc")]
        public async Task<IActionResult> GetHoldingDetailByHc([FromQuery] string headerCards, [FromQuery] string bnType)
        {
            try
            {
                var result = await service.GetHoldingDetailByHcAsync(headerCards, bnType);
                return ApiSuccess(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "GetHoldingDetailByHc failed for headerCards={HC}", headerCards);
                return ApiInternalServerError("GET_HOLDING_DETAIL_BY_HC_FAILED");
            }
        }
    }
}
