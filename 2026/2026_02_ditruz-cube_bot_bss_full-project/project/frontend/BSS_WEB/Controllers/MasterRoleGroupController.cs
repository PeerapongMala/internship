using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterRoleGroupController : Controller
    {
        private readonly ILogger<MasterRoleGroupController> _logger;
        private readonly IMasterRoleGroupService _roleGroupService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MasterRoleGroupController(ILogger<MasterRoleGroupController> logger, IMasterRoleGroupService roleGroupService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _roleGroupService = roleGroupService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }


        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetAllRoleGroupList()
        {
            var roleGrouResult = await _roleGroupService.GetAllMasterRoleGroupAsyn();
            return Json(roleGrouResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetRoleGroupById(int id)
        {
            var roleGrouResult = await _roleGroupService.GetRoleGroupByIdAsync(id);
            return Json(roleGrouResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateRoleGroup([FromBody] CreateRoleGroupRequest requestData)
        {
          
            var roleGrouResult = await _roleGroupService.CreateRoleGroupAsync(requestData);
            return Json(roleGrouResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateRoleGroup([FromBody] UpdateRoleGroupRequest requestData)
        {
           
            var roleGrouResult = await _roleGroupService.UpdateRoleGroupAsync(requestData);
            return Json(roleGrouResult);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteRoleGroup(int id)
        {
            var roleGrouResult = await _roleGroupService.DeleteRoleGroupAsync(id);
            return Json(roleGrouResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchRoleGroup([FromBody] DataTablePagedRequest<MasterRoleGroupRequest> request)
        {
            var response = await _roleGroupService.SearchRoleGroupAsync(request);

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
