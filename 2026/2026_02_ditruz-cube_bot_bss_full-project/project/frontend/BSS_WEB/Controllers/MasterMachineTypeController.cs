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
    public class MasterMachineTypeController : Controller
    {
        private readonly ILogger<MasterMachineTypeController> _logger;
        private readonly IMasterMachineTypeService _machineTypeService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MasterMachineTypeController(ILogger<MasterMachineTypeController> logger, IMasterMachineTypeService machineTypeService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _machineTypeService = machineTypeService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetMachineTypeList()
        {
            var machineTypeResponse = await _machineTypeService.GetMachineTypeAllAsync();
            return Json(machineTypeResponse);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetMachineTypeById(int id)
        {
            var serviceResult = await _machineTypeService.GetMachineTypeByIdAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateMachineType([FromBody] CreateMachineTypeRequest requestData)
        {
           
            var machineTypeResponse = await _machineTypeService.CreateMachineTypeAsync(requestData);
            return Json(machineTypeResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateMachineType([FromBody] UpdateMachineTypeRequest requestData)
        {
            var machineTypeResponse = await _machineTypeService.UpdateMachineTypeAsync(requestData);
            return Json(machineTypeResponse);
        }


        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchMachineType([FromBody] DataTablePagedRequest<MasterMachineTypeRequest> request)
        {

            var response = await _machineTypeService.SearchMachineTypeAsync(request);

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
