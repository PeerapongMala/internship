using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Services;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterRoleController : Controller
    {
        private readonly ILogger<MasterRoleController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly IMasterRoleService _roleService;
        public MasterRoleController(ILogger<MasterRoleController> logger, IMasterRoleService roleService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _roleService = roleService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetRoleList()
        {
            var roleResult = await _roleService.GetAllMasterRoleAsyn();
            return Json(roleResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> LoadRoleListByFilter([FromBody] RoleFilterSearch filterData)
        {
            var roleResult = await _roleService.GetRoleByFilterAsync(filterData);
            return Json(roleResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest requestData)
        {
           
            var roleResponse = await _roleService.CreateRoleAsync(requestData);
            return Json(roleResponse);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetRoleById(int id)
        {
            var roleResponse = await _roleService.GetRoleByIdAsync(id);
            return Json(roleResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleRequest requestData)
        {
          
            
            var roleResponse = await _roleService.UpdateRoleAsync(requestData);
            return Json(roleResponse);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var roleResponse = await _roleService.DeleteRoleAsync(id);
            return Json(roleResponse);
        }

        [HttpPost] 
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchRole([FromBody] DataTablePagedRequest<MasterRoleRequest> request)
        {
            var response = await _roleService.SearchRoleAsync(request);

            return Json(new
            {
                draw = request.Draw,
                recordsTotal = response?.data?.TotalCount,
                recordsFiltered = response?.data?.TotalCount,
                data = response?.data?.Items
            });

        }
    }
}
