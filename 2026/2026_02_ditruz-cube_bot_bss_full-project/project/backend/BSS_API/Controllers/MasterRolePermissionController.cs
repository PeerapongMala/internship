using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Implementation;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterRolePermissionController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterRolePermissionService _rolePermissionService;
        private readonly IMasterMenuService _menuService;

        public MasterRolePermissionController(IAppShare share, IMasterRolePermissionService rolePermissionService, IMasterMenuService menuService) : base(share)
        {
            _share = share;
            _rolePermissionService = rolePermissionService;
            _menuService = menuService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _rolePermissionService.GetAllRolePermissions();
            return ApiSuccess(data);
        }

        [HttpGet("GetRolePermissionLists")]
        public async Task<IActionResult> GetRolePermissionLists()
        {
            var data = await _rolePermissionService.GetRolePermissionLists();
            return ApiSuccess(data);
        }

        [HttpPost("GetByFilter")]
        public async Task<IActionResult> GetRolePermissionByFilter(RolePermissionFilterRequest request)
        {
            var data = await _rolePermissionService.GetRolePermissionByFilter(request);
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetRolePermissionById(int Id)
        {
            var data = await _rolePermissionService.GetRolePermissionByRoleId(Id);
            return ApiSuccess(data);
        }
        /*
        [HttpPost("Create")]
        public async Task<IActionResult> Create(SaveRolePermissionRequest request)
        {
            // Duplicate Role Permission
            var existingData = await _rolePermissionService.GetRolePermissionByUniqueOrKey(request.RoleId);
            if (existingData.Any())
            {
                return ApiDataDuplicate("ตรวจพบข้อมูลซ้ำ มีข้อมูลอยู่ในระบบแล้ว");
            }

            await _rolePermissionService.CreateOrUpdateRolePermission(request);
            return ApiSuccess("The role permission has been created successfully.");
        }
        */
        [HttpPost("Update")]
        public async Task<IActionResult> Update(SaveRolePermissionRequest request)
        {
            var existingData = await _rolePermissionService.GetRolePermissionByUniqueOrKey(request.RoleId);
            if (existingData.Any())
            {
                await _rolePermissionService.DeleteRolePermissionByRoleId(request.RoleId);
            }

            await _rolePermissionService.CreateOrUpdateRolePermission(request);
            return ApiSuccess("The role permission has been update successfully");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterRolePermission? data = await _rolePermissionService.GetRolePermissionById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _rolePermissionService.DeleteRolePermission(data.RolePermissionId);
            return ApiSuccess("The role permission has been deleted successfully.");
        }
    }
}
