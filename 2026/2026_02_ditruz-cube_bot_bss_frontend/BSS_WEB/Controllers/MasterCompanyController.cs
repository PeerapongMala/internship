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
    public class MasterCompanyController : Controller
    {
        private readonly ILogger<MasterCompanyController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterCompanyService _companyService;

        public MasterCompanyController(ILogger<MasterCompanyController> logger, IMasterCompanyService companyService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _companyService = companyService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }


        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetCompanyList()
        {
            var companyResult = await _companyService.GetAllMasterCompanyAsyn();
            return Json(companyResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetCompaniesIsActive()
        {
            var companyResult = await _companyService.GetCompaniesIsActiveAsync();
            return Json(companyResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateCompany([FromBody] CreateCompanyRequest requestData)
        {
            var companyResponse = await _companyService.CreateCompanyAsync(requestData);
            return Json(companyResponse);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetCompanyById(int id)
        {
            var companyResponse = await _companyService.GetCompanyByIdAsync(id);
            return Json(companyResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateCompany([FromBody] UpdateCompanyRequest requestData)
        {


            var companyResponse = await _companyService.UpdateCompanyAsync(requestData);
            return Json(companyResponse);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            var companyResponse = await _companyService.DeleteCompanyAsync(id);
            return Json(companyResponse);
        }



        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchCompany([FromBody] DataTablePagedRequest<MasterCompanyRequest> request)
        {

            var response = await _companyService.SearchMasterCompanyAsync(request);

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
