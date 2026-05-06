using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;

namespace BSS_WEB.Interfaces
{
    public interface IMasterZoneService
    {
        Task<GetAllMasterZoneResult> GetAllMasterZonesAsync();
        Task<GetZoneByIdResult> GetZoneByIdAsync(int Id);
        Task<BaseServiceResult> CreateZoneAsync(CreateZoneRequest request);
        Task<BaseServiceResult> UpdateZoneAsync(UpdateZoneRequest request);
        Task<BaseServiceResult> DeleteZoneAsync(int Id);
        Task<GetAllMasterZoneResult> GetZoneByFilterAsync(ZoneFilterSearch request);
        Task<MasterZoneResult> SearchZoneAsync(PagedRequest<MasterZoneRequest> request);
    }
}
