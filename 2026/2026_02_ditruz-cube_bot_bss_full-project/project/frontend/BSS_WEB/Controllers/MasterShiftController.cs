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
    public class MasterShiftController : Controller
    {
        private readonly ILogger<MasterShiftController> _logger;
        private readonly IMasterShiftService _shiftService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MasterShiftController(ILogger<MasterShiftController> logger, IMasterShiftService shiftService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _shiftService = shiftService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetShiftList()
        {
            var shiftResult = await _shiftService.GetAllMasterShiftAsyn();
            return Json(shiftResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateShift([FromBody] CreateShiftRequest requestData)
        {
          
            var shiftResponse = await _shiftService.CreateShiftAsync(requestData);
            return Json(shiftResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetShiftById(int id)
        {
            var shiftResponse = await _shiftService.GetShiftByIdAsync(id);
            return Json(shiftResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateShift([FromBody] UpdateShiftRequest requestData)
        {
           
            var shiftResponse = await _shiftService.UpdateShiftAsync(requestData);
            return Json(shiftResponse);
        }

        [HttpGet]
        public async Task<IActionResult> DeleteShift(int id)
        {
            var shiftResponse = await _shiftService.DeleteShiftAsync(id);
            return Json(shiftResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchShift([FromBody] DataTablePagedRequest<MasterShiftRequest> request)
        {

            var response = await _shiftService.SearchShiftAsync(request);

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
