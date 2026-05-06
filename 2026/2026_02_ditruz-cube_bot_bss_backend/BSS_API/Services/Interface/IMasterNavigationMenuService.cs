using BSS_API.Models.ResponseModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterNavigationMenuService
    {
        IEnumerable<NavigationMenuViewModel> GetMenuByRoleId(int roleId);

    }
}
