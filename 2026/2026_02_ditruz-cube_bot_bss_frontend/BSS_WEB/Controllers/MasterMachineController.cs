using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterMachineController : Controller
    {
        private readonly ILogger<MasterMachineController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterMachineService _machineService;
        private readonly IMasterMachineTypeService _machineTypeService;
        private readonly IMasterDepartmentService _departmentService;

        public MasterMachineController(ILogger<MasterMachineController> logger, IHttpContextAccessor httpContextAccessor,
            IMasterMachineService machineService,
            IMasterMachineTypeService MachineTypeService,
            IMasterDepartmentService departmentService)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _machineService = machineService;
            _machineTypeService = MachineTypeService;
            _departmentService = departmentService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetMachineList([FromBody] MachineFilterSearch requestData)
        {
            //DO NOT USE THIS,FIX FIRST
            var machineTypeResult = await _machineTypeService.GetMachineTypeAllAsync();
            var departmentResult = await _departmentService.GetDepartmentsAllAsync();
            var machineResult =await _machineService.GetMachineByFilterAsync(requestData);

            if (machineResult.data != null && machineResult.data.Count > 0)
            {
                foreach (var item in machineResult.data)
                {
                    item.machineTypeName = machineTypeResult.data.Where(c => c.machineTypeId == item.machineTypeId).FirstOrDefault()?.machineTypeName.ToString();
                    item.departmentName = departmentResult.data.Where(c => c.departmentId == item.departmentId).FirstOrDefault()?.departmentName.ToString();
                }
            }

            return Json(machineResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetMachineList()
        {
            var machineResponse = await _machineService.GetMachineAllAsync();
            return Json(machineResponse);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetMachineById(int id)
        {
            var serviceResult = await _machineService.GetMachineByIdAsync(id);
            return Json(serviceResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetMachineByDepartment()
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            int departmentId = appHelper.DepartmentId.AsInt();
            var serviceResult = await _machineService.GetMachineByDepartmentAsync(departmentId);
            return Json(serviceResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateMachine([FromBody] CreateMachineRequest requestData)
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            requestData.createdBy = appHelper.UserID.AsInt(); ;

            var machineResponse = await _machineService.CreateMachineAsync(requestData);
            return Json(machineResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateMachine([FromBody] UpdateMachineRequest requestData)
        {
            var appHelper = new UserInfoHelper(_httpContextAccessor);
            requestData.updatedBy = appHelper.UserID.AsInt(); ;
            var machineResponse = await _machineService.UpdateMachineAsync(requestData);
            return Json(machineResponse);
        }

        

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchMachine([FromBody] DataTablePagedRequest<MasterMachineRequest> request)
        {

            var response = await _machineService.SearchMachineAsync(request);

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
