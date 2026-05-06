using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Implementation;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterCashCenterController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterCashCenterService _cashcenterService;

        public MasterCashCenterController(IAppShare share, IMasterCashCenterService cashcenterService) : base(share)
        {
            _share = share;
            _cashcenterService = cashcenterService;
        }


        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _cashcenterService.GetAllCashCenter();
            return ApiSuccess(data);

        }

        [HttpPost("GetByFilter")]
        public async Task<IActionResult> GetCashCenterByFilter(CashCenterFilterRequest request)
        {

            var data = await _cashcenterService.GetCashCenterByFilter(request);
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetCashCenterById(int Id)
        {

            var data = await _cashcenterService.GetCashCenterById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);

        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateCashCenterRequest request)
        {

            var existingData = await _cashcenterService.GetCashCenterByUniqueOrKey(request.CashCenterCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _cashcenterService.CreateCashCenter(request);
            return ApiSuccess("The cashcenter has been created successfully.");

        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateCashCenterRequest request)
        {
            var existingData = await _cashcenterService.GetCashCenterById(request.CashCenterId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _cashcenterService.UpdateCashCenter(request);
            return ApiSuccess("The cashcenter has been updated successfully.");

        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterCashCenterViewData? cashcenterData = await _cashcenterService.GetCashCenterById(Id);

            if (cashcenterData == null)
            {
                return ApiDataNotFound();
            }

            await _cashcenterService.DeleteCashCenter(cashcenterData.CashCenterId);
            return ApiSuccess("The cashcenter has been deleted successfully.");

        }

        [HttpPost("SearchCashCenter")]
        public async Task<IActionResult> SearchCashCenter(
        [FromBody] PagedRequest<MasterCashCenterRequest> request)
        {
            var result = await _cashcenterService.SearchCashCenter(request);
            return ApiSuccess(result);
        }
    }
}
