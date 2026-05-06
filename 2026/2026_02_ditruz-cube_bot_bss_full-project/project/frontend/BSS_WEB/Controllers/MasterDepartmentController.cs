using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterDepartmentController : Controller
    {
        private readonly ILogger<MasterDepartmentController> _logger;
        private readonly IMasterDepartmentService _departmentService;

        public MasterDepartmentController(ILogger<MasterDepartmentController> logger, IMasterDepartmentService departmentService)
        {
            _logger = logger;
            _departmentService = departmentService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetDepartmentList([FromBody] DepartmentFilterSearch requestData)
        {

            var tsDepartmentResponse = await _departmentService.GetDepartmentByFilterAsync(requestData);
            return Json(tsDepartmentResponse);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetDepartmentsIsActive()
        {

            var tsDepartmentResponse = await _departmentService.GetDepartmentsActiveAsync();
            return Json(tsDepartmentResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentRequest requestData)
        {
            var departmentResponse = await _departmentService.CreateDepartmentAsync(requestData);
            return Json(departmentResponse);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetDepartmentById(int id)
        {
            var departmentResponse = await _departmentService.GetDepartmentsByIdAsync(id);
            return Json(departmentResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateDepartment([FromBody] UpdateDepartmentRequest requestData)
        {
            var departmentResponse = await _departmentService.UpdateDepartmentAsync(requestData);
            return Json(departmentResponse);
        }

        //[HttpGet]
        ////[ValidateAntiForgeryToken]
        //public async Task<IActionResult> DeleteDepartment(int id)
        //{
        //    var departmentResponse = await _departmentService.DeleteDepartmentAsync(id);
        //    return Json(departmentResponse);
        //}

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetDepartmentActiveList()
        {
            var activateResult = await _departmentService.GetDepartmentsAllAsync();
            return Json(activateResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchDepartment([FromBody] DataTablePagedRequest<MasterDepartmentRequest> request)
        {

            var response = await _departmentService.SearchMasterDepartmentAsync(request);

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
