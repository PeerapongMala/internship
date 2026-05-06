using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    public class ReconcilationController : BaseController
    {
        private readonly ILogger<ReconcilationController> _logger;
        private readonly IReconcileTransactionService _reconcileTransactionService;
<<<<<<< HEAD
        private readonly IReconsileTransactionService _reconsileTransactionService;
=======
        private readonly IReconciliationTransactionService _reconsileTransactionService;
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterMachineService _machineService;
        private readonly IAppShare _appShare;

        public ReconcilationController(
            ILogger<ReconcilationController> logger,
            IReconcileTransactionService reconcileTransactionService,
<<<<<<< HEAD
            IReconsileTransactionService reconsileTransactionService,
=======
            IReconciliationTransactionService reconsileTransactionService,
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            IAppShare appShare,
            IMasterMachineService machineService,
            IHttpContextAccessor httpContextAccessor) : base(appShare)
        {
            _logger = logger;
            _reconcileTransactionService = reconcileTransactionService;
            _reconsileTransactionService = reconsileTransactionService;
            _appShare = appShare;
            _machineService = machineService;
            _httpContextAccessor = httpContextAccessor;
        }

        #region View Actions

        [AuthenticationActionFilter]
        public IActionResult Index()
        {
            return RedirectToAction("ReconcileTransaction");
        }

        [AuthenticationActionFilter]
        public async Task<IActionResult> ReconcileTransaction()
        {
            var model = new BSS_WEB.Views.Reconcilation.ReconcileTransaction.IndexModel();
            model.ShiftName = _appShare.ShiftName;
            model.Reconciliator = $"{_appShare.FirstName} {_appShare.LastName}";
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
                model.BnTypeNameDisplay = "กระทบยอดธนบัตรประเภท UNFIT";
                model.CssVariantClass = "reconcile-unfit";
                model.BnTypeCode = "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }
            else if (bnType == AppBssBanknoteType.UnsortCC.GetCategory())
            {
                model.BnTypeName = "UNSORT CC";
                model.BnTypeNameDisplay = "กระทบยอดธนบัตรประเภท UNSORT CC";
                model.CssVariantClass = "reconcile-unsort-cc";
                model.BnTypeCode = "UC";
                ViewData["NavColorClass"] = "nav-orange";
            }
            else if (bnType == AppBssBanknoteType.UnsortCAMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA MEMBER";
                model.BnTypeNameDisplay = "กระทบยอดธนบัตรประเภท UNSORT CA MEMBER";
                model.CssVariantClass = "reconcile-ca-member";
                model.BnTypeCode = "CA";
                ViewData["NavColorClass"] = "nav-green";
            }
            else if (bnType == AppBssBanknoteType.UnsortCANonMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA NON-MEMBER";
                model.BnTypeNameDisplay = "กระทบยอดธนบัตรประเภท UNSORT CA NON-MEMBER";
                model.CssVariantClass = "reconcile-ca-non-member";
                model.BnTypeCode = "CN";
                ViewData["NavColorClass"] = "nav-purple";
            }
            else
            {
                model.BnTypeName = bnType ?? "UNFIT";
                model.BnTypeNameDisplay = "กระทบยอดธนบัตร";
                model.CssVariantClass = "reconcile-unfit";
                model.BnTypeCode = bnType ?? "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }

            return View("~/Views/Reconcilation/ReconcileTransaction/Index.cshtml", model);
        }

        #endregion View Actions

        #region AJAX Endpoints

        [HttpPost("Reconcilation/GetReconcileTransactionsDetailAsync")]
        public async Task<IActionResult> GetReconcileTransactionsDetailAsync([FromBody] PagedRequest<ReconcileTransactionFilterRequest> request)
        {
            request.Filter = new ReconcileTransactionFilterRequest
            {
                DepartmentId = _appShare.DepartmentId,
<<<<<<< HEAD
=======
                BnTypeCode = _appShare.BnType,
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                IsActive = true,
            };

            var serviceResult = await _reconcileTransactionService.GetReconcileTransactionsAsync(request);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> ScanHeaderCard([FromBody] ReconcileScanRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.DepartmentId = _appShare.DepartmentId;
                request.MachineId = _appShare.MachineId;
                request.SorterId = _appShare.SorterUserId;
                request.CreatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _reconcileTransactionService.ScanHeaderCardAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ScanHeaderCard failed");
                return Json(new BaseServiceResult { is_success = false, msg_desc = "SCAN_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetHeaderCardDetail(long reconcileTranId)
        {
            var serviceResult = await _reconcileTransactionService.GetHeaderCardDetailAsync(reconcileTranId);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> EditReconcileTran([FromBody] EditReconcileTranRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _reconcileTransactionService.EditReconcileTranAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditReconcileTran failed. Id={Id}", request.ReconcileTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "EDIT_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteReconcileTran([FromBody] DeleteReconcileTranRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _reconcileTransactionService.DeleteReconcileTranAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteReconcileTran failed. Id={Id}", request.ReconcileTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "DELETE_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetReconcileDetail(long id)
        {
            var serviceResult = await _reconcileTransactionService.GetReconcileDetailAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> Reconcile([FromBody] ReconcileActionRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _reconcileTransactionService.ReconcileAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Reconcile failed. Id={Id}", request.ReconcileTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "RECONCILE_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CancelReconcile([FromBody] CancelReconcileRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _reconcileTransactionService.CancelReconcileAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CancelReconcile failed. Id={Id}", request.ReconcileTranId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "CANCEL_RECONCILE_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetReconcileCount([FromBody] ReconcileCountRequest request)
        {
            request.DepartmentId = _appShare.DepartmentId;
            var serviceResult = await _reconcileTransactionService.GetReconcileCountAsync(request);
            return Json(serviceResult);
        }

<<<<<<< HEAD
=======
        [HttpPut]
        public async Task<IActionResult> EditPrepareHc([FromBody] EditPrepareHcRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _reconcileTransactionService.EditPrepareHcAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditPrepareHc failed. Id={Id}", request.PrepareId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "EDIT_PREPARE_HC_FAILED" });
            }
        }

        [HttpPut]
        public async Task<IActionResult> EditMachineHc([FromBody] EditMachineHcRequest request)
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _reconcileTransactionService.EditMachineHcAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditMachineHc failed. Id={Id}", request.MachineHdId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "EDIT_MACHINE_HC_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPrepareHeaderCards()
        {
            try
            {
                var departmentId = _appShare.DepartmentId;
                int? machineId = _appShare.IsPrepareCentral == "YES" ? null : _appShare.MachineId;
                var bnTypeCode = _appShare.BnType;
                var serviceResult = await _reconcileTransactionService
                    .GetPrepareHeaderCardsAsync(departmentId, machineId, bnTypeCode);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetPrepareHeaderCards failed for dept {DeptId}", _appShare.DepartmentId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "GET_PREPARE_HEADER_CARDS_FAILED" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetMachineHeaderCards()
        {
            try
            {
                var machineId = _appShare.MachineId;
                var serviceResult = await _reconcileTransactionService.GetMachineHeaderCardsAsync(machineId);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetMachineHeaderCards failed for machine {MachineId}", _appShare.MachineId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "GET_MACHINE_HEADER_CARDS_FAILED" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest? request)
        {
            try
            {
                var refreshRequest = request ?? new RefreshRequest();
                refreshRequest.MachineId = _appShare.MachineId;

                var serviceResult = await _reconcileTransactionService.RefreshAsync(refreshRequest);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Refresh failed for machine {MachineId}", _appShare.MachineId);
                return Json(new BaseServiceResult { is_success = false, msg_desc = "REFRESH_FAILED" });
            }
        }

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        #endregion AJAX Endpoints

        #region Reconsile View Actions

<<<<<<< HEAD
        [AuthenticationActionFilter]
        public async Task<IActionResult> Reconsile()
=======
        // Redirect old /Reconsile URL to /Reconciliation
        [AuthenticationActionFilter]
        public IActionResult Reconsile()
        {
            return RedirectToAction(nameof(Reconciliation));
        }

        [AuthenticationActionFilter]
        public async Task<IActionResult> Reconciliation()
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        {
            var model = new BSS_WEB.Views.Reconcilation.Reconsile.IndexModel();
            try { model.ShiftName = _appShare.ShiftName; } catch { model.ShiftName = "กะที่ 1"; }
            try { model.Reconciliator = $"{_appShare.FirstName} {_appShare.LastName}"; } catch { model.Reconciliator = "ทดสอบ ระบบ"; }
            model.SortingMachine = "-";

            try
            {
                var resultMachine = await _machineService.GetMachineByIdAsync(_appShare.MachineId);
                if (resultMachine.is_success)
                {
                    model.SortingMachine = resultMachine.data != null ? resultMachine.data.machineName : "";
                }
            }
            catch { }

            // Determine variant based on BnType
            string bnType = null;
            try { bnType = _appShare.BnType; } catch { }
            if (bnType == AppBssBanknoteType.Unfit.GetCategory())
            {
                model.BnTypeName = "UNFIT";
                model.BnTypeNameDisplay = "Reconciliation UNFIT";
                model.CssVariantClass = "reconsile-unfit";
                model.BnTypeCode = "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }
            else if (bnType == AppBssBanknoteType.UnsortCC.GetCategory())
            {
                model.BnTypeName = "UNSORT CC";
                model.BnTypeNameDisplay = "Reconciliation UNSORT CC";
                model.CssVariantClass = "reconsile-unsort-cc";
                model.BnTypeCode = "UC";
                ViewData["NavColorClass"] = "nav-orange";
            }
            else if (bnType == AppBssBanknoteType.UnsortCAMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA MEMBER";
                model.BnTypeNameDisplay = "Reconciliation UNSORT CA MEMBER";
                model.CssVariantClass = "reconsile-ca-member";
                model.BnTypeCode = "CA";
                ViewData["NavColorClass"] = "nav-green";
            }
            else if (bnType == AppBssBanknoteType.UnsortCANonMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA NON-MEMBER";
                model.BnTypeNameDisplay = "Reconciliation UNSORT CA NON-MEMBER";
                model.CssVariantClass = "reconsile-ca-non-member";
                model.BnTypeCode = "CN";
                ViewData["NavColorClass"] = "nav-purple";
            }
            else
            {
                model.BnTypeName = bnType ?? "UNFIT";
                model.BnTypeNameDisplay = "Reconciliation UNFIT";
                model.CssVariantClass = "reconsile-unfit";
                model.BnTypeCode = bnType ?? "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }

            return View("~/Views/Reconcilation/Reconsile/Index.cshtml", model);
        }

<<<<<<< HEAD
=======
        public IActionResult SecondScreenReconsile()
        {
            var model = new BSS_WEB.Views.Reconcilation.SecondScreenReconsile.IndexModel();
            return View("~/Views/Reconcilation/SecondScreenReconsile/Index.cshtml", model);
        }

>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        #endregion Reconsile View Actions

        #region Holding View Actions

        [AuthenticationActionFilter]
        public async Task<IActionResult> Holding()
        {
            var model = new BSS_WEB.Views.Holding.HoldingNoDetail.IndexModel();

            try { model.ShiftName = _appShare.ShiftName; } catch { model.ShiftName = "-"; }
            try { model.Reconciliator = $"{_appShare.FirstName} {_appShare.LastName}"; } catch { model.Reconciliator = "-"; }
            model.Sorter = "-";
            model.SortingMachine = "-";

            try
            {
                var resultMachine = await _machineService.GetMachineByIdAsync(_appShare.MachineId);
                if (resultMachine.is_success)
                {
                    model.SortingMachine = resultMachine.data != null ? resultMachine.data.machineName : "";
                }
            }
            catch { }

            // Determine variant based on BnType
            string bnType = null;
            try { bnType = _appShare.BnType; } catch { }

            if (bnType == AppBssBanknoteType.Unfit.GetCategory())
            {
                model.BnTypeName = "UNFIT";
                model.CssVariantClass = "holding-unfit";
                model.BnTypeCode = "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }
            else if (bnType == AppBssBanknoteType.UnsortCC.GetCategory())
            {
                model.BnTypeName = "UNSORT CC";
                model.CssVariantClass = "holding-unsort-cc";
                model.BnTypeCode = "UC";
                ViewData["NavColorClass"] = "nav-orange";
            }
            else if (bnType == AppBssBanknoteType.UnsortCAMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA MEMBER";
                model.CssVariantClass = "holding-ca-member";
                model.BnTypeCode = "CA";
                ViewData["NavColorClass"] = "nav-green";
            }
            else if (bnType == AppBssBanknoteType.UnsortCANonMember.GetCategory())
            {
                model.BnTypeName = "UNSORT CA NON-MEMBER";
                model.CssVariantClass = "holding-ca-non-member";
                model.BnTypeCode = "CN";
                ViewData["NavColorClass"] = "nav-purple";
            }
            else
            {
                model.BnTypeName = bnType ?? "UNFIT";
                model.CssVariantClass = "holding-unfit";
                model.BnTypeCode = bnType ?? "UF";
                ViewData["NavColorClass"] = "nav-blue-light";
            }

            return View("~/Views/Holding/HoldingNoDetail/Index.cshtml", model);
        }

        #endregion Holding View Actions

        #region Reconsile AJAX Endpoints

<<<<<<< HEAD
        [HttpPost("Reconcilation/GetReconsileTransactionsDetailAsync")]
        public async Task<IActionResult> GetReconsileTransactionsDetailAsync([FromBody] PagedRequest<ReconsileFilterRequest> request)
        {
            request.Filter = new ReconsileFilterRequest
=======
        // --- Reconciliation endpoints (IReconciliationTransactionService) ---

        [HttpPost("Reconcilation/GetReconciliationTransactionsDetailAsync")]
        public async Task<IActionResult> GetReconciliationTransactionsDetailAsync([FromBody] PagedRequest<ReconciliationFilterRequest> request)
        {
            request.Filter = new ReconciliationFilterRequest
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            {
                DepartmentId = _appShare.DepartmentId,
                IsActive = true,
            };

<<<<<<< HEAD
            var serviceResult = await _reconsileTransactionService.GetReconsileTransactionsAsync(request);
=======
            var serviceResult = await _reconsileTransactionService.GetReconciliationTransactionsAsync(request);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            return Json(serviceResult);
        }

        [HttpPost]
<<<<<<< HEAD
        public async Task<IActionResult> ReconsileScanHeaderCard([FromBody] ReconsileScanRequest request)
=======
        public async Task<IActionResult> ReconciliationScanHeaderCard([FromBody] ReconciliationScanRequest request)
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.DepartmentId = _appShare.DepartmentId;
                request.MachineId = _appShare.MachineId;
                request.SorterId = _appShare.SorterUserId;
                request.CreatedBy = appHelper.UserID.AsInt();

                var serviceResult = await _reconsileTransactionService.ScanHeaderCardAsync(request);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
<<<<<<< HEAD
                _logger.LogError(ex, "ReconsileScanHeaderCard failed");
=======
                _logger.LogError(ex, "ReconcileScanHeaderCard failed");
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                return Json(new BaseServiceResult { is_success = false, msg_desc = "SCAN_FAILED" });
            }
        }

        [HttpGet]
<<<<<<< HEAD
        public async Task<IActionResult> GetReconsileHeaderCardDetail(long reconsileTranId)
=======
        public async Task<IActionResult> GetReconciliationHeaderCardDetail(long reconsileTranId)
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        {
            var serviceResult = await _reconsileTransactionService.GetHeaderCardDetailAsync(reconsileTranId);
            return Json(serviceResult);
        }

        [HttpPost]
<<<<<<< HEAD
        public async Task<IActionResult> EditReconsileTran([FromBody] EditReconsileTranRequest request)
=======
        public async Task<IActionResult> EditReconciliationTran([FromBody] EditReconciliationTranRequest request)
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

<<<<<<< HEAD
                var serviceResult = await _reconsileTransactionService.EditReconsileTranAsync(request);
=======
                var serviceResult = await _reconsileTransactionService.EditReconciliationTranAsync(request);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
<<<<<<< HEAD
                _logger.LogError(ex, "EditReconsileTran failed. Id={Id}", request.ReconsileTranId);
=======
                _logger.LogError(ex, "EditReconciliationTran failed. Id={Id}", request.ReconciliationTranId);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                return Json(new BaseServiceResult { is_success = false, msg_desc = "EDIT_FAILED" });
            }
        }

        [HttpPost]
<<<<<<< HEAD
        public async Task<IActionResult> DeleteReconsileTran([FromBody] DeleteReconsileTranRequest request)
=======
        public async Task<IActionResult> DeleteReconciliationTran([FromBody] DeleteReconciliationTranRequest request)
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

<<<<<<< HEAD
                var serviceResult = await _reconsileTransactionService.DeleteReconsileTranAsync(request);
=======
                var serviceResult = await _reconsileTransactionService.DeleteReconciliationTranAsync(request);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
<<<<<<< HEAD
                _logger.LogError(ex, "DeleteReconsileTran failed. Id={Id}", request.ReconsileTranId);
=======
                _logger.LogError(ex, "DeleteReconciliationTran failed. Id={Id}", request.ReconciliationTranId);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                return Json(new BaseServiceResult { is_success = false, msg_desc = "DELETE_FAILED" });
            }
        }

        [HttpGet]
<<<<<<< HEAD
        public async Task<IActionResult> GetReconsileDetail(long id)
        {
            var serviceResult = await _reconsileTransactionService.GetReconsileDetailAsync(id);
=======
        public async Task<IActionResult> GetReconciliationDetail(long id)
        {
            var serviceResult = await _reconsileTransactionService.GetReconciliationDetailAsync(id);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            return Json(serviceResult);
        }

        [HttpPost]
<<<<<<< HEAD
        public async Task<IActionResult> ReconsileAction([FromBody] ReconsileActionRequest request)
=======
        public async Task<IActionResult> ReconciliationAction([FromBody] ReconciliationActionRequest request)
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

<<<<<<< HEAD
                var serviceResult = await _reconsileTransactionService.ReconsileAsync(request);
=======
                var serviceResult = await _reconsileTransactionService.ReconciliationAsync(request);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
<<<<<<< HEAD
                _logger.LogError(ex, "Reconsile failed. Id={Id}", request.ReconsileTranId);
=======
                _logger.LogError(ex, "Reconciliation failed. Id={Id}", request.ReconciliationTranId);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                return Json(new BaseServiceResult { is_success = false, msg_desc = "RECONSILE_FAILED" });
            }
        }

        [HttpPost]
<<<<<<< HEAD
        public async Task<IActionResult> CancelReconsile([FromBody] CancelReconsileRequest request)
=======
        public async Task<IActionResult> CancelReconciliation([FromBody] CancelReconciliationRequest request)
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        {
            try
            {
                var appHelper = new UserInfoHelper(_httpContextAccessor);
                request.UpdatedBy = appHelper.UserID.AsInt();

<<<<<<< HEAD
                var serviceResult = await _reconsileTransactionService.CancelReconsileAsync(request);
=======
                var serviceResult = await _reconsileTransactionService.CancelReconciliationAsync(request);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
<<<<<<< HEAD
                _logger.LogError(ex, "CancelReconsile failed. Id={Id}", request.ReconsileTranId);
=======
                _logger.LogError(ex, "CancelReconciliation failed. Id={Id}", request.ReconciliationTranId);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
                return Json(new BaseServiceResult { is_success = false, msg_desc = "CANCEL_RECONSILE_FAILED" });
            }
        }

        [HttpPost]
<<<<<<< HEAD
        public async Task<IActionResult> GetReconsileCount([FromBody] ReconsileCountRequest request)
        {
            request.DepartmentId = _appShare.DepartmentId;
            var serviceResult = await _reconsileTransactionService.GetReconsileCountAsync(request);
=======
        public async Task<IActionResult> GetReconciliationCount([FromBody] ReconciliationCountRequest request)
        {
            request.DepartmentId = _appShare.DepartmentId;
            var serviceResult = await _reconsileTransactionService.GetReconciliationCountAsync(request);
            return Json(serviceResult);
        }

        [HttpGet]
        public async Task<IActionResult> CheckChildHeaderCard(string headerCardCode)
        {
            var serviceResult = await _reconsileTransactionService.CheckChildHeaderCardAsync(headerCardCode);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
            return Json(serviceResult);
        }

        #endregion Reconsile AJAX Endpoints
    }
}
