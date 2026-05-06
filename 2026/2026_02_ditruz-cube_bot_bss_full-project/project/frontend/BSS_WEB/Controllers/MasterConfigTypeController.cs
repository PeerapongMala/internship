using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterConfigTypeController : Controller
    {
        private readonly ILogger<MasterConfigTypeController> _logger;
        private readonly IMasterConfigTypeService _configtypeService;
        public MasterConfigTypeController(ILogger<MasterConfigTypeController> logger, IMasterConfigTypeService configtypeService)
        {
            _logger = logger;
            _configtypeService = configtypeService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetConfigTypeList()
        {
            var configtypeResponse = await _configtypeService.GetAllMasterConfigTypeAsyn();
            return Json(configtypeResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetConfigTypeById(int id)
        {
            var serviceResult = await _configtypeService.GetConfigTypeByIdAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateConfigType([FromBody] UpdateConfigTypeRequest requestData)
        { 
            var configtypeResponse = await _configtypeService.CreateConfigTypeAsync(requestData);
            return Json(configtypeResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateConfigType([FromBody] UpdateConfigTypeRequest requestData)
        {
             
            var configtypeResponse = await _configtypeService.UpdateConfigTypeAsync(requestData);
            return Json(configtypeResponse);
        }

        //[HttpGet]
        //public async Task<IActionResult> DeleteConfigType(int id)
        //{
        //    var configtypeResponse = await _configtypeService.DeleteConfigTypeAsync(id);
        //    return Json(configtypeResponse);
        //}

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchConfigType([FromBody] DataTablePagedRequest<MasterConfigTypeRequest> request)
        {

            var response = await _configtypeService.SearchConfigTypeAsync(request);

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
