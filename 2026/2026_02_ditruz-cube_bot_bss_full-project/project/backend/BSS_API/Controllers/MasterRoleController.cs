
using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Implementation;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterRoleController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterRoleService _roleService;

        public MasterRoleController(IAppShare share, IMasterRoleService roleService) : base(share)
        {
            _share = share;
            _roleService = roleService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _roleService.GetAllRoles();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetRoleById(int Id)
        {
            var data = await _roleService.GetRoleById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("GetByFilter")]
        public async Task<IActionResult> GetRoleByFilter(RoleFilterRequest request)
        {
            var data = await _roleService.GetRoleByFilter(request);
            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateRoleRequest request)
        {

            var existingData = await _roleService.GetRoleByCode(request.RoleCode.Trim());
            if (existingData != null)
            {
                return ApiDataDuplicate();
            }

            await _roleService.CreateRole(request);
            return ApiSuccess("The role has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateRoleRequest request)
        {

            var existingData = await _roleService.GetRoleById(request.RoleId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _roleService.UpdateRole(request);
            return ApiSuccess("The role has been updated successfully");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterRoleViewData? data = await _roleService.GetRoleById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _roleService.DeleteRole(data.RoleId);
            return ApiSuccess("The role has been deleted successfully.");
        }


        [HttpPost("SearchRole")]
        public async Task<IActionResult> SearchRole(
        [FromBody] PagedRequest<MasterRoleRequest> request)
        {
            var result = await _roleService.SearchRole(request);
            return ApiSuccess(result);
        }
    }
}
