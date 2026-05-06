namespace BSS_API.Controllers
{
    using Helpers;
    using Services.Interface;
    using Models.External.Request;
    using Microsoft.AspNetCore.Mvc;
    using Infrastructure.Middlewares;

    [ApiController]
    [ApiKey("CBMS")]
    [Route("api/[controller]")]
    public class CbmsController(
        IAppShare share,
        ICbmsTransactionService cbmsTransactionService,
        ILogger<CbmsController> logger)
        : BaseController(share)
    {
        private readonly IAppShare _share = share;
        private readonly ILogger<CbmsController> _logger = logger;

        [HttpPost("ReceiveCbmsData")]
        public async Task<IActionResult> ImportReceiveCbms(ReceiveCbmsDataRequest receiveCbmsDataRequest)
        {
            return Json(await cbmsTransactionService.ImportReceiveCbmsDataAsync(receiveCbmsDataRequest));
        }
    }
}