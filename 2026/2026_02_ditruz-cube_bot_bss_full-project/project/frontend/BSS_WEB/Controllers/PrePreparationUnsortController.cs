using BSS_WEB.Core.Constants;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Preparation;
using BSS_WEB.Services;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class PrePreparationUnsortController : Controller
    {
        private readonly ILogger<PrePreparationUnsortController> _logger;
        private readonly IRegisterUnsortService _mainService;
        private readonly IMasterInstitutionService _institutionService;
        private readonly IMasterDenominationService _denominationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IPreparationUnfitService _preparationUnfitService;
        private readonly IAppShare _appShare;
        private readonly IUnsortReceiveDeliveryService _ReceiveService;
        public PrePreparationUnsortController(ILogger<PrePreparationUnsortController> logger,
            IRegisterUnsortService mainService,
            IMasterInstitutionService institutionService,
            IMasterDenominationService denominationService,
            IHttpContextAccessor httpContextAccessor,
            IPreparationUnfitService preparationUnfitService,
            IAppShare appShare, IUnsortReceiveDeliveryService ReceiveService)

        {
            _logger = logger;
            _mainService = mainService;
            _institutionService = institutionService;
            _denominationService = denominationService;
            _httpContextAccessor = httpContextAccessor;
            _preparationUnfitService = preparationUnfitService;
            _appShare = appShare;
            _ReceiveService = ReceiveService;
        }

        public IActionResult RegisterUnsort()
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            var appUser = appHelper.GetUserInfo;
            var userId = appUser.UserNameID;
            var userRole = appUser.RoleId;
            var DepartmentId = appUser.DepartmentId;

            return View("~/Views/PrePreparationUnsort/RegisterUnsort/RegisterUnsort.cshtml");
        }

        [HttpGet]
        public async Task<IActionResult> GetRegisterUnsortList()
        {
            var RegisterUnsortResponse = await _mainService.GetRegisterUnsortAllAsync();
            return Json(RegisterUnsortResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetEditRegisterUnsortById(long id)
        {
            var registerUnsortResponse = await _mainService.GetRegisterUnsortByIdAsync(id);
            return Json(registerUnsortResponse);
        }

        [HttpPost]
        public async Task<IActionResult> EditRegisterUnsortContainer(
            [FromBody] ConfirmRegisterUnsortRequest confirmRegisterUnsortRequest)
        {
            confirmRegisterUnsortRequest.RequestDepartmentId = _appShare.DepartmentId;
            var registerUnsortResponse = await _mainService.EditRegisterUnsortContainerAsync(confirmRegisterUnsortRequest);
            return Json(registerUnsortResponse);
        }

        [HttpPost]
        public async Task<IActionResult> EditUnsortCCStatusDelivery(
            [FromBody] ConfirmUnsortCCRequest confirmUnsortCCRequest)
        {
            var registerUnsortResponse = await _mainService.EditUnsortCCStatusDeliveryAsync(confirmUnsortCCRequest);
            return Json(registerUnsortResponse);
        }

        [HttpPost]
        public async Task<IActionResult> ConfirmRegisterUnsort([FromBody] ConfirmRegisterUnsortRequest confirmRegisterUnsortRequest)
        {
            confirmRegisterUnsortRequest.createdBy = _appShare.UserID;
            confirmRegisterUnsortRequest.updatedBy = _appShare.UserID;
            confirmRegisterUnsortRequest.companyId = _appShare.CompanyId;
            confirmRegisterUnsortRequest.departmentId = _appShare.DepartmentId;
            confirmRegisterUnsortRequest.RequestDepartmentId = _appShare.DepartmentId;
            return Json(await _mainService.ConfirmRegisterUnsortAsync(confirmRegisterUnsortRequest));
        }

        [HttpGet]
        public async Task<IActionResult> DeleteRegisterUnsort(long id)
        {
            var registerUnsortResponse = await _mainService.DeleteRegisterUnsortAsync(id);
            return Json(registerUnsortResponse);
        }

        [HttpPost]
        public async Task<IActionResult> GetUnsortCCListFilter([FromBody] UnsortCCDropdown requestData)
        {
            var institutionResult = await _institutionService.GetInstitutionsAllAsync();
            var denominationResult = await _denominationService.GetAllMasterDenominationAsyn();
            var unsortCCResult = await _mainService.GetUnsortCCByFilterAsync(requestData);
            if (unsortCCResult.data != null && unsortCCResult.data.Count > 0)
            {
                foreach (var item in unsortCCResult.data)
                {
                    item.institutionName = institutionResult?.data?.Where(c => c.institutionId == item.instId).FirstOrDefault()?.institutionNameTh.ToString();
                    item.denominationPrice = denominationResult?.data?.Where(c => c.denominationId == item.denoId).FirstOrDefault()?.denominationPrice.ToString();
                }
            }

            return Json(unsortCCResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetUnsortCCList(long? registerUnsortId)
        {
            var UnsortCCResponse = _mainService.GetUnsortCCAllAsync(registerUnsortId);
            return Json(UnsortCCResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetEditUnsortCCById(long id)
        {
            var unsortCCResponse = await _mainService.GetUnsortCCByIdAsync(id);
            return Json(unsortCCResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUnsortCC([FromBody] SaveUnsortCCRequest requestData)
        {
            var createData = new UnsortCCDisplay
            {
                unsortCCId = 0,
                registerUnsortId = requestData.registerUnsortId,
                instId = requestData.instId,
                denoId = requestData.denoId,
                banknoteType = requestData.banknoteType,
                banknoteQty = requestData.banknoteQty,
                remainingQty = requestData.remainingQty,
                isActive = requestData.isActive,
                createdBy = 999,
                createdDate = DateTime.Now,
                updatedBy = 999,
                updatedDate = DateTime.Now
            };

            var UnsortCCResponse = await _mainService.CreateUnsortCCAsync(createData);
            return Json(UnsortCCResponse);
        }

        [HttpPost]
        public async Task<IActionResult> EditUnsortCC([FromBody] SaveUnsortCCRequest requestData)
        {
            var updateData = new UnsortCCDisplay
            {
                unsortCCId = requestData.unsortCCId,
                registerUnsortId = requestData.registerUnsortId,
                instId = requestData.instId,
                denoId = requestData.denoId,
                banknoteType = requestData.banknoteType,
                banknoteQty = requestData.banknoteQty,
                remainingQty = requestData.remainingQty,
                isActive = requestData.isActive,
                createdBy = 999,
                createdDate = DateTime.Now,
                updatedBy = 999,
                updatedDate = DateTime.Now
            };

            var UnsortCCResponse = await _mainService.UpdateUnsortCCAsync(updateData);
            return Json(UnsortCCResponse);
        }

        [HttpGet]
        public async Task<IActionResult> DeleteUnsortCC(long id)
        {
            var UnsortCCResponse = await _mainService.DeleteUnsortCCAsync(id);
            return Json(UnsortCCResponse);
        }

        public IActionResult RegisterUnsortDeliver()
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            var appUser = appHelper.GetUserInfo;
            var userId = appUser.UserNameID;
            var userRole = appUser.RoleId;
            var DepartmentId = appUser.DepartmentId;

            return View("~/Views/PrePreparationUnsort/RegisterUnsortDeliver/Index.cshtml");
        }

        public IActionResult CreateRegisterUnsortDeliver()
        {
            return View("~/Views/PrePreparationUnsort/RegisterUnsortDeliver/CreateUnsortDeliver.cshtml");
        }

        public IActionResult EditRegisterUnsortDeliver([FromQuery] int id)
        {
            ViewBag.WaybillId = id;
            return View("~/Views/PrePreparationUnsort/RegisterUnsortDeliver/EditRegisterUnsortDeliver.cshtml");
        }

        public IActionResult RegisterUnsortReceive()
        {
            return View("~/Views/PrePreparationUnsort/UnsortReceiveDelivery/Index.cshtml");
        }


        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> ValidateBarcodeContainer([FromBody] ValidateBarcodeStepRequest model)
        {
            if (model == null)
            {
                return Json(new { isValid = false, errorMessage = "ข้อมูลไม่ถูกต้อง" });
            }

            var request = new ValidateBarcodeRequest
            {
                ValidateBarcodeType = string.Empty,
                BssBNTypeCode = model.BssBNTypeCode,
                DepartmentId = _appShare.DepartmentId,
                ValidateExistingInDatabase = model.ValidateExistingInDatabase

            };

            if(_appShare.IsPrepareCentral == "NO")
            {
                // user หน้าเครื่อง
                request.MachineId = _appShare.MachineId;
            }

            request.ValidateBarcodeType = ValidateBarcodeTypeConstants.BarcodeContainer;
            if (!string.IsNullOrWhiteSpace(model.ContainerBarcode))
            {
                request.DepartmentId = _appShare.DepartmentId;
                request.ValidateBarcodeItem.Add(new ValidateBarcodeItem
                {
                    BarcodeType = ValidateBarcodeTypeConstants.BarcodeContainer,
                    BarcodeValue = model.ContainerBarcode
                });
            }

            return Json(await _preparationUnfitService.ValidateBarcodeAsync(request));
        }


        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> LoadRegisterUnsortList()
        {
            var result = await _mainService.LoadRegisterUnsortList(_appShare.DepartmentId);
            return Json(result);
        }



        [HttpGet]
        public async Task<IActionResult> GetUnsortReceiveDeliverly([FromQuery(Name = "barcode")] string barcode)
        {
            var appShare = _appShare;
            int deptId = _appShare.DepartmentId;
            var result = await _ReceiveService.GetUnsortReceiveDeliverly(deptId, barcode);

            return Json(result);
        }


        [HttpGet]
        public async Task<IActionResult> LoadSendUnsortCCList()
        {
            // ดึงค่าจาก _appShare (ซึ่งเก็บค่าจาก Session/User Info ไว้)
            int deptId = _appShare.DepartmentId;
            int userId = _appShare.UserID;
            var result = await _ReceiveService.LoadSendUnsortCCList(deptId, userId);
            return Json(result);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveBinContainerNotPrepareData(int id)
        {
            try
            {
                int userId = _appShare.UserID;

                // เรียก Service ซึ่งตอนนี้คืนค่ากลับมาเป็นก้อน BaseApiResponse
                var response = await _ReceiveService.RemoveBinContainerNotPrepareData(id, userId);

                // ตรวจสอบว่า response ไม่เป็น null และ backend ส่ง success กลับมาหรือไม่
                if (response != null && response.is_success)
                {
                    // ส่งค่ากลับไปให้ JS โดยใช้ค่าที่อยู่ใน response.Data
                    return Ok(new { success = true, count = response.data });
                }
                else
                {
                    // กรณี Backend ส่ง Success = false หรือส่ง Error Message มา
                    return BadRequest(new
                    {
                        success = false,
                        //message = response?.Message ?? "เกิดข้อผิดพลาดจาก API หลังบ้าน"
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Internal Server Error", detail = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ExecuteReceive([FromBody] System.Text.Json.JsonElement request)
        {
            try
            {
                if (!request.TryGetProperty("sendUnsortId", out var idElement))
                {
                    // หากไม่เจอ ให้ลองหา "SendUnsortId" (ตัวพิมพ์ใหญ่) เพื่อความชัวร์
                    if (!request.TryGetProperty("SendUnsortId", out idElement))
                    {
                        return Json(new { is_success = false, msg_desc = "ไม่พบข้อมูล sendUnsortId ใน Request" });
                    }
                }

                int sendUnsortId = idElement.GetInt32();
                int userId = _appShare.UserID;

                // เรียก Service ฝั่ง Web เพื่อยิงไปหา API
                var response = await _ReceiveService.ExecuteReceiveDelivery(sendUnsortId, userId);

                if (response != null && response.is_success)
                {
                    return Json(new { is_success = true, msg_desc = "บันทึกการรับมอบสำเร็จ" });
                }

                return Json(new { is_success = false, msg_desc = response?.msg_desc ?? "ไม่สามารถบันทึกข้อมูลได้" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ExecuteReceive");
                return Json(new { is_success = false, msg_desc = "เกิดข้อผิดพลาดภายในระบบ" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ExecuteReject([FromBody] System.Text.Json.JsonElement request)
        {
            try
            {
                // ตรวจสอบว่ามี Property ที่ต้องการหรือไม่ก่อนดึงค่า
                if (!request.TryGetProperty("sendUnsortId", out var idElement) ||
                    !request.TryGetProperty("note", out var noteElement))
                {
                    return Json(new { is_success = false, msg_desc = "ข้อมูลที่ส่งมาไม่ครบถ้วน (Missing required fields)" });
                }

                int sendUnsortId = idElement.GetInt32();
                string note = noteElement.GetString() ?? ""; // ป้องกันค่า null
                int userId = _appShare.UserID;

                if (string.IsNullOrWhiteSpace(note))
                {
                    return Json(new { is_success = false, msg_desc = "กรุณาระบุเหตุผลที่ไม่รับมอบ" });
                }

                var response = await _ReceiveService.ExecuteRejectDelivery(sendUnsortId, userId, note);

                if (response != null && response.is_success)
                {
                    return Json(new { is_success = true, msg_desc = "บันทึกการปฏิเสธเรียบร้อยแล้ว" });
                }

                return Json(new { is_success = false, msg_desc = response?.msg_desc ?? "ไม่สามารถบันทึกข้อมูลได้" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ExecuteReject");
                return Json(new { is_success = false, msg_desc = "เกิดข้อผิดพลาดภายในระบบ: " + ex.Message });
            }
        }


        [HttpPost]
        public async Task<IActionResult> ExecuteReturn([FromBody] System.Text.Json.JsonElement request)
        {
            try
            {
                // ดึง IDs ออกมาเป็น List<int>
                var ids = request.GetProperty("sendUnsortIds").EnumerateArray()
                    .Select(x => {
                        // เช็คก่อนว่าถ้าเป็น String ให้ Parse เป็น int
                        if (x.ValueKind == System.Text.Json.JsonValueKind.String)
                        {
                            return int.Parse(x.GetString());
                        }
                        return x.GetInt32();
                    }).ToList();
                string note = request.GetProperty("note").GetString();
                int userId = _appShare.UserID;

                // เรียก Service (ควรส่ง StatusId 8 สำหรับ "ส่งคืน")
                var response = await _ReceiveService.ExecuteReturnDelivery(ids, userId, note);

                return Json(new { is_success = response.is_success, msg_desc = response.msg_desc });
            }
            catch (Exception ex)
            {
                return Json(new { is_success = false, msg_desc = "Error: " + ex.Message });
            }
        }


        [HttpPost]
        public async Task<IActionResult> UpdateRemainingQtyReceive([FromBody] UpdateRemainingQtyReceiveRequest UpdateRemainingQtyReceiveRequest)
        {
            UpdateRemainingQtyReceiveRequest.CreatedBy = _appShare.UserID;
            UpdateRemainingQtyReceiveRequest.DepartmentId = _appShare.DepartmentId;

            var response = await _ReceiveService.UpdateRemainingQtyReceive(UpdateRemainingQtyReceiveRequest);

            // ส่ง data กลับไปด้วยเพื่อให้หน้าบ้านได้รับค่าที่อัปเดตแล้ว (รวมถึง AdjustQty)
            return Json(new
            {
                is_success = response.is_success,
                msg_desc = response.msg_desc,
                data = response.data // เพิ่มบรรทัดนี้
            });
        }

    }
}
