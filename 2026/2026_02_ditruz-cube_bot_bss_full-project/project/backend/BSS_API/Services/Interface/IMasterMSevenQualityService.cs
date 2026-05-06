using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterMSevenQualityService
    {
        Task<IEnumerable<MasterMSevenQuality>> GetAllMSevenQuality();
        Task CreateMSevenQuality(CreateMSevenQualityRequest request);
        Task UpdateMSevenQuality(UpdateMSevenQualityRequest request);
        Task<MasterMSevenQuality> GetMSevenQualityById(int Id);
        Task DeleteMSevenQuality(int Id);
        Task<IEnumerable<MasterMSevenQuality>> GetMSevenQualityByUniqueOrKey(string m7QualityCode);
        Task<PagedData<MasterMSevenQuality>> SearchMSevenQuality(PagedRequest<MasterMSevenQualityRequest> request);


    }
}