using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.ObjectModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterDenomReconcileController : Controller
    {
        private readonly ILogger<MasterDenomReconcileController> _logger;
        private readonly IMasterDenomReconcileService _denomReconcileService;
        private readonly IMasterDenominationService _denominationService;
        private readonly IMasterDepartmentService _departmentService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MasterDenomReconcileController(ILogger<MasterDenomReconcileController> logger,
            IMasterDenomReconcileService denomReconcileService,
            IMasterDenominationService denominationService,
            IMasterDepartmentService departmentService,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _denomReconcileService = denomReconcileService;
            _denominationService = denominationService;
            _departmentService = departmentService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        /*
        [HttpPost]
        public async Task<IActionResult> GetDenomReconcileList([FromBody] DenomReconcileFilterSearch requestData)
        {
            var denominationResult = await _denominationService.GetAllMasterDenominationAsyn();
            var departmentResult = await _departmentService.GetDepartmentsAllAsync();
            var denomReconcileResult = await _denomReconcileService.GetDenomReconcileByFilterAsync(requestData);
            if (denomReconcileResult.data != null && denomReconcileResult.data.Count > 0)
            {
                foreach (var item in denomReconcileResult.data)
                {
                    item.denominationDesc = denominationResult.data.Where(c => c.denominationId == item.denoId).FirstOrDefault()?.denominationDesc.ToString();
                    item.departmentName = departmentResult.data.Where(c => c.departmentId == item.departmentId).FirstOrDefault()?.departmentName.ToString();
                }
            }

            return Json(denomReconcileResult);
        }
        */

        [HttpGet]
        public async Task<IActionResult> GetDenomReconcileById(int id)
        {
            var serviceResult = await _denomReconcileService.GetDenomReconcileByIdAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDenomReconcile([FromBody] CreateDenomReconcileRequest requestData)
        {
            var denomReconcileResponse = await _denomReconcileService.CreateDenomReconcileAsync(requestData);
            return Json(denomReconcileResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateDenomReconcile([FromBody] UpdateDenomReconcileRequest requestData)
        {
            var denomReconcileResponse = await _denomReconcileService.UpdateDenomReconcileAsync(requestData);
            return Json(denomReconcileResponse);
        }

        /*
        [HttpGet]
        public async Task<IActionResult> DeleteDenomReconcile(int id)
        {
            var denomReconcileResponse = await _denomReconcileService.DeleteDenomReconcileAsync(id);
            return Json(denomReconcileResponse);
        }
        */

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchDenomReconcile([FromBody] DataTablePagedRequest<MasterDenomReconcileRequest> request)
        {

            var response = await _denomReconcileService.SearchDenomReconcileAsync(request);

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
