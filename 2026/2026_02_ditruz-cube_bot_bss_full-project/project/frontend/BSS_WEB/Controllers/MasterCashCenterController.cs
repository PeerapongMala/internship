using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{

    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterCashCenterController : Controller
    {
        private readonly ILogger<MasterCashCenterController> _logger;
        private readonly IMasterCashCenterService _cashCenterService;
        private readonly IMasterInstitutionService _institutionService;
        private readonly IMasterDepartmentService _departmentService;
        public MasterCashCenterController(ILogger<MasterCashCenterController> logger, IMasterCashCenterService cashCenterService, IMasterInstitutionService institutionService, IMasterDepartmentService departmentService)
        {
            _logger = logger;
            _cashCenterService = cashCenterService;
            _institutionService = institutionService;
            _departmentService = departmentService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetCashCenterList([FromBody] CashCenterFilterSearch requestData)
        {
            var institutionResult = await _institutionService.GetInstitutionsAllAsync();
            var departmentResult = await _departmentService.GetDepartmentsAllAsync();
            var cashCenterResult = await _cashCenterService.GetCashCenterByFilterAsync(requestData);

            //if (cashCenterResult.data != null && cashCenterResult.data.Count > 0)
            //{
            //    foreach (var item in cashCenterResult.data)
            //    {
            //        item.bankName = institutionResult.data.Where(c => c.institutionId == item.institutionId).FirstOrDefault()?.institutionNameTh.ToString();
            //        item.departmentName = departmentResult.data.Where(c => c.departmentId == item.departmentId).FirstOrDefault()?.departmentName.ToString();
            //    }
            //}

            return Json(cashCenterResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetCashCenterById(int id)
        {
            var cashCenterResponse = await _cashCenterService.GetCashCenterByIdAsync(id);
            return Json(cashCenterResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCashCenter([FromBody] UpdateCashCenterRequest requestData)
        {
            var createData = new MasterCashCenterDisplay
            {
                cashCenterId = 0,
                cashCenterCode = requestData.cashCenterCode,
                cashCenterName = requestData.cashCenterName,
                institutionId = requestData.institutionId,
                departmentId = requestData.departmentId,
                isActive = requestData.isActive,
                createdBy = 999,
                createdDate = DateTime.Now,
                updatedBy = 999,
                updatedDate = DateTime.Now
            };

            var cashCenterResponse = await _cashCenterService.CreateCashCenterAsync(createData);
            return Json(cashCenterResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCashCenter([FromBody] UpdateCashCenterRequest requestData)
        {
            var updateData = new MasterCashCenterDisplay
            {
                cashCenterId = requestData.cashCenterId,
                cashCenterCode = requestData.cashCenterCode,
                cashCenterName = requestData.cashCenterName,
                institutionId = requestData.institutionId,
                departmentId = requestData.departmentId,
                isActive = requestData.isActive,
                createdBy = 999,
                createdDate = DateTime.Now,
                updatedBy = 999,
                updatedDate = DateTime.Now
            };

            var cashCenterResponse = await _cashCenterService.UpdateCashCenterAsync(updateData);
            return Json(cashCenterResponse);
        }

        [HttpGet]
        public async Task<IActionResult> DeleteCashCenter(int id)
        {
            var cashCenterResponse = await _cashCenterService.DeleteCashCenterAsync(id);
            return Json(cashCenterResponse);
        }

        [HttpPost] 
        public async Task<IActionResult> SearchCashCenter([FromBody] DataTablePagedRequest<MasterCashCenterRequest> request)
        {

            var response = await _cashCenterService.SearchMasterCashCenterAsync(request);

            var result= Json(new
            {
                draw = request.Draw,
                recordsTotal = response?.data?.TotalCount,
                recordsFiltered = response?.data?.TotalCount,
                data = response?.data?.Items
            });

            return result;

        }
    }
}
