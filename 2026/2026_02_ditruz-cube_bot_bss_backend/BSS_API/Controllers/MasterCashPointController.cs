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
    public class MasterCashPointController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterCashPointService _cashpointService;
        public MasterCashPointController(IAppShare share, IMasterCashPointService cashpointService) : base(share)
        {
            _share = share;
            _cashpointService = cashpointService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _cashpointService.GetAllCashPoint();
            return ApiSuccess(data);

        }

        [HttpPost("GetByFilter")]
        public async Task<IActionResult> GetCashPointByFilter(CashPointFilterRequest request)
        {
            var data = await _cashpointService.GetCashPointByFilter(request);
            return ApiSuccess(data);

        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetCashPointById(int Id)
        {
            var data = await _cashpointService.GetCashPointById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateCashPointRequest request)
        {

            var existingData = await _cashpointService.GetCashPointByUniqueOrKey(request.BranchCode.Trim(), request.InstitutionId,request.CbBcdCode);
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            } 
            await _cashpointService.CreateCashPoint(request);
            return ApiSuccess("The cashpoint has been created successfully.");

        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateCashPointRequest request)
        {
            var existingData = await _cashpointService.GetCashPointById(request.CashpointId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _cashpointService.UpdateCashPoint(request);
            return ApiSuccess("The cashpoint has been updated successfully.");

        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterCashPointViewData? cashpointData = await _cashpointService.GetCashPointById(Id);

            if (cashpointData == null)
            {
                return ApiDataNotFound();
            }

            await _cashpointService.DeleteCashPoint(cashpointData.CashpointId);
            return ApiSuccess("The cashpoint has been deleted successfully.");

        }

        [HttpPost("SearchCashPoint")]
        public async Task<IActionResult> SearchCashPoint(
        [FromBody] PagedRequest<MasterCashPointRequest> request)
        {
            var result = await _cashpointService.SearchCashPoint(request);
            return ApiSuccess(result);
        }
    }
}
