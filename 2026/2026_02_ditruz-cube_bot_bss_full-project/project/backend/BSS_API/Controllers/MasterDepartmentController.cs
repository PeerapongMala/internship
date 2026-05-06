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
    public class MasterDepartmentController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterDepartmentService _departmentService;
        public MasterDepartmentController(IAppShare share, IMasterDepartmentService departmentService) : base(share)
        {
            _share = share;
            _departmentService = departmentService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _departmentService.GetAllDepartment();
            return ApiSuccess(data);
        }

        [HttpPost("GetByFilter")]
        public async Task<IActionResult> GetDepartmentByFilter(DepartmentFilterRequest request)
        {
            var data = await _departmentService.GetDepartmentByFilter(request);
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetDepartmentById(int departmentId)
        {
            var data = await _departmentService.GetDepartmentById(departmentId);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateDepartmentRequest request)
        {
            var existingData = await _departmentService.GetDepartmentByUniqueOrKey(request.DepartmentCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _departmentService.CreateDepartment(request);
            return ApiSuccess("The department has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateDepartmentRequest request)
        {
            var existingData = await _departmentService.GetDepartmentById(request.DepartmentId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _departmentService.UpdateDepartment(request);
            return ApiSuccess("The department has been updated successfully");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int departmentId)
        {
            MasterDepartmentViewData? data = await _departmentService.GetDepartmentById(departmentId);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _departmentService.DeleteDepartment(data.DepartmentId);
            return ApiSuccess("The Department has been deleted successfully.");
        }

        [HttpPost("SearchDepartment")]
        public async Task<IActionResult> SearchDepartment(
        [FromBody] PagedRequest<MasterDepartmentRequest> request)
        {
            var result = await _departmentService.SearchDepartment(request);
            return ApiSuccess(result);
        }

        [HttpGet("DepartmentsIsActive")]
        public async Task<IActionResult> DepartmentsIsActive()
        {
            var result = await _departmentService.GetDepartmentsActivceAsync();
            return ApiSuccess(result);
        }
    }
}
