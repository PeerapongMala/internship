using BSS_WEB.Models;
using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Interfaces
{
    public interface IDataAccessService
    {
        Task<List<NavigationMenuViewModel>> GetMenuItemsAsync(int roleId);
    }
}
