using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterZoneCashpointController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterZoneCashpointService _zoneCashpointService;
        public MasterZoneCashpointController(IAppShare share, IMasterZoneCashpointService zoneService) : base(share)
        {
            _share = share;
            _zoneCashpointService = zoneService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _zoneCashpointService.GetAllZoneCashpoints();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _zoneCashpointService.GetZoneCashpoinById(id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("GetByFilter")]
        public async Task<IActionResult> GetByFilter(ZoneCashpointFilterRequest request)
        {
            var data = await _zoneCashpointService.GetZoneCashpointByFilter(request);
            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateZoneCashpoint request)
        {
            var existingData = await _zoneCashpointService.GetZoneCashpointByUniqueOrKey(request.ZoneId, request.CashpointId);
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _zoneCashpointService.CreateZoneCashpoint(request);
            return ApiSuccess("The Zone Cashpoint has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateZoneCashpoint request)
        {
            var existingData = await _zoneCashpointService.GetZoneCashpoinById(request.ZoneCashpointId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _zoneCashpointService.UpdateZoneCashpoint(request);
            return ApiSuccess("The Zone Cashpoint has been updated successfully");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterZoneCashpointViewData? data = await _zoneCashpointService.GetZoneCashpoinById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

           await _zoneCashpointService.DeleteZoneCashpoint(data.ZoneCashpointId);
            return ApiSuccess("The Zone Cashpoint has been deleted successfully.");
        }

        [HttpPost("SearchZoneCashpoint")]
        public async Task<IActionResult> SearchZoneCashpoint(
        [FromBody] PagedRequest<MasterZoneCashpointRequest> request)
        {
            var result = await _zoneCashpointService.SearchZoneCashpoint(request);
            return ApiSuccess(result);
        }
    }
}
