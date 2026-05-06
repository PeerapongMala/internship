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
    public class MasterStatusController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterStatusService _statusService;
        public MasterStatusController(IAppShare share, IMasterStatusService statusService) : base(share)
        {
            _share = share;
            _statusService = statusService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _statusService.GetAllStatus();
            return ApiSuccess(data);

        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetStatusById(int Id)
        {
            var data = await _statusService.GetStatusById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }
            return ApiSuccess(data);

        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateStatusRequest request)
        {
            var existingData = await _statusService.GetStatusByUniqueOrKey(request.StatusCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _statusService.CreateStatus(request);
            return ApiSuccess("The Status has been updated successfully.");

        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateStatusRequest request)
        {

            var existingData = await _statusService.GetStatusById(request.StatusId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _statusService.UpdateStatus(request);
            return ApiSuccess("The status been updated successfully.");

        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterStatus? statusData = await _statusService.GetStatusById(Id);

            if (statusData == null)
            {
                return ApiDataNotFound();
            }

            await _statusService.DeleteStatus(statusData.StatusId);
            return ApiSuccess("The status been deleted successfully.");

        }

        [HttpPost("SearchStatus")]
        public async Task<IActionResult> SearchStatus(
        [FromBody] PagedRequest<MasterStatusRequest> request)
        {
            var result = await _statusService.SearchStatus(request);
            return ApiSuccess(result);
        }
    }
}
