using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterUserRoleController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterUserRoleService _userRoleService;

        public MasterUserRoleController(IAppShare share, IMasterUserRoleService userRoleService) : base(share)
        {
            _share = share;
            _userRoleService = userRoleService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _userRoleService.GetAllUserRole();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetUserRoleById(int Id)
        {
            var data = await _userRoleService.GetUserRolesById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpGet("GetByUserId")]
        public async Task<IActionResult> GetUserRoleByUserId(int userId)
        {
            var data = await _userRoleService.GetUserRolesByUserId(userId);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateUserRoleRequest request)
        {
            var existingData = await _userRoleService.GetUserRoleByUniqueOrKey(request.UserId, request.RoleGroupId);
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _userRoleService.CreateUserRole(request);
            return ApiSuccess("The user role has been created successfully.");
        }


        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateUserRoleRequest request)
        {
            var existingData = await _userRoleService.GetUserRolesById(request.UserRoleId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _userRoleService.UpdateUserRole(request);
            return ApiSuccess("The user role has been updated successfully.");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterUserRole? data = await _userRoleService.GetUserRolesById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _userRoleService.DeleteUserRole(data.UserRoleId);
            return ApiSuccess("The user role has been deleted successfully.");
        }
    }
}
