using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace BSS_API.Controllers
{

    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class NavigationMenuController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterNavigationMenuService _menuService;

        public NavigationMenuController(IAppShare share, IMasterNavigationMenuService menuService) : base(share)
        {
            _share = share;
            _menuService = menuService;
        }

        [HttpGet("GetMenuByRole")]
        public IActionResult GetMenuByRole(int roleId)
        {
            var serviceResponse = new BaseResponse<IEnumerable<NavigationMenuViewModel>>();

            var menuLists = _menuService.GetMenuByRoleId(roleId);
            serviceResponse.data = menuLists;
            serviceResponse.is_success = true;
            serviceResponse.msg_code = AppErrorType.Success.GetCategory();
            serviceResponse.msg_desc = AppErrorType.Success.GetDescription();
            return Ok(serviceResponse);
        }
    }
}
