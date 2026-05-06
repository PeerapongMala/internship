using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterConfigController : Controller
    {
        private readonly ILogger<MasterConfigController> _logger;
        private readonly IMasterConfigService _configService;
        private readonly IMasterConfigTypeService _configTypeService;

        public MasterConfigController(ILogger<MasterConfigController> logger, IMasterConfigService configService, IMasterConfigTypeService configTypeService)
        {
            _logger = logger;
            _configService = configService;
            _configTypeService = configTypeService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetConfigRoleGroupList()
        {

            var filter = new ConfigFilterSearch
            {
                configTypeFilter = "1",
                statusFilter = "1",
            };

            var configResponse = await _configService.GetConfigByFilterAsync(filter);
            return Json(configResponse);
        }

        [HttpPost]
        public async Task<IActionResult> LoadConfigListByFilter([FromBody] ConfigFilterSearch filterData)
        {
            var configResult = await _configService.GetConfigByFilterAsync(filterData);
            var configTypeResult = await _configTypeService.GetAllMasterConfigTypeAsyn();

            if (configResult.data != null && configResult.data.Count > 0)
            {
                foreach (var item in configResult.data)
                {

                    item.configTypeDesc = configTypeResult.data.Where(c => c.configTypeId == item.configTypeId).FirstOrDefault()?.configTypeDesc.ToString();
                }

                if (!string.IsNullOrEmpty(filterData.configTypeFilter))
                {
                    if (int.TryParse(filterData.configTypeFilter, out int typeId))
                    {
                        configResult.data = configResult.data
                            .Where(x => x.configTypeId == typeId)
                            .ToList();
                    }
                }

                if (!string.IsNullOrEmpty(filterData.statusFilter))
                {
                    if (int.TryParse(filterData.statusFilter, out int status))
                    {
                        bool isActive = status == 1;
                        configResult.data = configResult.data
                            .Where(x => x.isActive == isActive)
                            .ToList();
                    }
                }

            }
            
            return Json(configResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetConfigById(int id)
        {
            var configResponse = await _configService.GetConfigByIdAsync(id);
            return Json(configResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateConfig([FromBody] CreateConfigRequest requestData)
        {
             
            var configResponse = await _configService.CreateConfigAsync(requestData);
            return Json(configResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateConfig([FromBody] UpdateConfigRequest requestData)
        { 

            var configResponse = await _configService.UpdateConfigAsync(requestData);
            return Json(configResponse);
        }

        [HttpGet]
        public async Task<IActionResult> DeleteConfig(int id)
        {
            var configResponse = await _configService.DeleteConfigAsync(id);
            return Json(configResponse);
        }


        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchConfig([FromBody] DataTablePagedRequest<MasterConfigRequest> request)
        {

            var response = await _configService.SearchConfigAsync(request);

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
