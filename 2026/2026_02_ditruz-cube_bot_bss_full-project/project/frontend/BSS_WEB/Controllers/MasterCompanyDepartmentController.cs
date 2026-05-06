using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Internal;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterCompanyDepartmentController : Controller
    {
        private readonly ILogger<MasterCompanyDepartmentController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterCompanyDepartmentService _companyDepartmentService;

        public MasterCompanyDepartmentController(ILogger<MasterCompanyDepartmentController> logger, IMasterCompanyDepartmentService companyDepartmentService )
        {
            _logger = logger;
            _companyDepartmentService = companyDepartmentService; 
        }

        public IActionResult Index()
        {
            return View();
        }
       

        

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateCompanyDepartment([FromBody] CreateCompanyDepartmentRequest requestData)
        { 
            var companyResponse = await _companyDepartmentService.CreateCompanyDepartmentAsync(requestData);
            return Json(companyResponse);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetCompanyDepartmentById(int id)
        {
            var companyResponse = await _companyDepartmentService.GetCompanyDepartmentByIdAsync(id);
            return Json(companyResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateCompanyDepartment([FromBody] UpdateCompanyDepartmentRequest requestData)
        {
            
            var companyResponse = await _companyDepartmentService.UpdateCompanyDepartmentAsync(requestData);
            return Json(companyResponse);
        }

        



        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchCompanyDepartment([FromBody] DataTablePagedRequest<MasterCompanyDepartmentRequest> request)
        { 
            
            var response = await _companyDepartmentService.SearchMasterCompanyDepartmentAsync(request);
                 
            return Json(new
            {
                draw = request.Draw,
                recordsTotal = response?.data?.TotalCount,
                recordsFiltered = response?.data?.TotalCount,
                data = response?.data?.Items
            });
             
        }

        [HttpGet]
        public async Task<IActionResult> GetCbBcdCodeByDepartmentInstitution(int departmentId,int institutionId)
        {

            var response = await _companyDepartmentService.GetCbBcdCodeByDepartmentInstitution(departmentId,institutionId);
            return Json(response);

        }
        [HttpGet]
        public async Task<IActionResult> GetCbBcdCodeByCompany(int companyId)
        {

            var response = await _companyDepartmentService.GetCbBcdCodeByCompany(companyId);
            return Json(response);

        }


    }
}
