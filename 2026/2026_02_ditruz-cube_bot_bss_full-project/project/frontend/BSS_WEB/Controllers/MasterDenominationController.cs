using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterDenominationController : Controller
    {
        private readonly ILogger<MasterDenominationController> _logger;
        private readonly IMasterDenominationService _denominationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MasterDenominationController(ILogger<MasterDenominationController> logger, IMasterDenominationService denominationService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _denominationService = denominationService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetDenominationList()
        {
            var denominationResult = await _denominationService.GetAllMasterDenominationAsyn();
            return Json(denominationResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetDenominationById(int id)
        {
            var denomResponse = await _denominationService.GetDenominationByIdAsync(id);
            return Json(denomResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDenomination([FromBody] CreateDenominationRequest requestData)
        { 
            var denominationResponse = await _denominationService.CreateDenominationAsync(requestData);
             
            return Json(denominationResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateDenomination([FromBody] UpdateDenominationRequest requestData)
        {
            
            var denominationResponse = await _denominationService.UpdateDenominationAsync(requestData);
             
            return Json(denominationResponse);
        }

        //[HttpGet]
        //public async Task<IActionResult> DeleteDenomination(int id)
        //{
        //    var denominationResponse = await _denominationService.DeleteDenominationAsync(id);
        //    return Json(denominationResponse);
        //}

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchDenomination([FromBody] DataTablePagedRequest<MasterDenominationRequest> request)
        {

            var response = await _denominationService.SearchDenominationAsync(request);

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
