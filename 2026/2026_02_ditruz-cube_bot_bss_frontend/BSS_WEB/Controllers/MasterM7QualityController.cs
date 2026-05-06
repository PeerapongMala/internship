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
    public class MasterM7QualityController : Controller
    {
        private readonly ILogger<MasterM7QualityController> _logger;
        private readonly IMasterM7QualityService _m7QualityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MasterM7QualityController(ILogger<MasterM7QualityController> logger, IMasterM7QualityService m7QualityService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _m7QualityService = m7QualityService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetM7QualityList()
        {
            var m7QualityResponse = await _m7QualityService.GetAllMasterM7QualityAsyn();
            return Json(m7QualityResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetM7QualityById(int id)
        {
            var serviceResult = await _m7QualityService.GetM7QualityByIdAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateM7Quality([FromBody] CreateM7QualityRequest requestData)
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            requestData.createdBy = appHelper.UserID.AsInt();
            var m7QualityResponse = await _m7QualityService.CreateM7QualityAsync(requestData);
            return Json(m7QualityResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateM7Quality([FromBody] UpdateM7QualityRequest requestData)
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            requestData.updatedBy = appHelper.UserID.AsInt();
            var m7QualityResponse = await _m7QualityService.UpdateM7QualityAsync(requestData);
            return Json(m7QualityResponse);
        }

        [HttpGet]
        public async Task<IActionResult> DeleteM7Quality(int id)
        {
            var m7QualityResponse = await _m7QualityService.DeleteM7QualityAsync(id);
            return Json(m7QualityResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchM7Quality([FromBody] DataTablePagedRequest<MasterM7QualityRequest> request)
        {

            var response = await _m7QualityService.SearchM7QualityAsync(request);

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
