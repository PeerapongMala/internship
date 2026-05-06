using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterMSevenOutputService
    {
        Task<IEnumerable<MasterMSevenOutput>> GetAllMSevenOutput();
        Task CreateMSevenOutput(CreateMSevenOutputRequest request);
        Task UpdateMSevenOutput(UpdateMSevenOutputRequest request);
        Task<MasterMSevenOutput> GetMSevenOutputById(int Id);
        Task DeleteMSevenOutput(int Id);
        Task<IEnumerable<MasterMSevenOutput>> GetMSevenOutputByUniqueOrKey(string mSevenOutputCode);
        Task<PagedData<MasterMSevenOutput>> SearchMSevenOutput(PagedRequest<MasterMSevenOutputRequest> request);


    }
}
