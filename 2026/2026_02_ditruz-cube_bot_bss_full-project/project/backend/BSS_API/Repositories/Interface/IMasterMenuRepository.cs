using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterMenuRepository : IGenericRepository<MasterMenu>
    {
        public Task<PagedData<MasterMenuViewData>> SearchMenu(
           PagedRequest<MasterMenuRequest> request,
           CancellationToken ct = default);
    }
}

