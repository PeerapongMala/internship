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
    public class MasterMSevenQualityController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterMSevenQualityService _mSevenQualityService;
        public MasterMSevenQualityController(IAppShare share, IMasterMSevenQualityService mSevenQualityService) : base(share)
        {
            _share = share;
            _mSevenQualityService = mSevenQualityService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {

            var data = await _mSevenQualityService.GetAllMSevenQuality();
            return ApiSuccess(data);

        }
        [HttpGet("GetById")]
        public async Task<IActionResult> GetMSevenQualityById(int Id)
        {
            var data = await _mSevenQualityService.GetMSevenQualityById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }
            return ApiSuccess(data);

        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateMSevenQualityRequest request)
        {
            var existingData = await _mSevenQualityService.GetMSevenQualityByUniqueOrKey(request.M7QualityCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _mSevenQualityService.CreateMSevenQuality(request);
            return ApiSuccess("The Machine Seven Quality has been updated successfully.");

        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateMSevenQualityRequest request)
        {

            var existingData = await _mSevenQualityService.GetMSevenQualityById(request.M7QualityId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _mSevenQualityService.UpdateMSevenQuality(request);
            return ApiSuccess("The Machine Seven Quality has been updated successfully.");

        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterMSevenQuality? mSevenQualityData = await _mSevenQualityService.GetMSevenQualityById(Id);

            if (mSevenQualityData == null)
            {
                return ApiDataNotFound();
            }

            await _mSevenQualityService.DeleteMSevenQuality(mSevenQualityData.M7QualityId);
            return ApiSuccess("The Machine Seven Quality has been deleted successfully.");
        }


        [HttpPost("SearchMSevenQuality")]
        public async Task<IActionResult> SearchMSevenQuality(
        [FromBody] PagedRequest<MasterMSevenQualityRequest> request)
        {
            var result = await _mSevenQualityService.SearchMSevenQuality(request);
            return ApiSuccess(result);
        }
    }
}
