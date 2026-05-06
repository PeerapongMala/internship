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
    public class MasterInstitutionController : BaseController
    {

        private readonly IAppShare _share;
        private readonly IMasterInstitutionService _institutionService;

        public MasterInstitutionController(IAppShare share, IMasterInstitutionService institutionService) : base(share)
        {
            _share = share;
            _institutionService = institutionService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _institutionService.GetAllInstitution();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetInstitutionById(int Id)
        {
            var data = await _institutionService.GetInstitutionById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateInstitutionRequest request)
        {
            var existingData = await _institutionService.GetInstitutionByUniqueOrKey(request.InstitutionCode.Trim());

            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _institutionService.CreateInstitution(request);
            return ApiSuccess("The institution has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateInstitutionRequest request)
        {
            var existingData = await _institutionService.GetInstitutionById(request.InstitutionId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _institutionService.UpdateInstitution(request);
            return ApiSuccess("The institution has been updated successfully.");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterInstitutionViewData? data = await _institutionService.GetInstitutionById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

           await _institutionService.DeleteInstitution(data.InstitutionId);
            return ApiSuccess("The institution has been deleted successfully.");
        }
        [HttpPost("SearchInstitution")]
        public async Task<IActionResult> SearchInstitution(
        [FromBody] PagedRequest<MasterInstitutionRequest> request)
        {
            var result = await _institutionService.SearchInstitution(request);
            return ApiSuccess(result);
        }
    }
}
