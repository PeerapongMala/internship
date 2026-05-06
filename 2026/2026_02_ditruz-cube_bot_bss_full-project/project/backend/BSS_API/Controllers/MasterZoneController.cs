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
    public class MasterZoneController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterZoneService _zoneService;
        public MasterZoneController(IAppShare share, IMasterZoneService zoneService) : base(share)
        {
            _share = share;
            _zoneService = zoneService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _zoneService.GetAllZone();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _zoneService.GetMasterZoneById(id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("GetByFilter")]
        public async Task<IActionResult> GetByFilter(ZoneFilterRequest request)
        {
            var data = await _zoneService.GetZoneByFilter(request);
            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateMasterZoneRequest request)
        {
            var existingData = await _zoneService.GetZoneByUniqueOrKey(request.ZoneCode.Trim(), request.DepartmentId, request.InstId);
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _zoneService.CreateZone(request);
            return ApiSuccess("The Zone has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateMasterZoneRequest request)
        {
            var existingData = await _zoneService.GetMasterZoneById(request.ZoneId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _zoneService.UpdateZone(request);
            return ApiSuccess("The Zone has been updated successfully.");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterZoneViewData? data = await _zoneService.GetMasterZoneById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _zoneService.DeleteZone(data.ZoneId);
            return ApiSuccess("The Zone has been deleted successfully.");
        }

        [HttpPost("SearchZone")]
        public async Task<IActionResult> SearchZone(
        [FromBody] PagedRequest<MasterZoneRequest> request)
        {
            var result = await _zoneService.SearchZone(request);
            return ApiSuccess(result);
        }
    }
}
