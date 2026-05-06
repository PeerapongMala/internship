using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterRoleGroupController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterRoleGroupService _roleGroupService;

        public MasterRoleGroupController(IAppShare share, IMasterRoleGroupService roleGroupService) : base(share)
        {
            _share = share;
            _roleGroupService = roleGroupService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _roleGroupService.GetAllRoleGroups();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetRoleGroupById(int Id)
        {

            var data = await _roleGroupService.GetRoleGroupById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateRoleGroupRequest request)
        {

            var existingData = await _roleGroupService.GetRoleGroupByUniqueOrKey(request.RoleGroupCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _roleGroupService.CreateRoleGroup(request);
            return ApiSuccess("The role group has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateRoleGroupRequest request)
        {

            var existingData = await _roleGroupService.GetRoleGroupById(request.RoleGroupId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _roleGroupService.UpdateRoleGroup(request);
            return ApiSuccess("The role group has been updated successfully.");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterRoleGroupViewData? data = await _roleGroupService.GetRoleGroupById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _roleGroupService.DeleteRoleGroup(data.RoleGroupId);
            return ApiSuccess("The role group has been deleted successfully.");
        }

        [HttpPost("SearchRoleGroup")]
        public async Task<IActionResult> SearchRoleGroup(
        [FromBody] PagedRequest<MasterRoleGroupRequest> request)
        { 
            var result = await _roleGroupService.SearchRoleGroup(request);
            return ApiSuccess(result);
        }
    }
}
