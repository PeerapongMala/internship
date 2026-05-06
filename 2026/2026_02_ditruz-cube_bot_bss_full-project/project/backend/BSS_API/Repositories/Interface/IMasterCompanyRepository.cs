using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterCompanyRepository : IGenericRepository<MasterCompany>
    {
        public Task<PagedData<MasterCompany>> SearchCompany(
            PagedRequest<MasterCompanyRequest> request,
            CancellationToken ct = default);
    }
}




