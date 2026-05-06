using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchParameter;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterDropdownService
    {
        Task<BaseApiResponseWithData<List<DropDownItemResponse<object>>>> GetMasterDropdownAsync(SystemSearchRequest request);
        Task<BaseApiResponseWithData<List<DropDownItemResponse<GetAllMasterCashPoint>>>> GetMasterDropdownChashpointWithZoneAsync(SystemSearchRequest request);
    }
}
