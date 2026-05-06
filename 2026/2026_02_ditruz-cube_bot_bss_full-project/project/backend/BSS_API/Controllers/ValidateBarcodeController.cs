using BSS_API.Core.Constants;

namespace BSS_API.Controllers
{
    using Helpers;
    using Services;
    using Models.RequestModels;
    using Repositories.Interface;
    using Microsoft.AspNetCore.Mvc;
    using Infrastructure.Middlewares;

    [ApiController]
    [ApiKey("BSS_WEB")]
    [Route("api/[controller]")]
    public class ValidateBarcodeController(IAppShare share, IUnitOfWork unitOfWork) : BaseController(share)
    {
        [HttpPost("ValidateBarcode")]
        public async Task<IActionResult> ValidateBarcode(ValidateBarcodeRequest validateBarcodeRequest)
        {
            BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                new BarcodeService.ValidateBarcodeServiceBuilder()
                    .SetUnitOfWork(unitOfWork)
                    .SetValidateBarcodeRequest(validateBarcodeRequest);

            BarcodeService barcodeService = validateBarcodeBuilder.Build();
            return ApiSuccess(await barcodeService.ValidateAsync());
        }

        [HttpGet("TestGenerateSequenceNumber")]
        public async Task<IActionResult> TestGenerateSequenceNumber()
        {
            BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                new BarcodeService.ValidateBarcodeServiceBuilder()
                    .SetUnitOfWork(unitOfWork)
                    .SetDepartment(1);

            BarcodeService barcodeService = validateBarcodeBuilder.Build();
            return ApiSuccess(
                await barcodeService.GenerateSequenceNumberAsync(GenerateSequenceTypeEnum.SEND_UNSORT_SEQUENCE, "ANO"));
        }
    }
}