using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BSS_WEB.ViewComponents
{
    public class MenuViewComponent : ViewComponent
    {
        private readonly IDataAccessService _dataAccessService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IAppShare _appShare;
        public MenuViewComponent(IDataAccessService dataAccessService, IHttpContextAccessor httpContextAccessor, IAppShare appShare)
        {
            _dataAccessService = dataAccessService;
            _httpContextAccessor = httpContextAccessor;
            _appShare = appShare;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var menuItems = await _dataAccessService.GetMenuItemsAsync(_appShare.RoleId);

            return View(menuItems);
        }
    }
}
