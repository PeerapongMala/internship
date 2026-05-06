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
    public class MasterMSevendenomSeriesController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterMSevendenomSeriesService _SevendenomSerieService;

        public MasterMSevendenomSeriesController(IAppShare share, IMasterMSevendenomSeriesService sevendenomSerieService) : base(share)
        {
            _share = share;
            _SevendenomSerieService = sevendenomSerieService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAlll()
        {
            var data = await _SevendenomSerieService.GetAllMSevendenomSeries();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetById(int Id)
        {
            var data = await _SevendenomSerieService.GetMSevendenomSeriesById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateMSevendenomSeries request)
        {
            var existingData = await _SevendenomSerieService.GetMSevendenomSeriesByUniqueOrKey(request.MSevenDenomId, request.SeriesDenomId);
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _SevendenomSerieService.CreateMSevendenomSeries(request);
            return ApiSuccess("The M7 Denom Series has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateMSevendenomSeries request)
        {
            var existingData = await _SevendenomSerieService.GetMSevendenomSeriesById(request.MSevendenomSeriesId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _SevendenomSerieService.UpdateMSevendenomSeries(request);
            return ApiSuccess("The M7 Denom Series has been updated successfully");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterMSevendenomSeriesViewData? data = await _SevendenomSerieService.GetMSevendenomSeriesById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _SevendenomSerieService.DeleteMSevendenomSeries(data.MSevendenomSeriesId);
            return ApiSuccess("The M7 Demon Series has been deleted successfully.");
        }

        [HttpPost("MSevendenomSeries")]
        public async Task<IActionResult> MSevendenomSeries(
        [FromBody] PagedRequest<MasterMSevendenomSeriesRequest> request)
        {
            var result = await _SevendenomSerieService.SearchMSevendenomSeries(request);
            return ApiSuccess(result);
        }
    }
}
