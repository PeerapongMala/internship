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

    public class MasterCompanyInstitutionController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterCompanyInstitutionService _companyInstitutionService;
        public MasterCompanyInstitutionController(IAppShare share, IMasterCompanyInstitutionService companyInstitutionService) : base(share)
        {
            _share = share;
            _companyInstitutionService = companyInstitutionService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _companyInstitutionService.GetAllCompanyInstitution();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetById(int Id)
        {
            var data = await _companyInstitutionService.GetCompanyInstitutionById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateMasterCompanyInstitution request)
        {

            var existingData = await _companyInstitutionService.GetCompanyInstitutionByUniqueOrKey(request.CompanyId, request.InstId);
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _companyInstitutionService.CreateCompanyInstitution(request);
            return ApiSuccess("The Company Institution has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateCompanyInstitution request)
        {
            var existingData = await _companyInstitutionService.GetCompanyInstitutionById(request.CompanyInstId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _companyInstitutionService.UpdateCompanyInstitution(request);
            return ApiSuccess("The Company Institution has been updated successfully");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterCompanyInstitutionViewData? data = await _companyInstitutionService.GetCompanyInstitutionById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _companyInstitutionService.DeleteCompanyInstitution(data.CompanyInstId);
            return ApiSuccess("The Company Institution has been deleted successfully.");
        }


        [HttpPost("SearchCompanyInstitution")]
        public async Task<IActionResult> SearchCompanyInstitution(
        [FromBody] PagedRequest<MasterCompanyInstitutionRequest> request)
        {
            var result = await _companyInstitutionService.SearchCompanyInstitution(request);
            return ApiSuccess(result);
        }
    }
}
