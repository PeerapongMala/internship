using Azure;
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
using Newtonsoft.Json;
using System.Net.Mime;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterMenuController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterMenuService _menuService;

        public MasterMenuController(IAppShare share, IMasterMenuService menuService) : base(share)
        {
            _share = share;
            _menuService = menuService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _menuService.GetAllMenu();
            return ApiSuccess(data);
        }

        [HttpGet("GetMenuActive")]
        public async Task<IActionResult> GetMenuActive()
        {
            var data = await _menuService.GetMenuActiveList();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetMenuById(int Id)
        {
            var data = await _menuService.GetMenuById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateMenuRequest request)
        {
            var existingData = await _menuService.GetMenuByUniqueOrKey(request.MenuName, request.MenuPath);
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _menuService.CreateMenu(request); 
            return ApiSuccess("The menu has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateMenuRequest request)
        {
             
            var existingData = await _menuService.GetMenuById(request.MenuId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _menuService.UpdateMenu(request);
            return ApiSuccess("The menu has been updated successfully");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterMenuViewData? data = await _menuService.GetMenuById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _menuService.DeleteMenu(data.MenuId);
            return ApiSuccess("The menu has been deleted successfully.");
        }

        [HttpPost("SearchMenu")]
        public async Task<IActionResult> SearchMenu(
        [FromBody] PagedRequest<MasterMenuRequest> request)
        {
            var result = await _menuService.SearchMenu(request);
            return ApiSuccess(result);
        }
    }
}
