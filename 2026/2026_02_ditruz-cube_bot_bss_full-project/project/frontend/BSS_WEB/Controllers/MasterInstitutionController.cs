using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using DocumentFormat.OpenXml.Office2016.Excel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterInstitutionController : Controller
    {
        private readonly ILogger<MasterInstitutionController> _logger;
        private readonly IMasterInstitutionService _institutionService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MasterInstitutionController(ILogger<MasterInstitutionController> logger, IMasterInstitutionService institutionService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _institutionService = institutionService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetInstitutionList()
        {
            var institutionResult = await _institutionService.GetInstitutionsAllAsync();
            return Json(institutionResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateInstitution([FromBody] CreateInstitutionRequest request)
        { 

            var srvResult = await _institutionService.CreateInstitutionAsync(request);
            return Json(srvResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetInstitution(int id)
        {
            var dataResult =  await _institutionService.GetInstitutionByIdAsync(id);
            return Json(dataResult);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateInstitution([FromBody] UpdateInstitutionRequest request)
        {
          
            var srvResult = await _institutionService.UpdateInstitutionAsync(request);
            return Json(srvResult);
        }

        //public async Task<IActionResult> DeleteInstitution(int id)
        //{

        //    var srvResult = await _institutionService.DeleteInstitutionAsync(id);
        //    return Json(srvResult);
        //}

        [HttpGet]
        public async Task<IActionResult> GetInstitutionsActiveList()
        {
            var activateResult = await _institutionService.GetInstitutionsAllAsync();
            if (activateResult.data != null)
            {
                var ActiveList = activateResult.data.Where(item => item.isActive == true).ToList();
                activateResult.data = ActiveList;
            }

            return Json(activateResult);
        }


        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchInstitution([FromBody] DataTablePagedRequest<MasterInstitutionRequest> request)
        {

            var response = await _institutionService.SearchInstitutionAsync(request);

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
