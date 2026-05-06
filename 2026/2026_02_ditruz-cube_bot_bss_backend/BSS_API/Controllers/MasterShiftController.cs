using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterShiftController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterShiftService _shiftService;

        public MasterShiftController(IAppShare share, IMasterShiftService shiftService) : base(share)
        {
            _share = share;
            _shiftService = shiftService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _shiftService.GetAllShift();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetShiftById(int Id)
        {
            var data = await _shiftService.GetShiftById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpGet("GetShiftActive")]
        public async Task<IActionResult> GetShiftActive()
        {
            var data = await _shiftService.GetShiftInfoActiveAsync();
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data.FirstOrDefault());
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateShiftRequest request)
        {
            var existingData = await _shiftService.GetShiftByUniqueOrKey(request.ShiftCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _shiftService.CreateShift(request);
            return ApiSuccess("The shift has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateShiftRequest request)
        {
            var existingData = await _shiftService.GetShiftById(request.ShiftId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _shiftService.UpdateShift(request);
            return ApiSuccess("The shift has been updated successfully.");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterShiftViewData? data = await _shiftService.GetShiftById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _shiftService.DeleteShift(data.ShiftId);
            return ApiSuccess("The shift has been deleted successfully.");
        }

        [HttpPost("SearchShift")]
        public async Task<IActionResult> SearchSeriesDenom(
        [FromBody] PagedRequest<MasterShiftRequest> request)
        {
            var result = await _shiftService.SearchShift(request);
            return ApiSuccess(result);
        }
    }
}
