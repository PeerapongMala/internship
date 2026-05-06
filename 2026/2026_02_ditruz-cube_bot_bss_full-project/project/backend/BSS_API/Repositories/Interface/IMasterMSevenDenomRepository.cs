using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterMSevenDenomRepository : IGenericRepository<MasterMSevenDenom>
    {
        Task<PagedData<MasterMSevenDenom>> SearchMasterMSevenDenom(
           PagedRequest<MasterMSevenDenomRequest> request,
           CancellationToken ct = default);

        Task<(string? SeriesCode, int? DenoId, int? SeriesDenomId)> LookupDenomAsync(
            string m7DenomCode, string m7DenomName, int denomPrice);
    }
}
