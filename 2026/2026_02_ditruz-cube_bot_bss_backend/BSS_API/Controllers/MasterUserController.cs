using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Implementation;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterUserController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterUserService _userService;
        private readonly IMasterUserRoleService _userRoleService;
        public MasterUserController(IAppShare share, IMasterUserService userService, IMasterUserRoleService userRoleService) : base(share)
        {
            _share = share;
            _userService = userService;
            _userRoleService = userRoleService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _userService.GetAllUsers();
            return ApiSuccess(data);
        }

        [HttpPost("GetByFilter")]
        public async Task<IActionResult> GetUserByFilter(GetUserByFilterRequest request)
        {
            var data = await _userService.GetUserByFilter(request);
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetUserById(int Id)
        {
            var data = await _userService.GetUserById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateUserRequest request)
        {
            var existingUserName = await _userService.GetUserByUserName(request.UserName.Trim());
            if (existingUserName.Any())
            {
                return ApiDataDuplicate();
            }

            var existingEmail = await _userService.GetUserByEmail(request.UserEmail.Trim());
            if (existingEmail.Any())
            {
                return ApiDataDuplicate();
            }

            await _userService.CreateUser(request);
            return ApiSuccess("The user has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateUserRequest request)
        {
            var existingData = await _userService.GetUserById(request.UserId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _userService.UpdateUser(request);
            return ApiSuccess("The user has been updated successfully.");
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(DeleteUserRequest request)
        {
            MasterUserViewData? data = await _userService.GetUserById(request.UserId);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _userService.DeleteUser(request);
            return ApiSuccess("The user has been deleted successfully.");
        }

        [HttpPost("SearchUser")]
        public async Task<IActionResult> SearchUser(
        [FromBody] PagedRequest<MasterUserRequest> request)
        {
            var result = await _userService.SearchUser(request);
            return ApiSuccess(result);
        }
    }
}
