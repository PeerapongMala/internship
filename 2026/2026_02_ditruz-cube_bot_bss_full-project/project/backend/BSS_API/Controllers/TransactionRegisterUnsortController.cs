namespace BSS_API.Controllers
{
    using Helpers;
    using Services.Interface;
    using Core.CustomException;
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

        [ServiceFilter(typeof(CurlLoggingFilter))]
        [HttpPost("EditRegisterUnsortContainer")]
        public async Task<IActionResult> EditRegisterUnsortContainer(
            ConfirmRegisterUnsortRequest confirmRegisterUnsortRequest)
        {
            try
            {
                return ApiSuccess(
                    await registerUnsortService.EditRegisterUnsortContainerAsync(confirmRegisterUnsortRequest));
            }
            catch (Exception ex)
            {
                return ApiInternalServerError(ex.Message);
            }
        }

        [ServiceFilter(typeof(CurlLoggingFilter))]
        [HttpPost("EditUnsortCCStatusDelivery")]
        public async Task<IActionResult> EditUnsortCCStatusDelivery(ConfirmUnsortCCRequest confirmUnsortCCRequest)
        {
            try
            {
                return ApiSuccess(
                    await registerUnsortService.EditUnsortCCStatusDeliveryAsync(confirmUnsortCCRequest));
            }
            catch (BundleInvalidExceltion ex)
            {
                return ApiDataDuplicate(ex.Message);
            }
            catch (Exception ex)
            {
                return ApiInternalServerError(ex.Message);
            }
        }

        [ServiceFilter(typeof(CurlLoggingFilter))]
        [HttpPost("ConfirmRegisterUnsort")]
        public async Task<IActionResult> ConfirmRegisterUnsort(
            ConfirmRegisterUnsortRequest confirmRegisterUnsortRequest)
        {
            try
            {
                return ApiSuccess(
                    await registerUnsortService.ConfirmRegisterUnsortCCAsync(confirmRegisterUnsortRequest));
            }
            catch (BarcodeDuplicateException ex)
            {
                return ApiDataDuplicate(ex.Message);
            }
            catch (Exception ex)
            {
                return ApiInternalServerError(ex.Message);
            }
        }
    }
}