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
    public class MasterMachineSevenOutputController : Controller
    {
        private readonly ILogger<MasterMachineSevenOutputController> _logger;
        private readonly IMasterMachineSevenOutputService _machineSevenOutputService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MasterMachineSevenOutputController(ILogger<MasterMachineSevenOutputController> logger, IMasterMachineSevenOutputService machineSevenOutputService, IHttpContextAccessor httpContextAccessor   )
        {
            _logger = logger;
            _machineSevenOutputService = machineSevenOutputService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetMachineSevenOutputList()
        {
            var machineSevenOutputResponse = await _machineSevenOutputService.GetAllMasterMachineSevenOutputAsyn();
            return Json(machineSevenOutputResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetMachineSevenOutputById(int id)
        {
            var serviceResult = await _machineSevenOutputService.GetMachineSevenOutputByIdAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMachineSevenOutput([FromBody] CreateMachineSevenOutputRequest requestData)
        {
           
            var machineSevenOutputResponse = await _machineSevenOutputService.CreateMachineSevenOutputAsync(requestData);
            return Json(machineSevenOutputResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateMachineSevenOutput([FromBody] UpdateMachineSevenOutputRequest requestData)
        {
            
            var machineSevenOutputResponse = await _machineSevenOutputService.UpdateMachineSevenOutputAsync(requestData);
            return Json(machineSevenOutputResponse);
        }

        //[HttpGet]
        //public async Task<IActionResult> DeleteMachineSevenOutput(int id)
        //{
        //    var machineSevenOutputResponse = await _machineSevenOutputService.DeleteMachineSevenOutputAsync(id);
        //    return Json(machineSevenOutputResponse);
        //}

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchMachineSevenOutput([FromBody] DataTablePagedRequest<MasterMachineSevenOutputRequest> request)
        {

            var response = await _machineSevenOutputService.SearchMachineSevenOutputAsync(request);

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
