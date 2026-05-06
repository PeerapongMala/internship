using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterStatusService
    {
        Task<IEnumerable<MasterStatus>> GetAllStatus();
        Task CreateStatus(CreateStatusRequest request);
        Task UpdateStatus(UpdateStatusRequest request);
        Task<MasterStatus> GetStatusById(int Id);
        Task DeleteStatus(int Id);
        Task<IEnumerable<MasterStatus>> GetStatusByUniqueOrKey(string statusCode);
        Task<PagedData<MasterStatus>> SearchStatus(PagedRequest<MasterStatusRequest> request);
    }
}
