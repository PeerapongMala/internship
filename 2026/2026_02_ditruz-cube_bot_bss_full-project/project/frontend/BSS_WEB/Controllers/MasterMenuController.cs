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
    public class MasterMenuController : Controller
    {
        private readonly ILogger<MasterMenuController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMasterMenuService _menuService;
        public MasterMenuController(ILogger<MasterMenuController> logger, IMasterMenuService menuService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _menuService = menuService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetMenuList()
        {
            var tsMenuRes = await _menuService.GetAllMasterMenuAsyn();
            
            if (tsMenuRes.data != null)
            {
                tsMenuRes.data = tsMenuRes.data.OrderBy(x => x.displayOrder).ToList();
            }

            return Json(tsMenuRes);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetMenuActiveList()
        {
            var menuResponse = await _menuService.GetMasterMenuActiveAsyn();
            return Json(menuResponse);
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> GetMenuById(int id)
        {
            var serviceResult = await _menuService.GetMenuByIdAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateMenu([FromBody] CreateMenuRequest requestData)
        {
            
            var menuResponse = await _menuService.CreateMenuAsync(requestData);
            return Json(menuResponse);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateMenu([FromBody] UpdateMenuRequest requestData)
        {
           

            var menuResponse = await _menuService.UpdateMenuAsync(requestData);
            return Json(menuResponse);
        }

        //[HttpGet]
        ////[ValidateAntiForgeryToken]
        //public async Task<IActionResult> DeleteMenu(int id)
        //{
        //    var menuResponse = await _menuService.DeleteMenuAsync(id);
        //    return Json(menuResponse);
        //}

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchMenu([FromBody] DataTablePagedRequest<MasterMenuRequest> request)
        {
            var response = await _menuService.SearchMenuAsync(request);

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
