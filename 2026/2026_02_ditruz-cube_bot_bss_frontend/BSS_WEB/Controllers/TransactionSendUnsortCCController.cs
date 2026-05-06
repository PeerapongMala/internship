namespace BSS_WEB.Controllers
{
    using BSS_WEB.Infrastructure;
    using BSS_WEB.Interfaces;
    using BSS_WEB.Models.ObjectModel;
    using BSS_WEB.Models.SearchModel;
    using BSS_WEB.Models.ServiceModel;
    using Microsoft.AspNetCore.Mvc;
    using System.Threading.Tasks;

    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class TransactionSendUnsortCCController : Controller
    {
        private readonly IAppShare _appShare;
        private readonly ILogger<TransactionSendUnsortCCController> _logger;
        private readonly ITransactionSendUnsortCCService _transactionSendUnsortCCService;

        public TransactionSendUnsortCCController(IAppShare appShare, ILogger<TransactionSendUnsortCCController> logger,
            ITransactionSendUnsortCCService transactionSendUnsortCCService)
        {
            _logger = logger;
            _appShare = appShare;
            _transactionSendUnsortCCService = transactionSendUnsortCCService;
        }


        [HttpGet]
        public async Task<IActionResult> GetNewDeliveryCode([FromQuery] string oldDeliveryCode)
        {
            GetNewDeliveryCodeRequest getNewDeliveryCodeRequest = new GetNewDeliveryCodeRequest
            {
                DepartmentId = _appShare.DepartmentId,
                OldDeliveryCode = oldDeliveryCode,
            };
            return Json(await _transactionSendUnsortCCService.GetNewDeliveryCodeAsync(getNewDeliveryCodeRequest));
        }

        [HttpPost]
        public async Task<IActionResult> LoadRegisterUnsort([FromBody] LoadRegisterUnsortRequest loadRegisterUnsortRequest)
        {
            loadRegisterUnsortRequest.DepartmentId = _appShare.DepartmentId;
            var apiResult = await _transactionSendUnsortCCService.LoadRegisterUnsortAsync(loadRegisterUnsortRequest);
            return Json(apiResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSendUnsort([FromBody] Models.ObjectModel.CreateSendUnsortCCRequest createSendUnsortCCRequest)
        {
            createSendUnsortCCRequest.CreatedBy = _appShare.UserID;
            createSendUnsortCCRequest.DepartmentId = _appShare.DepartmentId;
            return Json(await _transactionSendUnsortCCService.CreateSendUnsortCCAsync(createSendUnsortCCRequest));
        }

        [HttpPost]
        public async Task<IActionResult> GetRegisterUnsortDeliver([FromBody] RegisterUnsortDeliverRequest registerUnsortDeliverRequest)
        {
            registerUnsortDeliverRequest.CreatedBy = _appShare.UserID;
            registerUnsortDeliverRequest.CompanyId = _appShare.CompanyId;
            registerUnsortDeliverRequest.DepartmentId = _appShare.DepartmentId;
            return Json(await _transactionSendUnsortCCService.GetRegisterUnsortDeliverAsync(registerUnsortDeliverRequest));
        }

        [HttpPost]
        public async Task<IActionResult> ConfirmRegisterUnsortDeliver([FromBody] ConfirmRegisterUnsortDeliverRequest confirmRegisterUnsortDeliverRequest)
        {
            confirmRegisterUnsortDeliverRequest.CreatedBy = _appShare.UserID;
            confirmRegisterUnsortDeliverRequest.CompanyId = _appShare.CompanyId;
            confirmRegisterUnsortDeliverRequest.DepartmentId = _appShare.DepartmentId;
            var result = await _transactionSendUnsortCCService.ConfirmRegisterUnsortDeliverAsync(confirmRegisterUnsortDeliverRequest);
            return Json(result);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteRegisterUnsortDeliver([FromBody] ConfirmRegisterUnsortDeliverRequest confirmRegisterUnsortDeliverRequest)
        {
            confirmRegisterUnsortDeliverRequest.CreatedBy = _appShare.UserID;
            confirmRegisterUnsortDeliverRequest.CompanyId = _appShare.CompanyId;
            confirmRegisterUnsortDeliverRequest.DepartmentId = _appShare.DepartmentId;
            return Json(await _transactionSendUnsortCCService.DeleteRegisterUnsortDeliverAsync(confirmRegisterUnsortDeliverRequest));
        }

        #region EditSendUnsortDelivery

        [HttpPost]
        public async Task<IActionResult> GetEditSendUnsortDelivery([FromBody] EditSendUnsortDeliveryRequest editSendUnsortDeliveryRequest)
        {
            editSendUnsortDeliveryRequest.DepartmentId = _appShare.DepartmentId;
            return Json(await _transactionSendUnsortCCService.GetEditSendUnsortDeliveryAsync(editSendUnsortDeliveryRequest));
        }

        [HttpPost]
        public async Task<IActionResult> EditBarcodeContainerSendUnsortData([FromBody] EditSendUnsortDataBarcodeContainerRequest editSendUnsortDataBarcodeContainerRequest)
        {
            editSendUnsortDataBarcodeContainerRequest.UserId = _appShare.UserID;
            editSendUnsortDataBarcodeContainerRequest.DepartmentId = _appShare.DepartmentId;
            return Json(await _transactionSendUnsortCCService.EditBarcodeContainerSendUnsortDataAsync(editSendUnsortDataBarcodeContainerRequest));
        }

        [HttpPost]
        public async Task<IActionResult> ConfirmEditSendUnsortDelivery([FromBody] ConfirmEditSendUnsortDeliveryRequest confirmEditSendUnsortDeliveryRequest)
        {
            confirmEditSendUnsortDeliveryRequest.UserId = _appShare.UserID;
            confirmEditSendUnsortDeliveryRequest.DepartmentId = _appShare.DepartmentId;
            return Json(await _transactionSendUnsortCCService.ConfirmEditSendUnsortDeliveryAsync(confirmEditSendUnsortDeliveryRequest));
        }

        #endregion EditSendUnsortDelivery
    }
}
