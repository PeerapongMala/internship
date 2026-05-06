using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchParameter;
using BSS_WEB.Models.ServiceModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    public class ApproveManualKeyInController : BaseController
    {
        private readonly ILogger<ApproveManualKeyInController> _logger;
        private readonly IApproveManualKeyInTransactionService _approveManualKeyInTransactionService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterMachineService _machineService;
        private readonly IMasterDropdownService _dropdownService;
        private readonly IMasterStatusService _statusService;
        private readonly IMasterBanknoteTypeService _bnTypeService;
        private readonly IAppShare _appShare;

        public ApproveManualKeyInController(
            ILogger<ApproveManualKeyInController> logger,
            IApproveManualKeyInTransactionService approveManualKeyInTransactionService,
            IAppShare appShare,
            IMasterMachineService machineService,
            IMasterDropdownService dropdownService,
            IMasterStatusService statusService,
            IMasterBanknoteTypeService bnTypeService,
            IHttpContextAccessor httpContextAccessor) : base(appShare)
        {
            _logger = logger;
            _approveManualKeyInTransactionService = approveManualKeyInTransactionService;
            _appShare = appShare;
            _machineService = machineService;
            _dropdownService = dropdownService;
            _statusService = statusService;
            _bnTypeService = bnTypeService;
            _httpContextAccessor = httpContextAccessor;
        }

        #region View Actions

        // [AuthenticationActionFilter]
        public async Task<IActionResult> Index()
        {
            var model = new BSS_WEB.Views.ApproveManualKeyIn.ApproveManualKeyInPage.IndexModel();
            model.ShiftName = _appShare.ShiftName;
            model.Approver = $"{_appShare.FirstName} {_appShare.LastName}";
            model.SortingMachine = "-";

            var resultMachine = await _machineService.GetMachineByIdAsync(_appShare.MachineId);
            if (resultMachine.is_success)
            {
                model.SortingMachine = resultMachine.data != null ? resultMachine.data.machineName : "";
            }

            // Blue theme for Approve Manual Key-in (consistent with Verify domain)
            model.PageTitle = "Approve Manual Key-in";
            model.PageTitleThai = "อนุมัติการกรอกข้อมูลด้วยตนเอง";
            model.CssVariantClass = "approve-manual-key-in";
            ViewData["NavColorClass"] = "nav-blue";

            return View("~/Views/ApproveManualKeyIn/ApproveManualKeyInPage/Index.cshtml", model);
        }

        #endregion View Actions

        #region AJAX Endpoints

        [HttpPost("ApproveManualKeyIn/GetApproveManualKeyInTransactionsDetailAsync")]
        public async Task<IActionResult> GetApproveManualKeyInTransactionsDetailAsync([FromBody] PagedRequest<ApproveManualKeyInTransactionFilterRequest> request)
        {
            request.Filter = new ApproveManualKeyInTransactionFilterRequest
            {
                DepartmentId = _appShare.DepartmentId,
                IsActive = true,
            };

            var serviceResult = await _approveManualKeyInTransactionService.GetApproveManualKeyInTransactionsAsync(request);
            return Json(serviceResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetHeaderCardDetail(long approveManualKeyInTranId)
        {
            var serviceResult = await _approveManualKeyInTransactionService.GetHeaderCardDetailAsync(approveManualKeyInTranId);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> EditApproveManualKeyInTran([FromBody] EditApproveManualKeyInTranRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _approveManualKeyInTransactionService.EditApproveManualKeyInTranAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditApproveManualKeyInTran failed. Id={Id}", request.ApproveManualKeyInTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "EDIT_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteApproveManualKeyInTran([FromBody] DeleteApproveManualKeyInTranRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _approveManualKeyInTransactionService.DeleteApproveManualKeyInTranAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteApproveManualKeyInTran failed. Id={Id}", request.ApproveManualKeyInTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "DELETE_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetApproveManualKeyInDetail(long id)
        {
            var serviceResult = await _approveManualKeyInTransactionService.GetApproveManualKeyInDetailAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> Approve([FromBody] ApproveManualKeyInActionRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _approveManualKeyInTransactionService.ApproveAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Approve failed. Id={Id}", request.ApproveManualKeyInTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "APPROVE_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Deny([FromBody] CancelApproveManualKeyInRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _approveManualKeyInTransactionService.DenyAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Deny failed. Id={Id}", request.ApproveManualKeyInTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "DENY_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetApproveManualKeyInCount([FromBody] ApproveManualKeyInCountRequest request)
        {
            request.DepartmentId = _appShare.DepartmentId;
            var serviceResult = await _approveManualKeyInTransactionService.GetApproveManualKeyInCountAsync(request);
            return Json(serviceResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetFilterMasterData()
        {
            var baseRequest = new SystemSearchRequest
            {
                CompanyId = _appShare.CompanyId,
                DepartmentId = _appShare.DepartmentId,
                CbBcdCode = _appShare.CbBcdCode,
                SelectItemCount = 200,
                IncludeData = false,
            };

            var tableNames = new[]
            {
                "MasterInstitution",
                "MasterZone",
                "MasterCashPoint",
                "MasterUserSuperVisor",
                "MasterUserPreparator",
            };

            var results = new Dictionary<string, object?>();
            foreach (var tableName in tableNames)
            {
                try
                {
                    var req = new SystemSearchRequest
                    {
                        CompanyId = baseRequest.CompanyId,
                        DepartmentId = baseRequest.DepartmentId,
                        CbBcdCode = baseRequest.CbBcdCode,
                        SelectItemCount = baseRequest.SelectItemCount,
                        IncludeData = baseRequest.IncludeData,
                        TableName = tableName,
                    };
                    var result = await _dropdownService.GetMasterDropdownAsync(req);
                    results[tableName] = result.is_success ? result.Data : null;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to load dropdown: {TableName}", tableName);
                    results[tableName] = null;
                }
            }

            // Load statuses from dedicated service (not in MasterDropdown)
            try
            {
                var statusResult = await _statusService.GetStatusAllAsync();
                results["Statuses"] = (statusResult.is_success && statusResult.data != null) ? statusResult.data : new List<object>();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to load statuses");
                results["Statuses"] = new List<object>();
            }

            // Load banknote types from dedicated service
            try
            {
                var bnTypeResult = await _bnTypeService.GetAllBanknoteTypeAsyn();
                if (bnTypeResult.is_success && bnTypeResult.data != null)
                {
                    results["BanknoteTypes"] = bnTypeResult.data;
                }
                else
                {
                    _logger.LogWarning("GetAllBanknoteTypeAsyn returned is_success={Success}, data is null={IsNull}",
                        bnTypeResult.is_success, bnTypeResult.data == null);
                    results["BanknoteTypes"] = new List<object>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to load banknote types");
                results["BanknoteTypes"] = new List<object>();
            }

            return Json(new { is_success = true, data = results });
        }

        #endregion AJAX Endpoints
    }
}
