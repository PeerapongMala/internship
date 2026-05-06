namespace BSS_API.Controllers
{
    using Helpers;
    using Services;
    using Core.Constants;
    using Services.Interface;
    using Models.RequestModels;
    using Core.CustomException;
    using Repositories.Interface;
    using Microsoft.AspNetCore.Mvc;
    using Infrastructure.Middlewares;

    [ApiController]
    [ApiKey("BSS_WEB")]
    [Route("api/[controller]")]
    public class TransactionSendUnsortCCController(
        IAppShare share,
        IUnitOfWork unitOfWork,
        ITransactionSendUnsortCCService transactionSendUnsortCCService)
        : BaseController(share)
    {
        [HttpPost("GetNewDeliveryCode")]
        public async Task<IActionResult> GetNewDeliveryCode(GetNewDeliveryCodeRequest getNewDeliveryCodeRequest)
        {
            BarcodeService.ValidateBarcodeServiceBuilder validateBarcodeBuilder =
                new BarcodeService.ValidateBarcodeServiceBuilder()
                    .SetUnitOfWork(unitOfWork)
                    .SetDepartment(getNewDeliveryCodeRequest.DepartmentId);

            BarcodeService barcodeService = validateBarcodeBuilder.Build();
            return ApiSuccess(
                await barcodeService.GenerateSequenceNumberAsync(GenerateSequenceTypeEnum.SEND_UNSORT_SEQUENCE,
                    getNewDeliveryCodeRequest.OldDeliveryCode ?? string.Empty));
        }

        [HttpPost("LoadRegisterUnsort")]
        public async Task<IActionResult> LoadRegisterUnsort(LoadRegisterUnsortRequest loadRegisterUnsortRequest)
        {
            return ApiSuccess(
                await transactionSendUnsortCCService.LoadRegisterUnsortListAsync(loadRegisterUnsortRequest));
        }

        [HttpPost("CreateSendUnsort")]
        [ServiceFilter(typeof(CurlLoggingFilter))]
        public async Task<IActionResult> CreateSendUnsort(CreateSendUnsortCCRequest createSendUnsortRequest)
        {
            try
            {
                return ApiSuccess(await transactionSendUnsortCCService.CreateSendUnsortAsync(createSendUnsortRequest));
            }
            catch (DeliveryCodeDuplicateException ex)
            {
                return ApiDataDuplicate(ex.Message);
            }
            catch (Exception ex)
            {
                return ApiInternalServerError(ex.Message);
            }
        }

        [HttpPost("GetRegisterUnsortDeliver")]
        public async Task<IActionResult> GetRegisterUnsortDeliver(RegisterUnsortDeliverRequest registerUnsortDeliver)
        {
            return ApiSuccess(
                await transactionSendUnsortCCService.GetRegisterUnsortDeliverAsync(registerUnsortDeliver));
        }

        [ServiceFilter(typeof(CurlLoggingFilter))]
        [HttpPost("ConfirmRegisterUnsortDeliver")]
        public async Task<IActionResult> ConfirmRegisterUnsortDeliver(
            ConfirmRegisterUnsortDeliverRequest confirmRegisterUnsortDeliverRequest)
        {
            try
            {
                return ApiSuccess(
                    await transactionSendUnsortCCService.ConfirmRegisterUnsortDeliverAsync(
                        confirmRegisterUnsortDeliverRequest));
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
        [HttpDelete("DeleteRegisterUnsortDeliver")]
        public async Task<IActionResult> DeleteRegisterUnsortDeliver(
            ConfirmRegisterUnsortDeliverRequest confirmRegisterUnsortDeliverRequest)
        {
            return ApiSuccess(
                await transactionSendUnsortCCService.DeleteRegisterUnsortDeliverAsync(
                    confirmRegisterUnsortDeliverRequest));
        }

        #region EditSendUnsortDelivery

        [HttpPost("GetEditSendUnsortDelivery")]
        public async Task<IActionResult> GetEditSendUnsortDelivery(
            EditSendUnsortDeliveryRequest editingSendUnsortDelivery)
        {
            return ApiSuccess(
                await transactionSendUnsortCCService.GetEditSendUnsortDeliveryAsync(editingSendUnsortDelivery));
        }

        [ServiceFilter(typeof(CurlLoggingFilter))]
        [HttpPost("EditBarcodeContainerSendUnsortData")]
        public async Task<IActionResult> EditBarcodeContainerSendUnsortData(
            EditSendUnsortDataBarcodeContainerRequest editingSendUnsortDataBarcodeContainerRequest)
        {
            try
            {
                return ApiSuccess(
                    await transactionSendUnsortCCService.EditBarcodeContainerSendUnsortDataAsync(
                        editingSendUnsortDataBarcodeContainerRequest));
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

        [ServiceFilter(typeof(CurlLoggingFilter))]
        [HttpPost("ConfirmEditSendUnsortDelivery")]
        public async Task<IActionResult> ConfirmEditSendUnsortDelivery(
            ConfirmEditSendUnsortDeliveryRequest confirmEditSendUnsortDeliveryRequest)
        {
            try
            {
                return ApiSuccess(
                    await transactionSendUnsortCCService.ConfirmEditSendUnsortDeliveryAsync(
                        confirmEditSendUnsortDeliveryRequest));
            }
            catch (BundleInvalidExceltion ex)
            {
                return ApiDataDuplicate(ex.Message);
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

        #endregion EditSendUnsortDelivery
    }
}