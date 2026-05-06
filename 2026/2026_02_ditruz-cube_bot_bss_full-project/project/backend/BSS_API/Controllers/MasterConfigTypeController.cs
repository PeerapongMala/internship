using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
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
    public class MasterConfigTypeController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterConfigTypeService _configTypeService;

        public MasterConfigTypeController(IAppShare share, IMasterConfigTypeService configTypeService) : base(share)
        {
            _share = share;
            _configTypeService = configTypeService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _configTypeService.GetAllConfigType();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetById(int Id)
        {
            var data = await _configTypeService.GetConfigTypeById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }
            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateConfigTypeRequest request)
        {
            var existingData = await _configTypeService.GetConfigTypeByUniqueOrKey(request.ConfigTypeCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _configTypeService.CreateConfigType(request);
            return ApiSuccess("The config type has been updated successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateConfigTypeRequest request)
        {
            var existingData = await _configTypeService.GetConfigTypeById(request.ConfigTypeId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _configTypeService.UpdateConfigType(request);
            return ApiSuccess("The config type has been updated successfully.");

        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {

            MasterConfigType? configTypeData = await _configTypeService.GetConfigTypeById(Id);

            if (configTypeData == null)
            {
                return ApiDataNotFound();
            }

            await _configTypeService.DeleteConfigType(configTypeData.ConfigTypeId);
            return ApiSuccess("The config type has been deleted successfully.");

        }

        [HttpPost("SearchConfigType")]
        public async Task<IActionResult> SearchConfigType(
        [FromBody] PagedRequest<MasterConfigTypeRequest> request)
        {
            var result = await _configTypeService.SearchConfigType(request);
            return ApiSuccess(result);
        }
    }
}
