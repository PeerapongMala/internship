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
    public class MasterDenominationController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterDenominationService _denominationService;
        public MasterDenominationController(IAppShare share, IMasterDenominationService denominationService) : base(share)
        {
            _share = share;
            _denominationService = denominationService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _denominationService.GetAllDenomination();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetDenominationById(int Id)
        {
            var data = await _denominationService.GetDenominationById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateDenominationRequest request)
        {
            var existingData = await _denominationService.GetDenominationByUniqueOrKey(request.DenominationCode);

            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _denominationService.CreateDenomination(request);
            return ApiSuccess("The denomination has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateDenominationRequest request)
        {
            var serviceResponse = new BaseResponse<string>();
            var existingData = await _denominationService.GetDenominationById(request.DenominationId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _denominationService.UpdateDenomination(request);
            return ApiSuccess("The denomination has been updated successfully.");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterDenominationViewData? data = await _denominationService.GetDenominationById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _denominationService.DeleteDenomination(data.DenominationId);
            return ApiSuccess("The denomination has been deleted successfully.");
        }

        [HttpPost("SearchDenomination")]
        public async Task<IActionResult> SearchDenomination(
        [FromBody] PagedRequest<MasterDenominationRequest> request)
        {
            var result = await _denominationService.SearchDenomination(request);
            return ApiSuccess(result);
        }
    }
}
