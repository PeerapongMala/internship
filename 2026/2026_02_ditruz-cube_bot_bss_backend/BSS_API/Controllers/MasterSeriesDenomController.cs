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
    public class MasterSeriesDenomController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterSeriesDenomService _masterSeriesDenomService;
        public MasterSeriesDenomController(IAppShare share, IMasterSeriesDenomService masterSeriesDenomService) : base(share)
        {
            _share = share;
            _masterSeriesDenomService = masterSeriesDenomService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _masterSeriesDenomService.GetAllSeriesDenom();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetById(int Id)
        {
            var data = await _masterSeriesDenomService.GetMasterSeriesDenomById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateSeriesDenom requst)
        {
            var existingData = await _masterSeriesDenomService.GetSeriesDenomByUniqueOrKey(requst.SeriesCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _masterSeriesDenomService.CreateSeriesDenom(requst);
            return ApiSuccess("The Series Denom has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateSeriesDenom request)
        {
            var existingData = await _masterSeriesDenomService.GetMasterSeriesDenomById(request.SeriesDenomId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _masterSeriesDenomService.UpdateSeriesDenom(request);
            return ApiSuccess("The cash type has been updated successfully.");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterSeriesDenomViewData? data = await _masterSeriesDenomService.GetMasterSeriesDenomById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _masterSeriesDenomService.DeleteSeriesDenom(data.SeriesDenomId);
            return ApiSuccess("The Series Demon has been deleted successfully.");
        }

        [HttpPost("SearchSeriesDenom")]
        public async Task<IActionResult> SearchSeriesDenom(
        [FromBody] PagedRequest<MasterSeriesDenomRequest> request)
        {
            var result = await _masterSeriesDenomService.SearchSeriesDenom(request);
            return ApiSuccess(result);
        }

    }
}
