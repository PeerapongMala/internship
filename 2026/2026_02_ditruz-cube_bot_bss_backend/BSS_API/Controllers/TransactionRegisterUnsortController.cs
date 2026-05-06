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
    public class TransactionRegisterUnsortController(
        IAppShare share,
        ITransactionRegisterUnsortService registerUnsortService,
        ITransactionUnsortCCService unsortCcService)
        : BaseController(share)
    {
        private readonly IAppShare _share = share;
        private readonly ITransactionUnsortCCService _unsortCCService = unsortCcService;

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

        [HttpPost("ConfirmRegisterUnsort")]
        public async Task<IActionResult> ConfirmRegisterUnsort(
            ConfirmRegisterUnsortRequest confirmRegisterUnsortRequest)
        {
            try
            {
                return ApiSuccess(
                    await registerUnsortService.ConfirmRegisterUnsortCCAsync(confirmRegisterUnsortRequest));
            }
            catch (Exception ex)
            {
                return ApiInternalServerError(ex.Message);
            }
        }
    }
}