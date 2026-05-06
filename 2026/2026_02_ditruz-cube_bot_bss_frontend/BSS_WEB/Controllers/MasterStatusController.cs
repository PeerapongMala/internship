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
    public class MasterStatusController : Controller
    {
        private readonly ILogger<MasterStatusController> _logger;
        private readonly IMasterStatusService _statusService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MasterStatusController(ILogger<MasterStatusController> logger, IMasterStatusService statusService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _statusService = statusService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetStatusList()
        {
            var statusResponse = await _statusService.GetStatusAllAsync();
            return Json(statusResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetStatusById(int id)
        {
            var serviceResult = await _statusService.GetStatusByIdAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStatus([FromBody] CreateStatusRequest requestData)
        {
             
            var statusResponse = await _statusService.CreateStatusAsync(requestData);
            return Json(statusResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdateStatusRequest requestData)
        {
           

            var statusResponse = await _statusService.UpdateStatusAsync(requestData);
            return Json(statusResponse);
        }

        [HttpGet]
        public async Task<IActionResult> DeleteStatus(int id)
        {
            var statusResponse = await _statusService.DeleteStatusAsync(id);
            return Json(statusResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchStatus([FromBody] DataTablePagedRequest<MasterStatusRequest> request)
        {

            var response = await _statusService.SearchStatusAsync(request);

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
