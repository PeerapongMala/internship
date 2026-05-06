using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.Helper;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel.ReceiveCbmsTransaction;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class ReceiveCbmsController : BaseController
    {
        private readonly ILogger<ReceiveCbmsController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IReceiveCbmsTransactionService _receiveCbmsService;
        private readonly IMasterConfigService _masterConfigService;
        private readonly IAppShare _appShare;

        public ReceiveCbmsController(ILogger<ReceiveCbmsController> logger,
            IHttpContextAccessor httpContextAccessor,
            IReceiveCbmsTransactionService receiveCbmsService,
            IAppShare appShare,
            IMasterConfigService masterConfigService) : base(appShare)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _receiveCbmsService = receiveCbmsService;
            _appShare = appShare;
            _masterConfigService = masterConfigService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CheckReceiveCbmsTransaction([FromBody] CheckReceiveCbmsRequest request)
        {
            if (string.IsNullOrEmpty(request.containerBarcode) || string.IsNullOrEmpty(request.wrapBarcode))
            {
                return BadRequest();
            }

            var newRequest = new CheckReceiveCbmsTransactionRequest();
            newRequest.departmentId = _appShare.DepartmentId;
            newRequest.containerId = request.containerBarcode.Trim();
            newRequest.wrapBarcode = request.wrapBarcode.Trim();
            newRequest.bnTypeInput = AppBnType.Unfit.GetCategory();
            var serviceResult = await _receiveCbmsService.CheckReceiveCbmsTransactionAsync(newRequest);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> ReceiveCbmsIncreaseRemainingQtyAsync([FromBody] UpdateRemainingQtyRequest request)
        {
            var serviceResult = await _receiveCbmsService.ReceiveCbmsIncreaseRemainingQtyAsync(request);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> ReceiveCbmsReduceRemainingQtyAsync([FromBody] UpdateRemainingQtyRequest request)
        {
            var serviceResult = await _receiveCbmsService.ReceiveCbmsReduceRemainingQtyAsync(request);
            return Json(serviceResult);
        }

        [HttpGet]
        public async Task<IActionResult> ReceiveCbmsDataTransaction(string containerId)
        {
            var request = new GetReceiveCbmsTransactionWithConditionRequest()
            {
                DepartmentId = _appShare.DepartmentId,
                ContainerId = containerId,
                CompanyId = _appShare.CompanyId,
                BnTypeInput = AppBnType.UnsortCANonMember.GetCategory()
            };
            var serviceResult = await _receiveCbmsService.ReceiveCbmsDataTransactionAsync(request);
            return Json(serviceResult);
        }

		[HttpGet]
		public async Task<IActionResult> ReceiveCbmsDataTransactionForUnfit(string containerId)
		{
			var request = new GetReceiveCbmsTransactionWithConditionRequest()
			{
				DepartmentId = _appShare.DepartmentId,
				ContainerId = containerId,
				CompanyId = _appShare.CompanyId,
				BnTypeInput = AppBnType.Unfit.GetCategory()
			};
			var serviceResult = await _receiveCbmsService.ReceiveCbmsDataTransactionAsync(request);
			return Json(serviceResult);
		}

		[HttpPost]
        public async Task<IActionResult> ValidateCbmsDataTransaction([FromBody] ValidateCbmsDataFrontRequest request )
        {
            var req = new ValidateCbmsDataRequest()
            {
                DepartmentId = _appShare.DepartmentId, 
                ContainerId = request.ContainerId,
                CompanyId = _appShare.CompanyId,
                BnTypeInput = AppBnType.UnsortCANonMember.GetCategory(),
                ValidateType = CbmsValidateType.CaMember,
                MachineId = _appShare.MachineId
            };
            var serviceResult = await _receiveCbmsService.ValidateCbmsDataTransactionAsync(req);
            return Json(serviceResult);
        }
    }
}
