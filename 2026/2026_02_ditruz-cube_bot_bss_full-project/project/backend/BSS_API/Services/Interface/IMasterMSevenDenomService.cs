using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterMSevenDenomService
    {
        Task<IEnumerable<MasterMSevenDenom>> GetAllMSevenDenom();
        Task CreateMSevenDenom(CreateMSevenDenomRequest request);
        Task UpdateMSevenDenom(UpdateMSevenDenomRequest request);
        Task<MasterMSevenDenomViewData> GetMSevenDenomById(int Id);
        Task DeleteMSevenDenom(int Id);
        Task<IEnumerable<MasterMSevenDenomViewData>> GetMSevenDenomByFilter(MSevenDenomFilterRequest request);
        Task<IEnumerable<MasterMSevenDenom>> GetMSevenDenomByUniqueOrKey(string m7DenomCode, string m7DenomName, int denoId);

        Task<PagedData<MasterMSevenDenomViewData>> SearchMSevenDenom(PagedRequest<MasterMSevenDenomRequest> request);


    }
}
