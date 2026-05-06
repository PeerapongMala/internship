using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.Helper;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Preparation;
using BSS_WEB.Services;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.PortableExecutable;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class PreparationController : BaseController
    {
        private readonly ILogger<PreparationController> _logger;
        private readonly IPreparationUnfitService _preparationUnfitService;
        private readonly IPreparationUnsortCaNonMemberService _preparationUnsortCaNonMemberService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterMachineService _machineService;
        private readonly IMasterConfigService _masterConfigService;
        private readonly IPreparationUnsortCcService _preparationUnsortCcService;
        private readonly IAppShare _appShare;
        private readonly IMasterShiftService _masterShiftService;

        private readonly IReceiveCbmsTransactionService _cbms;

        public PreparationController(ILogger<PreparationController> logger,
            IPreparationUnfitService preparationUnfitService,
            IPreparationUnsortCaNonMemberService preparationUnsortCaNonMemberService,
            IAppShare appShare,
            IMasterMachineService machineService,
            IPreparationUnsortCcService preparationUnsortCcService,
            IHttpContextAccessor httpContextAccessor,
            IMasterConfigService masterConfigService,
            IReceiveCbmsTransactionService cbms,
            IMasterShiftService masterShiftService) : base(appShare)

        {
            _logger = logger;
            _preparationUnfitService = preparationUnfitService;
            _preparationUnsortCaNonMemberService = preparationUnsortCaNonMemberService;
            _appShare = appShare;
            _machineService = machineService;
            _httpContextAccessor = httpContextAccessor;
            _preparationUnsortCcService = preparationUnsortCcService;
            _masterConfigService = masterConfigService;
            _cbms = cbms;
            _masterShiftService = masterShiftService;
        }

        #region DummyBarcode

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Dummy([FromBody] CreateDummyBarcodeRequest request)
        {

            var serviceResult = await _preparationUnfitService.GenerateDummyBarCodeAsync(request);
            return Json(serviceResult);
        }

        #endregion DummyBarcode

        #region PreparationUnfit

        public async Task<IActionResult> PreparationUnfit()
        {
            if (_appShare.BnType != AppBssBanknoteType.Unfit.GetCategory())
            {
                return RedirectToUnauthorizedPage();
            }

            if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
            {
                return RedirectToUnauthorizedPage();
            }

            var model = new BSS_WEB.Views.Preparation.PreparationUnfit.IndexModel();
            model.ShiftName = _appShare.ShiftName;
            model.ShiftStartTime = _appShare.ShiftStartTime;
            model.ShiftEndTime = _appShare.ShiftEndTime;
            model.Preparator = $"{_appShare.FirstName} {_appShare.LastName}";
            model.ConfigBssAlertShift = _appShare.ConfigBssAlertShift;
            model.SortingMachine = "-";
            if (_appShare.IsPrepareCentral != "YES")
            {
                var resultMachine = await _machineService.GetMachineByIdAsync(_appShare.MachineId);
                if (resultMachine.is_success)
                {
                    model.SortingMachine = resultMachine.data != null ? resultMachine.data.machineName : "";
                }
            }

            model.BnTypeNameDisplay = $"ประเภท: ธนบัตรรอตรวจนับ ({AppBssBanknoteType.Unfit.GetDescription().ToUpper()})";
            return View("~/Views/Preparation/PreparationUnfit/Index.cshtml", model);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> ValidateBarcodeStep([FromBody] ValidateBarcodeStepRequest model)
        {
            if (model == null)
            {
                return Json(new { isValid = false, errorMessage = "ข้อมูลไม่ถูกต้อง" });
            }

            var request = new ValidateBarcodeRequest
            {
                ValidateBarcodeType = string.Empty,
                BssBNTypeCode = model.BssBNTypeCode,
                ValidateExistingInDatabase = model.ValidateExistingInDatabase
            };

            if (_appShare.IsPrepareCentral == "YES")
            {
                // user prepare กลาง
                request.DepartmentId = _appShare.DepartmentId;
            }
            else
            {
                // user หน้าเครื่อง
                request.MachineId = _appShare.MachineId;
            }

            switch (model.StepIndex)
            {
                case 1: // ภาชนะ
                    request.ValidateBarcodeType = ValidateBarcodeTypeConstants.BarcodeContainer;
                    if (!string.IsNullOrWhiteSpace(model.ContainerBarcode))
                    {
                        request.DepartmentId = _appShare.DepartmentId;
                        request.ValidateBarcodeItem.Add(new ValidateBarcodeItem
                        {
                            BarcodeType = ValidateBarcodeTypeConstants.BarcodeContainer,
                            BarcodeValue = model.ContainerBarcode,
                        });
                    }
                    break;

                case 2: // ห่อ
                    request.ValidateBarcodeType = ValidateBarcodeTypeConstants.BarcodeWrap;
                    if (!string.IsNullOrWhiteSpace(model.WrapBarcode))
                    {
                        request.DepartmentId = _appShare.DepartmentId;
                        request.ContainerId = model.ContainerBarcode;
                        request.ValidateBarcodeItem.Add(new ValidateBarcodeItem
                        {
                            BarcodeType = ValidateBarcodeTypeConstants.BarcodeWrap,
                            BarcodeValue = model.WrapBarcode
                        });
                    }
                    break;

                case 3: // มัด bundle + wrap
                    request.ValidateBarcodeType = ValidateBarcodeTypeConstants.BarcodeBundle;

                    if (!string.IsNullOrWhiteSpace(model.BundleBarcode))
                    {
                        request.ContainerId = model.ContainerBarcode;
                        request.ValidateBarcodeItem.Add(new ValidateBarcodeItem
                        {
                            BarcodeType = ValidateBarcodeTypeConstants.BarcodeBundle,
                            BarcodeValue = model.BundleBarcode
                        });
                    }

                    if (!string.IsNullOrWhiteSpace(model.WrapBarcode))
                    {
                        request.ValidateBarcodeItem.Add(new ValidateBarcodeItem
                        {
                            BarcodeType = ValidateBarcodeTypeConstants.BarcodeWrap,
                            BarcodeValue = model.WrapBarcode
                        });
                    }
                    break;

                case 4: // Header Card
                    request.ValidateBarcodeType = ValidateBarcodeTypeConstants.HeaderCard;
                    if (!string.IsNullOrWhiteSpace(model.HeaderCardBarcode))
                    {
                        request.DepartmentId = _appShare.DepartmentId;
                        request.ContainerId = model.ContainerBarcode;
                        request.UnSortCcId = model.UnSortCcId;
                        request.ReceiveId = model.ReceiveId;
                        request.ValidateBarcodeItem.Add(new ValidateBarcodeItem
                        {
                            BarcodeType = ValidateBarcodeTypeConstants.HeaderCard,
                            BarcodeValue = model.HeaderCardBarcode
                        });
                    }
                    break;
            }

            ValidateBarcodeResponse response = await _preparationUnfitService.ValidateBarcodeAsync(request);
            return Json(response);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateContainerBarcode([FromBody] SaveContainerPrepare request)
        {
            if (request == null)
            {
                return Json(new BaseServiceResult
                {
                    is_success = false,
                    msg_desc = string.Empty
                });
            }

            var appHelper = new UserInfoHelper(_httpContextAccessor);

            request.machineId = appHelper.Machine.AsInt();
            request.departmentId = appHelper.DepartmentId.AsInt();
            request.createdBy = appHelper.UserID.AsInt();
            request.updatedBy = appHelper.UserID.AsInt();


            if (string.IsNullOrEmpty(request.packageCode) ||
                string.IsNullOrEmpty(request.bundleCode) ||
                string.IsNullOrEmpty(request.containerCode) ||
                string.IsNullOrEmpty(request.headerCardCode))
            {
                return Json(new BaseServiceResult
                {
                    is_success = false,
                    msg_desc = string.Empty
                });
            }

            var serviceResult = await _preparationUnfitService.CreateContainerBarcodeAsync(request);
            return Json(serviceResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetPreparationUnfitByDepartment(int departmentId)
        {
            var preparationResponse = await _preparationUnfitService.GetPreparationUnfitByDepartmentAsyn(departmentId);
            return Json(preparationResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreatePreparation([FromBody] CreateTransactionPreparationRequest request)
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            request.createdBy = appHelper.UserID.AsInt();

            var serviceResult = await _preparationUnfitService.CreatePreparationAsync(request);
            return Json(serviceResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdatePreparation([FromBody] UpdateTransactionPreparationRequest request)
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            request.updatedBy = appHelper.UserID.AsInt();

            var serviceResult = await _preparationUnfitService.UpdatePreparationAsync(request);
            return Json(serviceResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> DeletePreparation(int prepareId)
        {
            var serviceResult = await _preparationUnfitService.RemovePreparationAsync(prepareId);
            return Json(serviceResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetAllPreparation()
        {
            var serviceResult = await _preparationUnfitService.GetAllPreparationAsyn();
            return Json(serviceResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetPreparationById(long prepareId)
        {
            var serviceResult = await _preparationUnfitService.GetPreparationByIdAsync(prepareId);
            return Json(serviceResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateContainerPrepare([FromBody] CreateTransactionContainerPrepareRequest request)
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            request.createdBy = appHelper.UserID.AsInt();

            var serviceResult = await _preparationUnfitService.CreateContainerPrepareAsync(request);
            return Json(serviceResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateContainerPrepare([FromBody] UpdateTransactionContainerPrepareRequest request)
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            request.updatedBy = appHelper.UserID.AsInt();

            var serviceResult = await _preparationUnfitService.UpdateContainerPrepareAsync(request);
            return Json(serviceResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteContainerPrepare(long Id)
        {
            var serviceResult = await _preparationUnfitService.RemoveContainerPrepareAsync(Id);
            return Json(serviceResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetAllContainerPrepare(int department)
        {
            var serviceResult = await _preparationUnfitService.GetAllContainerPrepareAsyn(department);
            return Json(serviceResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetContainerPrepareById(long containerPrepareId)
        {
            var serviceResult = await _preparationUnfitService.GetContainerPrepareByIdAsync(containerPrepareId);
            return Json(serviceResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateReceiveCbmsData([FromBody] CreateTransactionReceiveCbmsDataRequest request)
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            request.createdBy = appHelper.UserID.AsInt();

            var serviceResult = await _preparationUnfitService.CreateReceiveCbmsDataAsync(request);
            return Json(serviceResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateReceiveCbmsData([FromBody] UpdateTransactionReceiveCbmsDataRequest request)
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            request.updatedBy = appHelper.UserID.AsInt();

            var serviceResult = await _preparationUnfitService.UpdateReceiveCbmsDataAsync(request);
            return Json(serviceResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteReceiveCbmsData(long Id)
        {
            var serviceResult = await _preparationUnfitService.RemoveReceiveCbmsDataAsync(Id);
            return Json(serviceResult);
        }
        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetAllReceiveCbmsData(int department)
        {
            var serviceResult = await _preparationUnfitService.GetAllReceiveCbmsDataAsyn(department);
            return Json(serviceResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetReceiveCbmsDataByIdAsync(long receiveId)
        {
            var serviceResult = await _preparationUnfitService.GetReceiveCbmsDataByIdAsync(receiveId);
            return Json(serviceResult);
        }

        [HttpPost("Preparation/GetPreparationUnfitsDetailAsync")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetPreparationUnfitsDetailAsync([FromBody] PagedRequest<PreparationUnfitRequest> request)
        {
            request.Filter = new PreparationUnfitRequest
            {
                DepartmentId = _appShare.DepartmentId,
                MachineId = _appShare.IsPrepareCentral == "YES" ? null : _appShare.MachineId,
                BnTypeId = BNTypeConstants.Unfit,
                StatusId = 9,
                IsReconcile = false,
                IsActive = true,
            };

            var serviceResult = await _preparationUnfitService.GetPreparationUnfitsAsync(request);
            if (_appShare.IsPrepareCentral != "YES")
            {
                //var configs = await _masterConfigService.GetByConfigTypeCode(ConfigConstants.BSS_FORNT_WORK_DAY);
                //var configList = configs.data ?? new List<MasterConfigDisplay>();

                //var bssStartTime = configList.ToViewPrepareBssWorkDayStartDateTime();
                //var bssEndTime = configList.ToViewPrepareBssWorkDayEndDateTime();


                var shiftResult = await _masterShiftService.GetCurrentShiftAsync();
                var currentShift = shiftResult.data ?? new ShiftInfoData();

                var bssStartTime = MasterShiftHelper
                    .ToViewPrepareBssFromShiftStartDateTime(currentShift?.shiftStartTime, currentShift?.shiftEndTime);

                var bssEndTime = MasterShiftHelper
                    .ToViewPrepareBssFromShiftEndDateTime(currentShift?.shiftStartTime, currentShift?.shiftEndTime);

                // ===== loop data =====
                foreach (var item in serviceResult?.Data?.Items ?? Enumerable.Empty<dynamic>())
                {
                    var createdDate = item.CreatedDate;

                    if (createdDate >= bssStartTime && createdDate <= bssEndTime)
                    {
                        item.IsFlag = true;
                    }
                    else
                    {
                        item.IsFlag = false;
                    }
                }

            }
            return Json(serviceResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> EditPreparationUnfit([FromBody] List<EditPreparationUnfitRequest> requests)
        {
            try
            {

                var serviceResult = await _preparationUnfitService.EditPreparationUnfitAsync(requests);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditPreparationUnfit failed. Items={Count}", requests?.Count ?? 0);

                return Json("EDIT_PREPARATION_UNFIT_FAILED");
            }
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> DeletePreparationUnfit([FromBody] List<DeletePreparationUnfitRequest> requests)
        {
            try
            {
                var serviceResult = await _preparationUnfitService.DeletePreparationUnfitAsync(requests);
                return Json(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeletePreparationUnfit failed. Items={Count}", requests?.Count ?? 0);

                return Json("DELETE_PREPARATION_UNFIT_FAILED");
            }
        }

        #endregion PreparationUnfit

        #region PreparationUnsortCaNonMember

        [HttpPost("Preparation/GetPreparationUnsortCaNonMembersDetailAsync")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetPreparationUnsortCaNonMembersDetailAsync([FromBody] PagedRequest<PreparationUnsortCaNonMemberRequest> request)
        {
            request.Filter = new PreparationUnsortCaNonMemberRequest
            {
                DepartmentId = _appShare.DepartmentId,
                MachineId = _appShare.IsPrepareCentral == "YES" ? null : _appShare.MachineId,
                BnTypeId = BNTypeConstants.UnsortCANonMember,
                StatusId = 9,
                IsReconcile = false,
                IsActive = true,
            };

            var serviceResult = await _preparationUnsortCaNonMemberService.GetPreparationUnsortCaNonMemberAsync(request);
            if (_appShare.IsPrepareCentral != "YES")
            {
                //var configs = await _masterConfigService.GetByConfigTypeCode(ConfigConstants.BSS_FORNT_WORK_DAY);
                //var configList = configs.data ?? new List<MasterConfigDisplay>();

                //var bssStartTime = configList.ToScanPrepareBssWorkDayStartDateTime();
                //var bssEndTime = configList.ToScanPrepareBssWorkDayEndDateTime();

                //var bssStartTime = configList.ToViewPrepareBssWorkDayStartDateTime();
                //var bssEndTime = configList.ToViewPrepareBssWorkDayEndDateTime();

                var shiftResult = await _masterShiftService.GetCurrentShiftAsync();
                var currentShift = shiftResult.data ?? new ShiftInfoData();

                var bssStartTime = MasterShiftHelper
                    .ToViewPrepareBssFromShiftStartDateTime(currentShift?.shiftStartTime, currentShift?.shiftEndTime);

                var bssEndTime = MasterShiftHelper
                    .ToViewPrepareBssFromShiftEndDateTime(currentShift?.shiftStartTime, currentShift?.shiftEndTime);

                // ===== loop data =====
                foreach (var item in serviceResult?.Data?.Items ?? Enumerable.Empty<dynamic>())
                {
                    var createdDate = item.CreatedDate;

                    if (createdDate >= bssStartTime && createdDate <= bssEndTime)
                    {
                        item.IsFlag = true;
                    }
                    else
                    {
                        item.IsFlag = false;
                    }
                }

            }

            return Json(serviceResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> PreviewCaNonMemberGenerateBarcode([FromBody] CreateContainerBarcodeRequest request)
        {
            request.DepartmentId = _appShare.DepartmentId;
            request.CreatedBy = _appShare.UserID;
            request.CompanyId = _appShare.CompanyId;
            request.MachineId = _appShare.IsPrepareCentral == "YES" ? null : _appShare.MachineId;
            var serviceResult = await _preparationUnsortCaNonMemberService.PreviewCaNonMemberGenerateBarcodeAsync(request);
            return Json(serviceResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreatePreparationCaNonMemberContainer([FromBody] CreateContainerBarcodeRequest request)
        {
            request.DepartmentId = _appShare.DepartmentId;
            request.CreatedBy = _appShare.UserID;
            request.CompanyId = _appShare.CompanyId;
            request.MachineId = _appShare.IsPrepareCentral == "YES" ? null : _appShare.MachineId;
            var serviceResult = await _preparationUnsortCaNonMemberService.CreatePreparationCaNonMemberContainer(request);
            return Json(serviceResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetExistingTransactionContainerPrepare([FromBody] ExistingTransactionContainerPrepareRequest request)
        {
            var serviceResult = await _preparationUnsortCaNonMemberService.GetExistingTransactionContainerPrepare(request);
            return Json(serviceResult);
        }

        #endregion PreparationUnsortCaNonMember

        #region PreparationUnsoftCC

        public async Task<IActionResult> PreparationUnsoftCC()
        {
            if (_appShare.BnType != AppBssBanknoteType.UnsortCC.GetCategory())
            {
                return RedirectToUnauthorizedPage();
            }

            if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId) || !AppValidationHelper.ValidatForOperationSetting(_appShare.RoleGroupCode))
            {
                return RedirectToUnauthorizedPage();
            }
            var model = new BSS_WEB.Views.Preparation.PreparationUnsoftCC.IndexModel();
            model.ShiftName = _appShare.ShiftName;
            model.ShiftStartTime = _appShare.ShiftStartTime;
            model.ShiftEndTime = _appShare.ShiftEndTime;
            model.Preparator = $"{_appShare.FirstName} {_appShare.LastName}";
            model.ConfigBssAlertShift = _appShare.ConfigBssAlertShift;
            model.SortingMachine = "-";
            model.companyId = _appShare.CompanyId;
            model.departmentId = _appShare.DepartmentId;
            if (_appShare.IsPrepareCentral != "YES")
            {
                var resultMachine = await _machineService.GetMachineByIdAsync(_appShare.MachineId);
                if (resultMachine.is_success)
                {
                    model.SortingMachine = resultMachine.data != null ? resultMachine.data.machineName : "";
                }
            }

            return View("~/Views/Preparation/PreparationUnsoftCC/Index.cshtml", model);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CheckValidateTransactionUnSortCc([FromBody] CheckValidateTransactionUnSortCcRequest request)
        {
            try
            {
                request.ContainerId = request.ContainerId.ToUpper();
                request.DepartmentId = _appShare.DepartmentId;
                request.CompanyId = _appShare.CompanyId;
                var serviceResult = await _preparationUnsortCcService.CheckValidateTransactionUnSortCc(request);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CheckValidateTransactionUnSortCc {Count}", request.ToString());

                return BadRequest("CHECK_VALIDATE_TRANSACTION_UNSORT_CC_FAILED");
            }
        }

        #endregion PreparationUnsoftCC

        #region PreparationUnsortCCNonMember

        #endregion PreparationUnsortCCNonMember

        public async Task<IActionResult> PreparationUnsortCAMember()
        {
            if (_appShare.BnType != AppBssBanknoteType.UnsortCAMember.GetCategory())
            {
                return RedirectToUnauthorizedPage();
            }

            if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId) || !AppValidationHelper.ValidatForOperationSetting(_appShare.RoleGroupCode))
            {
                return RedirectToUnauthorizedPage();
            }

            var model = new BSS_WEB.Views.Preparation.PreparationUnsortCAMember.IndexModel();
            model.ShiftName = _appShare.ShiftName;
            model.ShiftStartTime = _appShare.ShiftStartTime;
            model.ShiftEndTime = _appShare.ShiftEndTime;
            model.Preparator = $"{_appShare.FirstName} {_appShare.LastName}";
            model.ConfigBssAlertShift = _appShare.ConfigBssAlertShift;
            model.SortingMachine = "-";
            if (_appShare.IsPrepareCentral != "YES")
            {
                var resultMachine = await _machineService.GetMachineByIdAsync(_appShare.MachineId);
                if (resultMachine.is_success)
                {
                    model.SortingMachine = resultMachine.data != null ? resultMachine.data.machineName : "";
                }
            }

            return View("~/Views/Preparation/PreparationUnsortCAMember/Index.cshtml", model);
        }

        public async Task<IActionResult> PreparationUnsortCANonMember()
        {
            if (_appShare.BnType != AppBssBanknoteType.UnsortCANonMember.GetCategory())
            {
                return RedirectToUnauthorizedPage();
            }

            if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId) || !AppValidationHelper.ValidatForOperationSetting(_appShare.RoleGroupCode))
            {
                return RedirectToUnauthorizedPage();
            }

            var model = new BSS_WEB.Views.Preparation.PreparationUnsortCANonMember.IndexModel();
            model.ShiftName = _appShare.ShiftName;
            model.ShiftStartTime = _appShare.ShiftStartTime;
            model.ShiftEndTime = _appShare.ShiftEndTime;
            model.Preparator = $"{_appShare.FirstName} {_appShare.LastName}";
            model.ConfigBssAlertShift = _appShare.ConfigBssAlertShift;
            model.SortingMachine = "-";
            if (_appShare.IsPrepareCentral != "YES")
            {
                var resultMachine = await _machineService.GetMachineByIdAsync(_appShare.MachineId);
                if (resultMachine.is_success)
                {
                    model.SortingMachine = resultMachine.data != null ? resultMachine.data.machineName : "";
                }
            }

            return View("~/Views/Preparation/PreparationUnsortCANonMember/Index.cshtml", model);
        }


        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetCountPrepareByContainer([FromBody] CountPrepareByContainerRequest request)
        {
            request.departmentId = _appShare.DepartmentId;
            var result = await _preparationUnfitService.GetCountPrepareByContainerAsync(request);
            return Json(result);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetCountReconcile([FromBody] GetCountReconcileRequest request)
        {
            request.departmentId = _appShare.DepartmentId;
            request.prepareCentral = _appShare.IsPrepareCentral;
            request.machineId = _appShare.MachineId;
            request.bnTypeCode = _appShare.BnType;
            if (_appShare.IsPrepareCentral == "YES")
            {
                request.machineId = 0;
            }

            #region / * Prepare Date Start - Date End * /
            string _dateStart = DateOnly.FromDateTime(DateTime.Now).ToString("yyyy-MM-dd");
            string _timeStart = _appShare.ConfigBssStartTime.ToString();
            DateTime newDateTimeStart = Convert.ToDateTime(_dateStart + " " + _timeStart);

            string _dateEnd = DateOnly.FromDateTime(DateTime.Now).ToString("yyyy-MM-dd");
            string _timeEnd = _appShare.ConfigBssEndTime.ToString();
            DateTime newDateTimeEnd = Convert.ToDateTime(_dateEnd + " " + _timeEnd);

            #endregion / * Prepare Date Start - Date End * /

            request.dateTimeStart = newDateTimeStart;
            request.dateTimeEnd = newDateTimeEnd;

            var result = await _preparationUnfitService.GetCountReconcileAsync(request);
            return Json(result);
        }

        public IActionResult SecondScreenPreparationUnfit()
        {
            if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
            {
                return RedirectToUnauthorizedPage();
            }

            var model = new BSS_WEB.Views.Preparation.DisplayTwoPreparation.IndexModel();
            return View("~/Views/Preparation/SecondScreenPreparationUnfit/Index.cshtml", model);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetBankfromBarcode([FromBody] GetCountReconcileRequest request)
        {
            var serviceResult = await _cbms.GetAllReceiveCbmsDataAsyn(1);
            return Json(serviceResult);
        }

        public IActionResult SecondScreenPreparationUnsortCANonMember()
        {
            if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
            {
                return RedirectToUnauthorizedPage();
            }

            var model = new BSS_WEB.Views.Preparation.SecondScreenPreparationUnsortCANonMember.IndexModel();
            return View("~/Views/Preparation/SecondScreenPreparationUnsortCANonMember/Index.cshtml", model);
        }

        public IActionResult SecondScreenPreparationUnsortCAMember()
        {
            if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
            {
                return RedirectToUnauthorizedPage();
            }

            var model = new BSS_WEB.Views.Preparation.SecondScreenPreparationUnsortCAMember.IndexModel();
            return View("~/Views/Preparation/SecondScreenPreparationUnsortCAMember/Index.cshtml", model);
        }

        public IActionResult SecondScreenPreparationUnsortCC()
        {
            if (!AppValidationHelper.ValidatOperationForPreparation(_appShare.RoleCode, _appShare.IsPrepareCentral, _appShare.MachineId))
            {
                return RedirectToUnauthorizedPage();
            }

            var model = new BSS_WEB.Views.Preparation.SecondScreenPreparationUnsortCC.IndexModel();
            return View("~/Views/Preparation/SecondScreenPreparationUnsortCC/Index.cshtml", model);
        }
    }
}

