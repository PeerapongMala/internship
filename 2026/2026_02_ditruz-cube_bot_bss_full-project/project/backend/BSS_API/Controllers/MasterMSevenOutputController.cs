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
    public class MasterMSevenOutputController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterMSevenOutputService _mSevenOutputService;

        public MasterMSevenOutputController(IAppShare share, IMasterMSevenOutputService mSevenOutputService) : base(share)
        {
            _share = share;
            _mSevenOutputService = mSevenOutputService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _mSevenOutputService.GetAllMSevenOutput();
            return ApiSuccess(data);

        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetMSevenOutputById(int Id)
        {
            var data = await _mSevenOutputService.GetMSevenOutputById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }
            return ApiSuccess(data);

        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateMSevenOutputRequest request)
        {
            var existingData = await _mSevenOutputService.GetMSevenOutputByUniqueOrKey(request.MSevenOutputCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _mSevenOutputService.CreateMSevenOutput(request);
            return ApiSuccess("The mSevenOutput has been updated successfully.");

        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateMSevenOutputRequest request)
        {

            var existingData = await _mSevenOutputService.GetMSevenOutputById(request.MSevenOutputId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _mSevenOutputService.UpdateMSevenOutput(request);
            return ApiSuccess("The mSevenOutput has been updated successfully.");

        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterMSevenOutput? mSevenOutputData = await _mSevenOutputService.GetMSevenOutputById(Id);

            if (mSevenOutputData == null)
            {
                return ApiDataNotFound();
            }

            await _mSevenOutputService.DeleteMSevenOutput(mSevenOutputData.MSevenOutputId);
            return ApiSuccess("The mSevenOutput has been deleted successfully.");

        }


        [HttpPost("SearchMSevenOutput")]
        public async Task<IActionResult> SearchMSevenOutput(
        [FromBody] PagedRequest<MasterMSevenOutputRequest> request)
        {
            var result = await _mSevenOutputService.SearchMSevenOutput(request);
            return ApiSuccess(result);
        }
    }
}
