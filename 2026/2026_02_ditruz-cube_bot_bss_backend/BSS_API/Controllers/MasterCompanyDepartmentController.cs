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
    public class MasterCompanyDepartmentController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterCompanyDepartmentService _mainService;

        public MasterCompanyDepartmentController(IAppShare share, IMasterCompanyDepartmentService mainService) : base(share)
        {
            _share = share;
            _mainService = mainService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _mainService.GetAllCompanyDepartment();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetCompanyById(int Id)
        {
            var data = await _mainService.GetCompanyDepartmentById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpGet("GetCompanyDepartmentInfo")]
        public async Task<IActionResult> GetCompanyDepartmentInfo(int departmentId)
        {
            var data = await _mainService.GetCompanyDepartmentInfo(departmentId);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateCompanyDepartment request)
        {

            var existingData = await _mainService.GetCompanyDepartmentByUniqueOrKey(request.CompanyId, request.DepartmentId);
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _mainService.CreateCompanyDepartment(request);
            return ApiSuccess("The Company Department has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateCompanyDepartment request)
        {
            var existingData = await _mainService.GetCompanyDepartmentById(request.ComdeptId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _mainService.UpdateCompanyDepartment(request);
            return ApiSuccess("The Company Department has been updated successfully.");
        }
        /*
        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterCompanyDepartmentViewData? data = await _mainService.GetCompanyDepartmentById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _mainService.DeleteCompanyDepartment(data.ComdeptId);
            return ApiSuccess("The Company Departent has been deleted successfully.");
        }
        */

        [HttpPost("SearchCompanyDepartment")]
        public async Task<IActionResult> SearchCompanyDepartment(
        [FromBody] PagedRequest<MasterCompanyDepartmentRequest> request)
        {
            var result = await _mainService.SearchCompanyDepartment(request);
            return ApiSuccess(result);
        }


        [HttpGet("GetCbBcdCodeByCompany")]
        public async Task<IActionResult> GetCbBcdCodeByCompany(int companyId)
        {
            var data = await _mainService.GetCbBcdCode(companyId); 
            return ApiSuccess(data);
        }

        [HttpGet("GetCbBcdCodeByDepartmentInsituion")]
        public async Task<IActionResult> GetCbBcdCodeByCompany(int departmentId,int institutionId)
        {
            var data = await _mainService.GetCbBcdCode(departmentId,institutionId);
            return ApiSuccess(data);
        }
    }
}
