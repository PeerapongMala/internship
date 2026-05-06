using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterRolePermissionController : Controller
    {
        private readonly ILogger<MasterRolePermissionController> _logger;
        private readonly IMasterRolePermissionService _rolePermissionService;
        private readonly IMasterRoleService _roleService;
        private readonly IMasterMenuService _menuSevice;
        public MasterRolePermissionController(ILogger<MasterRolePermissionController> logger, IMasterRolePermissionService rolePermissionService, IMasterMenuService menuSevice, IMasterRoleService roleService)
        {
            _logger = logger;
            _rolePermissionService = rolePermissionService;
            _menuSevice = menuSevice;
            _roleService = roleService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetRolePermissionList([FromBody] RolePermissionFilterSearch requestData)
        {
            var rolePermissionResult = await _rolePermissionService.GetRolePermissionByFilterAsync(requestData);
            return Json(rolePermissionResult);
        }

        /*
        [HttpPost]
        public async Task<IActionResult> CreateRolePermission([FromBody] CreateRolePermissionRequest requestData)
        {
            var rolePermissionResponse = await _rolePermissionService.CreateRolePermissionAsync(requestData);
            return Json(rolePermissionResponse);
        }
        */
        [HttpGet]
        public async Task<IActionResult> GetRolePermissionById(int id)
        {
            var rolePermissionResponse = await _rolePermissionService.GetRolePermissionByIdAsync(id);
            return Json(rolePermissionResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateRolePermission([FromBody] SaveRolePermissionRequest requestData)
        {
            var rolePermissionResponse = await _rolePermissionService.UpdateRolePermissionAsync(requestData);
            return Json(rolePermissionResponse);
        }

        /*
        [HttpGet]
        public async Task<IActionResult> DeleteRolePermission(int id)
        {
            var rolePermissionResponse = await _rolePermissionService.DeleteRolePermissionAsync(id);
            return Json(rolePermissionResponse);
        }
        */
    }
}

