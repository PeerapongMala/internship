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
    public class MasterDenomReconcileController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterDenomReconcileService _denomreconcileService;
        public MasterDenomReconcileController(IAppShare share, IMasterDenomReconcileService denomreconcileService) : base(share)
        {
            _share = share;
            _denomreconcileService = denomreconcileService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _denomreconcileService.GetAllDenomReconcile();
            return ApiSuccess(data);

        }

        /*
        [HttpPost("GetByFilter")]
        public async Task<IActionResult> GetDenomReconcileByFilter(DenomReconcileFilterRequest request)
        {
            var data = await _denomreconcileService.GetDenomReconcileByFilter(request);
            return ApiSuccess(data);
        }
        */

        [HttpGet("GetById")]
        public async Task<IActionResult> GetDenomReconcileById(int Id)
        {
            var data = await _denomreconcileService.GetDenomReconcileById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);

        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateDenomReconcileRequest request)
        {

            var existingData = await _denomreconcileService.GetDenomReconcileByUniqueOrKey(request.DenoId, request.DepartmentId, request.SeriesDenomId);
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _denomreconcileService.CreateDenomReconcile(request);
            return ApiSuccess("The denomreconcile has been created successfully.");

            
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateDenomReconcileRequest request)
        {
            var existingData = await _denomreconcileService.GetDenomReconcileById(request.DenomReconcileId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _denomreconcileService.UpdateDenomReconcile(request);
            return ApiSuccess("The denomreconcile has been updated successfully.");
           
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterDenomReconcileViewData? data = await _denomreconcileService.GetDenomReconcileById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _denomreconcileService.DeleteDenomReconcile(data.DenomReconcileId);
            return ApiSuccess("The role has been deleted successfully.");

        }

        [HttpPost("SearchDenomReconcile")]
        public async Task<IActionResult> SearchDenomReconcile(
        [FromBody] PagedRequest<MasterDenomReconcileRequest> request)
        {
            var result = await _denomreconcileService.SearchDenomReconcile(request);
            return ApiSuccess(result);
        }
    }
}
