using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
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
    public class MasterCashPointController : Controller
    {
        private readonly ILogger<MasterCashPointController> _logger;
        private readonly IMasterCashPointService _mainService;
        private readonly IMasterInstitutionService _institutionService;
        private readonly IMasterDepartmentService _departmentService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MasterCashPointController(ILogger<MasterCashPointController> logger,
            IMasterCashPointService mainService,
            IMasterInstitutionService institutionService,
            IMasterDepartmentService departmentService,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _mainService = mainService;
            _institutionService = institutionService;
            _departmentService = departmentService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetZoneCashpointList([FromBody] CashPointFilterSearch requestData)
        {
            var institutionResult = await _institutionService.GetInstitutionsAllAsync();
            var departmentResult = await _departmentService.GetDepartmentsAllAsync();
            var cashPointResult = await _mainService.GetCashPointByFilterAsync(requestData);
            if (cashPointResult.data != null && cashPointResult.data.Count > 0)
            {
                foreach (var item in cashPointResult.data)
                {
                    item.institutionNameTh = institutionResult.data.Where(c => c.institutionId == item.institutionId).FirstOrDefault()?.institutionNameTh.ToString();
                    item.departmentName = departmentResult.data.Where(c => c.departmentId == item.departmentId).FirstOrDefault()?.departmentName.ToString();
                }
            }

            return Json(cashPointResult);
        }


        [HttpGet]
        public async Task<IActionResult> GetCashPointById(int id)
        {
            var cashpointResponse = await _mainService.GetCashPointByIdAsync(id);
            return Json(cashpointResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCashPoint([FromBody] CreateCashPointRequest requestData)
        {
          
            var cashpointResponse = await _mainService.CreateCashPointAsync(requestData);
            return Json(cashpointResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCashPoint([FromBody] UpdateCashPointRequest requestData)
        { 
            var cashpointResponse = await _mainService.UpdateCashPointAsync(requestData);
            return Json(cashpointResponse);
        }

        [HttpGet]
        public async Task<IActionResult> DeleteCashPoint(int id)
        {
            var cashpointResponse = await _mainService.DeleteCashPointAsync(id);
            return Json(cashpointResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetCashPointActiveList()
        {
            var cashPointResult = await _mainService.GetCashPointAllAsync();
            if (cashPointResult.data != null)
            {
                var ActiveList = cashPointResult.data.Where(item => item.isActive == true).ToList();
                cashPointResult.data = ActiveList;
            }

            return Json(cashPointResult);
        }


        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchCashPoint([FromBody] DataTablePagedRequest<MasterCashPointRequest> request)
        {

            var response = await _mainService.SearchCashPointAsync(request);

            return Json(new
            {
                draw = request.Draw,
                recordsTotal = response?.data?.TotalCount,
                recordsFiltered = response?.data?.TotalCount,
                data = response?.data?.Items
            });

        }

    }
}
