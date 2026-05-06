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
    public class MasterCompanyInstitutionController : Controller
    {
        private readonly ILogger<MasterCompanyInstitutionController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterCompanyInstitutionService _companyInstitutionService;

        public MasterCompanyInstitutionController(ILogger<MasterCompanyInstitutionController> logger, IMasterCompanyInstitutionService companyInstitutionService )
        {
            _logger = logger;
            _companyInstitutionService = companyInstitutionService; 
        }

        public IActionResult Index()
        {
            return View();
        }
       

        

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateCompanyInstitution([FromBody] CreateCompanyInstitutionRequest requestData)
        { 
            var companyResponse = await _companyInstitutionService.CreateCompanyInstitutionAsync(requestData);
            return Json(companyResponse);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetCompanyInstitutionById(int id)
        {
            var companyResponse = await _companyInstitutionService.GetCompanyInstitutionByIdAsync(id);
            return Json(companyResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateCompanyInstitution([FromBody] UpdateCompanyInstitutionRequest requestData)
        {
            
            var companyResponse = await _companyInstitutionService.UpdateCompanyInstitutionAsync(requestData);
            return Json(companyResponse);
        }

        



        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchCompanyInstitution([FromBody] DataTablePagedRequest<MasterCompanyInstitutionRequest> request)
        { 
            
            var response = await _companyInstitutionService.SearchMasterCompanyInstitutionAsync(request);
                 
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
