using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterCompanyController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterCompanyService _companyService;

        public MasterCompanyController(IAppShare share, IMasterCompanyService companyService) : base(share)
        {
            _share = share;
            _companyService = companyService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _companyService.GetAllCompany();
            return ApiSuccess(data);
        }



        [HttpGet("GetById")]
        public async Task<IActionResult> GetCompanyById(int Id)
        {
            var data = await _companyService.GetCompanyById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateCompanyRequest request)
        {
            var existingData = await _companyService.GetCompanyByUniqueOrKey(request.CompanyCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _companyService.CreateCompany(request);
            return ApiSuccess("The company has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateCompanyRequest request)
        {

            var existingData = await _companyService.GetCompanyById(request.CompanyId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _companyService.UpdateCompany(request);
            return ApiSuccess("The company has been updated successfully.");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterCompanyViewData? companyData = await _companyService.GetCompanyById(Id);

            if (companyData == null)
            {
                return ApiDataNotFound();
            }

            await _companyService.DeleteCompany(companyData.CompanyId);
            return ApiSuccess("The company has been deleted successfully.");
        }

        [HttpPost("SearchCompany")]
        public async Task<IActionResult> SearchCompany(
        [FromBody] PagedRequest<MasterCompanyRequest> request)
        {
            var result = await _companyService.SearchCompany(request);
            return ApiSuccess(result);
        }

        [HttpGet("GetByIsActive")]
        public async Task<IActionResult> GetByIsActive()
        {
            var result = await _companyService.GetByIsActive();
            return ApiSuccess(result);
        }

    }
}
