using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterMenuService
    {
        Task<IEnumerable<MasterMenu>> GetAllMenu();
        Task CreateMenu(CreateMenuRequest request);
        Task UpdateMenu(UpdateMenuRequest request);
        Task<MasterMenuViewData> GetMenuById(int Id);
        Task DeleteMenu(int Id);
        Task<IEnumerable<MasterMenuActiveData>> GetMenuActiveList();
        Task<IEnumerable<MasterMenu>> GetMenuByUniqueOrKey(string menuName, string menuPath);
        Task<PagedData<MasterMenuViewData>> SearchMenu(PagedRequest<MasterMenuRequest> request);
    }
}
