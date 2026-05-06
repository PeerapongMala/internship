using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterConfigController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterConfigService _configService;
        public MasterConfigController(IAppShare share, IMasterConfigService configService) : base(share)
        {
            _share = share;
            _configService = configService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _configService.GetAllConfig();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetConfigById(int Id)
        {
            var data = await _configService.GetConfigById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }
            return ApiSuccess(data);

        }

        [HttpPost("GetByFilter")]
        public async Task<IActionResult> GetConfigByFilter(ConfigFilterRequest request)
        {
            var data = await _configService.GetConfigByFilter(request);
            return ApiSuccess(data);

        }

        [HttpGet("GetByCode")]
        public async Task<IActionResult> GetByCode(string configCode)
        {
            var data = await _configService.GetConfigByCode(configCode);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);

        }

        [HttpGet("GetByConfigTypeId")]
        public async Task<IActionResult> GetByConfigTypeId(int configTypeId)
        {
            var data = await _configService.GetByConfigTypeId(configTypeId);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);

        }
        [HttpGet("GetDefaultConfigInfo")]
        public async Task<IActionResult> GetDefaultConfigInfo()
        {
            var data = await _configService.GetDefaultConfigDataAsync();
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);

        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateConfigRequest request)
        {
            var existingData = await _configService.GetConfigByUniqueOrKey(request.ConfigCode.Trim() , request.ConfigTypeId);
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _configService.CreateConfig(request);
            return ApiSuccess("The config has been updated successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateConfigRequest request)
        {
            var existingData = await _configService.GetConfigById(request.ConfigId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _configService.UpdateConfig(request);
            return ApiSuccess("The config has been updated successfully.");

        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterConfigViewData? configData = await _configService.GetConfigById(Id);

            if (configData == null)
            {
                return ApiDataNotFound();
            }

            await _configService.DeleteConfig(configData.ConfigId);
            return ApiSuccess("The config has been deleted successfully.");

        }

        [HttpGet("GetByConfigTypeCode")]
        public async Task<IActionResult> GetByConfigTypeCode(string configTypeCode)
        {
            var data = await _configService.GetByConfigTypeCodeAsync(configTypeCode);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);

        }

        [HttpPost("SearchConfig")]
        public async Task<IActionResult> SearchConfig(
        [FromBody] PagedRequest<MasterConfigRequest> request)
        {
            var result = await _configService.SearchConfig(request);
            return ApiSuccess(result);
        }
    }
}
