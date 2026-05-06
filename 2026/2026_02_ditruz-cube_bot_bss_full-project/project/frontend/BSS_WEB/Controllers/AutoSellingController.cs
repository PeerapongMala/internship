using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.AutoSelling;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    public class AutoSellingController : BaseController
    {
        private readonly ILogger<AutoSellingController> _logger;
        private readonly IVerifyTransactionService _verifyTransactionService;
        private readonly IAutoSellingApiService _autoSellingApiService;
        private readonly IManualKeyInService _manualKeyInService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterMachineService _machineService;
        private readonly IMasterSeriesDenomService _seriesDenomService;
        private readonly IAppShare _appShare;

        public AutoSellingController(
            ILogger<AutoSellingController> logger,
            IVerifyTransactionService verifyTransactionService,
            IAutoSellingApiService autoSellingApiService,
            IManualKeyInService manualKeyInService,
            IAppShare appShare,
            IMasterMachineService machineService,
            IMasterSeriesDenomService seriesDenomService,
            IHttpContextAccessor httpContextAccessor) : base(appShare)
        {
            _logger = logger;
            _verifyTransactionService = verifyTransactionService;
            _autoSellingApiService = autoSellingApiService;
            _manualKeyInService = manualKeyInService;
            _appShare = appShare;
            _machineService = machineService;
            _seriesDenomService = seriesDenomService;
            _httpContextAccessor = httpContextAccessor;
        }

        #region View Actions

        [AuthenticationActionFilter]
        public IActionResult Index()
        {
            return RedirectToAction("AutoSelling");
        }

        [AuthenticationActionFilter]
        public async Task<IActionResult> AutoSelling()
        {
            // Validate operation permissions (role + machine)
            if (!AppValidationHelper.ValidatOperationForVerify(_appShare.RoleCode, _appShare.MachineId))
            {
                return RedirectToUnauthorizedPage();
            }

            var model = new BSS_WEB.Views.AutoSelling.AutoSelling.IndexModel();
            model.ShiftName = _appShare.ShiftName;
            model.Verifier = $"{_appShare.FirstName} {_appShare.LastName}";
            model.SortingMachine = "-";

            var resultMachine = await _machineService.GetMachineByIdAsync(_appShare.MachineId);
            if (resultMachine.is_success)
            {
                model.SortingMachine = resultMachine.data != null ? resultMachine.data.machineName : "";
            }

            // Determine variant based on BnType
            var bnType = _appShare.BnType;
            if (bnType == AppBssBanknoteType.Unfit.GetCategory())
            {
                model.BnTypeName = "UNFIT";
                model.BnTypeNameDisplay = "ตรวจสอบการนับคัดธนบัตรประเภท UNFIT";
                model.CssVariantClass = "verify-unfit";
                model.BnTypeCode = "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }
            else if (bnType == AppBssBanknoteType.UnsortCC.GetCategory())
            {
                model.BnTypeName = "UNSORT CC";
                model.BnTypeNameDisplay = "ตรวจสอบการนับคัดธนบัตรประเภท UNSORT CC";
                model.CssVariantClass = "verify-unsort-cc";
                model.BnTypeCode = "UC";
                ViewData["NavColorClass"] = "nav-orange";
            }
            else if (bnType == AppBssBanknoteType.UnsortCAMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA MEMBER";
                model.BnTypeNameDisplay = "ตรวจสอบการนับคัดธนบัตรประเภท UNSORT CA MEMBER";
                model.CssVariantClass = "verify-ca-member";
                model.BnTypeCode = "CA";
                ViewData["NavColorClass"] = "nav-green";
            }
            else if (bnType == AppBssBanknoteType.UnsortCANonMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA NON-MEMBER";
                model.BnTypeNameDisplay = "ตรวจสอบการนับคัดธนบัตรประเภท UNSORT CA NON-MEMBER";
                model.CssVariantClass = "verify-ca-non-member";
                model.BnTypeCode = "CN";
                ViewData["NavColorClass"] = "nav-purple";
            }
            else
            {
                // Unknown BnType → redirect to Unauthorized
                return RedirectToUnauthorizedPage();
            }

            return View("~/Views/AutoSelling/AutoSelling/Index.cshtml", model);
        }

        [AuthenticationActionFilter]
        public async Task<IActionResult> VerifyConfirmation(string ids = "")
        {
            var model = new BSS_WEB.Views.AutoSelling.VerifyConfirmation.IndexModel();
            model.Supervisor = $"{_appShare.FirstName} {_appShare.LastName}";
            model.SortingMachine = "-";

            var resultMachine = await _machineService.GetMachineByIdAsync(_appShare.MachineId);
            if (resultMachine.is_success)
            {
                model.SortingMachine = resultMachine.data != null ? resultMachine.data.machineName : "";
            }

            // Determine variant based on BnType
            var bnType = _appShare.BnType;
            if (bnType == AppBssBanknoteType.Unfit.GetCategory())
            {
                model.BnTypeName = "UNFIT";
                model.CssVariantClass = "verify-unfit";
                model.BnTypeCode = "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }
            else if (bnType == AppBssBanknoteType.UnsortCC.GetCategory())
            {
                model.BnTypeName = "UNSORT CC";
                model.CssVariantClass = "verify-unsort-cc";
                model.BnTypeCode = "UC";
                ViewData["NavColorClass"] = "nav-orange";
            }
            else if (bnType == AppBssBanknoteType.UnsortCAMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA MEMBER";
                model.CssVariantClass = "verify-ca-member";
                model.BnTypeCode = "CA";
                ViewData["NavColorClass"] = "nav-green";
            }
            else if (bnType == AppBssBanknoteType.UnsortCANonMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA NON-MEMBER";
                model.CssVariantClass = "verify-ca-non-member";
                model.BnTypeCode = "CN";
                ViewData["NavColorClass"] = "nav-purple";
            }
            else
            {
                model.BnTypeName = bnType ?? "UNFIT";
                model.CssVariantClass = "verify-unfit";
                model.BnTypeCode = bnType ?? "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }

            return View("~/Views/AutoSelling/VerifyConfirmation/Index.cshtml", model);
        }

        [AuthenticationActionFilter]
        public IActionResult ManualKeyIn()
        {
            if (!AppValidationHelper.ValidatOperationForVerify(_appShare.RoleCode, _appShare.MachineId))
            {
                return RedirectToUnauthorizedPage();
            }

            var model = new BSS_WEB.Views.Verify.ManualKeyIn.IndexModel();

            var bnType = _appShare.BnType;
            if (string.IsNullOrEmpty(bnType)) bnType = "UC";

            if (bnType == AppBssBanknoteType.Unfit.GetCategory())
            {
                model.BnTypeName = "UNFIT";
                model.BnTypeNameDisplay = "Edit & Manual Key-in UNFIT";
                model.CssVariantClass = "verify-unfit";
                model.BnTypeCode = "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }
            else if (bnType == AppBssBanknoteType.UnsortCC.GetCategory())
            {
                model.BnTypeName = "UNSORT CC";
                model.BnTypeNameDisplay = "Edit & Manual Key-in Unsort CC";
                model.CssVariantClass = "verify-unsort-cc";
                model.BnTypeCode = "UC";
                ViewData["NavColorClass"] = "nav-orange";
            }
            else if (bnType == AppBssBanknoteType.UnsortCAMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA MEMBER";
                model.BnTypeNameDisplay = "Edit & Manual Key-in Unsort CA Member";
                model.CssVariantClass = "verify-ca-member";
                model.BnTypeCode = "CA";
                ViewData["NavColorClass"] = "nav-green";
            }
            else if (bnType == AppBssBanknoteType.UnsortCANonMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA NON-MEMBER";
                model.BnTypeNameDisplay = "Edit & Manual Key-in Unsort CA Non-Member";
                model.CssVariantClass = "verify-ca-non-member";
                model.BnTypeCode = "CN";
                ViewData["NavColorClass"] = "nav-purple";
            }
            else
            {
                model.BnTypeName = bnType ?? "UNFIT";
                model.BnTypeNameDisplay = "Edit & Manual Key-in";
                model.CssVariantClass = "verify-unfit";
                model.BnTypeCode = bnType ?? "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }

            return View("~/Views/AutoSelling/ManualKeyIn/Index.cshtml", model);
        }

        [AuthenticationActionFilter]
        public IActionResult SecondScreenAutoSelling()
        {
            if (!AppValidationHelper.ValidatOperationForVerify(_appShare.RoleCode, _appShare.MachineId))
            {
                return RedirectToUnauthorizedPage();
            }

            var model = new BSS_WEB.Views.AutoSelling.SecondScreenAutoSelling.IndexModel();
            return View("~/Views/AutoSelling/SecondScreenAutoSelling/Index.cshtml", model);
        }

        #endregion View Actions

        #region AJAX Endpoints

        [HttpPost("AutoSelling/GetVerifyTransactionsDetailAsync")]
        public async Task<IActionResult> GetVerifyTransactionsDetailAsync([FromBody] PagedRequest<VerifyTransactionFilterRequest> request)
        {
            request.Filter = new VerifyTransactionFilterRequest
            {
                DepartmentId = _appShare.DepartmentId,
                IsActive = true,
            };

            var serviceResult = await _verifyTransactionService.GetVerifyTransactionsAsync(request);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> ScanHeaderCard([FromBody] VerifyScanRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.DepartmentId = _appShare.DepartmentId;
                request.MachineId = _appShare.MachineId;
                request.SorterId = _appShare.SorterUserId;
                request.CreatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _verifyTransactionService.ScanHeaderCardAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ScanHeaderCard failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "SCAN_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetHeaderCardDetail(long verifyTranId)
        {
            var serviceResult = await _verifyTransactionService.GetHeaderCardDetailAsync(verifyTranId);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> EditVerifyTran([FromBody] EditVerifyTranRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _verifyTransactionService.EditVerifyTranAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditVerifyTran failed. Id={Id}", request.VerifyTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "EDIT_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteVerifyTran([FromBody] DeleteVerifyTranRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _verifyTransactionService.DeleteVerifyTranAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteVerifyTran failed. Id={Id}", request.VerifyTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "DELETE_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetVerifyDetail(long id)
        {
            var serviceResult = await _verifyTransactionService.GetVerifyDetailAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> VerifyAction([FromBody] VerifyActionRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _verifyTransactionService.VerifyAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Verify failed. Id={Id}", request.VerifyTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "VERIFY_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CancelVerify([FromBody] CancelVerifyRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _verifyTransactionService.CancelVerifyAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CancelVerify failed. Id={Id}", request.VerifyTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "CANCEL_VERIFY_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetVerifyCount([FromBody] VerifyCountRequest request)
        {
            request.DepartmentId = _appShare.DepartmentId;
            var serviceResult = await _verifyTransactionService.GetVerifyCountAsync(request);
            return Json(serviceResult);
        }

        #endregion AJAX Endpoints

        #region Auto Selling AJAX Endpoints

        [HttpPost("AutoSelling/GetAutoSellingData")]
        public async Task<IActionResult> GetAutoSellingData([FromBody] AutoSellingFilterRequest request)
        {
            request.DepartmentId = _appShare.DepartmentId;
            var serviceResult = await _autoSellingApiService.GetAllDataAsync(request);
            return Json(serviceResult);
        }

        [HttpGet("AutoSelling/GetAutoSellingDetail")]
        public async Task<IActionResult> GetAutoSellingDetail(string headerCardCode)
        {
            var serviceResult = await _autoSellingApiService.GetDetailAsync(headerCardCode);
            return Json(serviceResult);
        }

        [HttpPost("AutoSelling/SaveAdjustment")]
        public async Task<IActionResult> SaveAdjustment([FromBody] AutoSellingAdjustmentRequest request)
        {
            try
            {
                var serviceResult = await _autoSellingApiService.SaveAdjustmentAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SaveAdjustment failed. HC={HC}", request.HeaderCardCode);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "SAVE_ADJUSTMENT_FAILED" });
            }
        }

        [HttpPost("AutoSelling/SaveInsertReplace")]
        public async Task<IActionResult> SaveInsertReplace([FromBody] AutoSellingInsertReplaceRequest request)
        {
            try
            {
                var serviceResult = await _autoSellingApiService.SaveInsertReplaceAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SaveInsertReplace failed. HC={HC}", request.HeaderCardCode);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "SAVE_INSERT_REPLACE_FAILED" });
            }
        }

        [HttpPost("AutoSelling/MergeBundles")]
        public async Task<IActionResult> MergeBundles([FromBody] AutoSellingMergeRequest request)
        {
            try
            {
                var serviceResult = await _autoSellingApiService.MergeBundlesAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MergeBundles failed. KeepId={KeepId}, MergeId={MergeId}",
                    request.KeepId, request.MergeId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "MERGE_BUNDLES_FAILED" });
            }
        }

        [HttpPost("AutoSelling/ValidateSummary")]
        public async Task<IActionResult> ValidateSummary([FromBody] AutoSellingValidateSummaryRequest request)
        {
            var serviceResult = await _autoSellingApiService.ValidateSummaryAsync(request);
            return Json(serviceResult);
        }

        [HttpPost("AutoSelling/CancelSend")]
        public async Task<IActionResult> CancelSend([FromBody] AutoSellingCancelSendRequest request)
        {
            try
            {
                var serviceResult = await _autoSellingApiService.CancelSendAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CancelSend failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "CANCEL_SEND_FAILED" });
            }
        }

        [HttpPost("AutoSelling/ChangeShift")]
        public async Task<IActionResult> ChangeShift([FromBody] AutoSellingChangeShiftRequest request)
        {
            try
            {
                var serviceResult = await _autoSellingApiService.ChangeShiftAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ChangeShift failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "CHANGE_SHIFT_FAILED" });
            }
        }

        [HttpPost("AutoSelling/SaveAdjustOffset")]
        public async Task<IActionResult> SaveAdjustOffset([FromBody] AdjustOffsetRequest request)
        {
            try
            {
                var serviceResult = await _autoSellingApiService.SaveAdjustOffsetAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SaveAdjustOffset failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "SAVE_ADJUST_OFFSET_FAILED" });
            }
        }

        #endregion Auto Selling AJAX Endpoints

        #region Manual Key-In AJAX Endpoints

        [HttpGet("Verify/ManualKeyInGetHeaderCardInfo")]
        public async Task<IActionResult> ManualKeyInGetHeaderCardInfo(string headerCardCode)
        {
            if (string.IsNullOrWhiteSpace(headerCardCode))
                return Json(new BaseServiceResult { is_success = false, msg_desc = "HEADER_CARD_CODE_REQUIRED" });

            try
            {
                var serviceResult = await _manualKeyInService.GetHeaderCardInfoAsync(headerCardCode);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ManualKeyInGetHeaderCardInfo failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "GET_HEADER_CARD_INFO_FAILED" });
            }
        }

        [HttpGet("Verify/ManualKeyInGetDenominations")]
        public async Task<IActionResult> ManualKeyInGetDenominations(long prepareId)
        {
            if (prepareId <= 0)
                return Json(new BaseServiceResult { is_success = false, msg_desc = "PREPARE_ID_INVALID" });

            try
            {
                var serviceResult = await _manualKeyInService.GetDenominationsAsync(prepareId);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ManualKeyInGetDenominations failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "GET_DENOMINATIONS_FAILED" });
            }
        }

        [HttpPost("Verify/ManualKeyInSave")]
        public async Task<IActionResult> ManualKeyInSave([FromBody] ManualKeyInSaveRequest request)
        {
            if (request == null || request.PrepareId <= 0 || string.IsNullOrWhiteSpace(request.HeaderCardCode))
                return Json(new BaseServiceResult { is_success = false, msg_desc = "INVALID_REQUEST" });

            if (!ModelState.IsValid)
                return Json(new BaseServiceResult { is_success = false, msg_desc = "VALIDATION_FAILED" });

            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.CreatedBy = appHelper.UserID.AsInt();
                request.DepartmentId = _appShare.DepartmentId;
                request.MachineHdId = _appShare.MachineId;
                request.SorterId = _appShare.SorterUserId;

                var serviceResult = await _manualKeyInService.SaveAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ManualKeyInSave failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "SAVE_FAILED" });
            }
        }

        [HttpPost("Verify/ManualKeyInSubmitForApproval")]
        public async Task<IActionResult> ManualKeyInSubmitForApproval([FromBody] ManualKeyInSubmitRequest request)
        {
            if (request == null || request.ReconcileTranId <= 0 || request.SupervisorId <= 0)
                return Json(new BaseServiceResult { is_success = false, msg_desc = "INVALID_REQUEST" });

            if (!ModelState.IsValid)
                return Json(new BaseServiceResult { is_success = false, msg_desc = "VALIDATION_FAILED" });

            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _manualKeyInService.SubmitForApprovalAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ManualKeyInSubmitForApproval failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "SUBMIT_FAILED" });
            }
        }

        [HttpGet("Verify/ManualKeyInGetSeriesList")]
        public async Task<IActionResult> ManualKeyInGetSeriesList()
        {
            try
            {
                var serviceResult = await _seriesDenomService.GetAllMasterSeriesDenomAsync();
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ManualKeyInGetSeriesList failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "GET_SERIES_LIST_FAILED" });
            }
        }

        #endregion Manual Key-In AJAX Endpoints
    }
}
